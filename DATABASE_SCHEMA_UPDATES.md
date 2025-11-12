# Database Schema Updates - Wardrobe & Sharing Feature

## Date: January 12, 2025
## Status: ✅ COMPLETE

---

## Summary of Changes

Updated all data fetching queries to properly use the correct database relationships according to the schema. The main issue was that wardrobe items were being incorrectly queried directly from the `products` table, when they should be queried through the `wardrobe_items` junction table.

---

## Database Structure

### 1. **Wardrobe Items Relationship**

```
profiles (users)
    ↓ (user_id)
wardrobe_items (junction table)
    ↓ (product_id)
products
    ↓ (id)
product_images (images for products)
```

**Key Points:**
- `wardrobe_items` is a junction table linking users to products
- Products do NOT have a direct `user_id` field
- Users are linked to products through `wardrobe_items`
- Product images are stored in separate `product_images` table
- Each wardrobe item can be marked as private (`is_private`)
- Wardrobe items can be soft-deleted (`removed_at`)

### 2. **Wardrobe Items Table Schema**

```sql
create table public.wardrobe_items (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,              -- References profiles(id)
  product_id uuid not null,           -- References products(id)
  product_variant_id uuid not null,   -- References product_variants(id)
  added_at timestamp with time zone null default now(),
  removed_at timestamp with time zone null,  -- Soft delete
  is_private boolean not null default false,
  constraint wardrobe_items_pkey primary key (id),
  constraint wardrobe_items_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint wardrobe_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint wardrobe_items_variant_id_fkey foreign KEY (product_variant_id) references product_variants (id) on delete CASCADE
);
```

### 3. **Product Images Table Schema**

```sql
create table public.product_images (
  id uuid not null default gen_random_uuid(),
  product_id uuid not null,
  image_url character varying(500) not null,
  alt_text character varying(255) null,
  is_primary boolean null default false,    -- Primary/featured image
  display_order integer null default 0,      -- Order for gallery
  created_at timestamp with time zone null default now(),
  constraint product_images_pkey primary key (id),
  constraint product_images_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
);
```

---

## Files Updated

### 1. **`src/app/wardrobe/[username]/page.tsx`**

**BEFORE (INCORRECT):**
```typescript
const { data: wardrobeItems } = await supabase
  .from('products')
  .select('images')
  .eq('user_id', profile.id)  // ❌ products don't have user_id!
  .limit(5);
```

**AFTER (CORRECT):**
```typescript
const { data: wardrobeItems } = await supabase
  .from('wardrobe_items')
  .select(`
    id,
    product_id,
    products!inner (
      id,
      name,
      product_images!inner (
        image_url,
        is_primary,
        display_order
      )
    )
  `)
  .eq('user_id', profile.id)
  .is('removed_at', null)        // ✅ Only active items
  .eq('is_private', false)        // ✅ Only public items
  .order('added_at', { ascending: false })
  .limit(5);
```

**Key Changes:**
- Query starts from `wardrobe_items` table (junction table)
- Joins with `products` table using `products!inner`
- Joins with `product_images` table to get actual images
- Filters out removed items (`removed_at IS NULL`)
- Filters out private items (`is_private = false`)
- Orders by `added_at` to show newest items first

---

### 2. **`src/app/api/wardrobe-preview/route.ts`**

**BEFORE (INCORRECT):**
```typescript
const { data: wardrobeItems } = await supabase
  .from('products')
  .select('id, name, images')
  .eq('user_id', profile.id)  // ❌ Wrong relationship
  .limit(6);

const imageUrls = wardrobeItems
  ?.filter(item => item.images && item.images.length > 0)
  .map(item => item.images[0]) || [];
```

**AFTER (CORRECT):**
```typescript
const { data: wardrobeItems } = await supabase
  .from('wardrobe_items')
  .select(`
    id,
    product_id,
    products!inner (
      id,
      name,
      product_images!inner (
        image_url,
        is_primary,
        display_order
      )
    )
  `)
  .eq('user_id', profile.id)
  .is('removed_at', null)
  .eq('is_private', false)
  .order('added_at', { ascending: false })
  .limit(6);

// Extract images with proper sorting (primary first)
const imageUrls = wardrobeItems
  ?.map(item => {
    const product = item.products;
    const images = product?.product_images || [];

    // Sort: primary image first, then by display_order
    const sortedImages = [...images].sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.display_order || 0) - (b.display_order || 0);
    });

    return sortedImages[0]?.image_url;
  })
  .filter(Boolean)
  .slice(0, 4) || [];
```

**Key Changes:**
- Proper join through `wardrobe_items` → `products` → `product_images`
- Prioritizes primary images (`is_primary = true`)
- Falls back to display order for non-primary images
- Returns actual image URLs from `product_images` table

---

### 3. **`src/app/r/[code]/page.tsx`**

**BEFORE (INCORRECT):**
```typescript
const { data: refLink } = await supabase
  .from('short_codes')
  .select('*')
  .eq('short_code', code)  // ❌ Column is 'code', not 'short_code'
  .single();

const targetUrl = `/${refLink.content_type}/${refLink.content_id}?ref=${refLink.creator_id}`;
```

**AFTER (CORRECT):**
```typescript
const { data: refLink } = await supabase
  .from('short_codes')
  .select('*')
  .eq('code', code)              // ✅ Correct column name
  .eq('is_active', true)         // ✅ Only active codes
  .single();

// Check expiration
if (refLink.expires_at && new Date(refLink.expires_at) < new Date()) {
  notFound();
}

const targetUrl = `/${refLink.content_type}/${refLink.content_id}?ref=${refLink.creator_user_id}`;
```

**Key Changes:**
- Column name changed from `short_code` to `code` (matches schema)
- Added `is_active` filter
- Added expiration check
- Changed `creator_id` to `creator_user_id` (matches schema)

---

### 4. **`src/lib/supabase.ts`**

**Added New Type Definitions:**

```typescript
// Product without direct user_id or images array
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  brand?: string;
  created_at?: string;
}

// Product images stored separately
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at?: string;
}

// Wardrobe junction table
export interface WardrobeItem {
  id: string;
  user_id: string;
  product_id: string;
  product_variant_id: string;
  added_at: string;
  removed_at?: string | null;
  is_private: boolean;
}

// Sharing feature types (from SQL migration)
export interface SharedLink { /* ... */ }
export interface ShortCode { /* ... */ }
export interface CreatorShare { /* ... */ }
export interface CreatorCommission { /* ... */ }
```

**Key Changes:**
- Removed `images: string[]` from Product (images come from `product_images` table)
- Removed `user_id` from Product (users linked through `wardrobe_items`)
- Added `ProductImage` interface for product images
- Added `WardrobeItem` interface for junction table
- Added sharing feature types matching SQL migration

---

## Database Relationships Diagram

```
┌─────────────┐
│  profiles   │
│  (users)    │
└──────┬──────┘
       │ user_id
       ↓
┌─────────────────┐
│ wardrobe_items  │  ← Junction table
│ - user_id       │
│ - product_id    │
│ - removed_at    │  ← Soft delete
│ - is_private    │  ← Privacy flag
└────────┬────────┘
         │ product_id
         ↓
    ┌─────────┐
    │ products│
    └────┬────┘
         │ id
         ↓
  ┌──────────────┐
  │product_images│  ← Actual images
  │ - image_url  │
  │ - is_primary │
  │ - display_order│
  └──────────────┘
```

---

## Short Codes Table (Referral System)

```
┌─────────────────┐
│  short_codes    │
│ - code          │  ← 7-char unique code (e.g., 'AbCdEfG')
│ - content_type  │  ← 'product', 'post', 'reel', 'wardrobe', 'profile'
│ - content_id    │  ← UUID of the content
│ - creator_user_id│ ← Creator who shared it
│ - is_active     │  ← Active/inactive flag
│ - expires_at    │  ← Optional expiration
│ - click_count   │  ← Tracking clicks
└─────────────────┘
```

**Usage:**
- Short URL: `veyra.co.in/r/AbCdEfG`
- Redirects to: `/product/uuid?ref=creator_uuid`

---

## Query Patterns

### ✅ Correct: Fetch User's Wardrobe Items

```typescript
// Get wardrobe items with product details and images
const { data } = await supabase
  .from('wardrobe_items')
  .select(`
    id,
    added_at,
    products (
      id,
      name,
      brand,
      price,
      product_images (
        image_url,
        is_primary,
        display_order
      )
    )
  `)
  .eq('user_id', userId)
  .is('removed_at', null)
  .eq('is_private', false)
  .order('added_at', { ascending: false });
```

### ❌ Incorrect: Query products directly

```typescript
// DON'T DO THIS - products don't have user_id!
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('user_id', userId);  // ❌ This field doesn't exist
```

---

## Benefits of This Structure

1. **Separation of Concerns**
   - Products exist independently
   - Users can add products to wardrobe without duplicating product data
   - Product images managed separately for flexibility

2. **Privacy Control**
   - Wardrobe items can be marked as private
   - Users control what's visible in their public wardrobe

3. **Soft Deletes**
   - Items can be removed from wardrobe without deleting
   - Maintains history and analytics

4. **Image Management**
   - Multiple images per product
   - Primary image flag for featured display
   - Display order for galleries
   - Easy to add/remove/reorder images

5. **Referral Tracking**
   - Short codes for easy sharing
   - Click tracking and analytics
   - Expiration support
   - Active/inactive status

---

## Testing

### Test Wardrobe with Real Data:

```sql
-- 1. Create a test product
INSERT INTO products (id, name, price, brand, description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Dress',
  2999,
  'TestBrand',
  'A beautiful test dress'
);

-- 2. Add product images
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://example.com/dress1.jpg', true, 0),
  ('00000000-0000-0000-0000-000000000001', 'https://example.com/dress2.jpg', false, 1);

-- 3. Add to user's wardrobe
INSERT INTO wardrobe_items (user_id, product_id, product_variant_id)
VALUES (
  'your-user-id',
  '00000000-0000-0000-0000-000000000001',
  'variant-id'
);

-- 4. Test the wardrobe endpoint
-- Visit: http://localhost:3003/wardrobe/your-username
-- Should show the grid collage with your product images
```

### Test Referral Short Code:

```sql
-- 1. Create a short code
INSERT INTO short_codes (code, content_type, content_id, creator_user_id, full_url, is_active)
VALUES (
  'TEST123',
  'product',
  '00000000-0000-0000-0000-000000000001',
  'your-user-id',
  'https://www.veyra.co.in/product/00000000-0000-0000-0000-000000000001',
  true
);

-- 2. Test the redirect
-- Visit: http://localhost:3003/r/TEST123
-- Should redirect to: /product/00000000-0000-0000-0000-000000000001?ref=your-user-id
```

---

## Migration Required

To apply these schema changes to your database, run:

```bash
# Execute the SQL migration file
psql -d your_database < 20250111_sharing_feature_complete.sql

# Or in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Paste contents of 20250111_sharing_feature_complete.sql
# 3. Run the migration
```

---

## Verification Checklist

- [x] Wardrobe items query through `wardrobe_items` table
- [x] Product images fetched from `product_images` table
- [x] Wardrobe filters out removed items (`removed_at IS NULL`)
- [x] Wardrobe filters out private items (`is_private = false`)
- [x] Primary images prioritized in image selection
- [x] Short codes use `code` column (not `short_code`)
- [x] Short codes check `is_active` status
- [x] Short codes check expiration date
- [x] Type definitions updated to match schema
- [x] All queries compile without TypeScript errors

---

## Next Steps

1. **Run SQL Migration**
   - Execute `20250111_sharing_feature_complete.sql` in Supabase

2. **Add Test Data**
   - Create test products, images, and wardrobe items
   - Create test short codes for referrals

3. **Test All Routes**
   - `/wardrobe/[username]` - Should show grid collage
   - `/api/wardrobe-preview?username=X` - Should generate collage
   - `/r/[code]` - Should redirect with tracking

4. **Monitor Triggers**
   - `wardrobe_count_trigger` - Auto-updates item count
   - `wardrobe_preview_invalidation_trigger` - Marks preview as stale

5. **Deploy to Production**
   - Verify environment variables
   - Test with real data
   - Monitor error logs

---

## Summary

All database queries have been updated to properly use the correct relationships according to the schema. The wardrobe feature now correctly queries through the `wardrobe_items` junction table and fetches images from the `product_images` table. Referral tracking uses the correct column names from the SQL migration.

**Status**: ✅ **READY FOR TESTING**

All TypeScript compilation successful, no errors. Ready to test with real database data.
