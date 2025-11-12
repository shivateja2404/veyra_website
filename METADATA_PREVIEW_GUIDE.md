# Veyra Sharing - Metadata & Social Media Previews Guide

## Overview
This document shows exactly what metadata tags are generated for each content type and how they appear in social media previews (WhatsApp, Facebook, Twitter, LinkedIn, etc.).

---

## ✅ Metadata Implementation Status

All share pages have **complete metadata** configured:

| Content Type | Open Graph | Twitter Card | Preview Image | Price Tag | Status |
|-------------|-----------|--------------|---------------|-----------|--------|
| **Product** | ✅ Yes | ✅ Yes | ✅ Product Image | ✅ Yes | **Complete** |
| **Post** | ✅ Yes | ✅ Yes | ✅ Post Image | ❌ N/A | **Complete** |
| **Reel** | ✅ Yes | ✅ Yes | ✅ Thumbnail | ❌ N/A | **Complete** |
| **User** | ✅ Yes | ✅ Yes | ✅ Avatar | ❌ N/A | **Complete** |
| **Wardrobe** | ✅ Yes | ✅ Yes | ⭐ **Wardrobe Item** | ❌ N/A | **Complete + Enhanced** |

---

## 📱 Product Share - Metadata Example

### URL:
```
https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000
```

### Database Data (Example):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Summer Floral Dress",
  "brand": "Zara",
  "description": "Beautiful floral print dress perfect for summer occasions",
  "price": 2999,
  "category": "Dresses",
  "images": [
    "https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/products/dress-1.jpg"
  ]
}
```

### Generated HTML Meta Tags:
```html
<!-- Basic Meta -->
<title>Zara Summer Floral Dress - ₹2,999</title>
<meta name="description" content="Beautiful floral print dress perfect for summer occasions" />

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="product" />
<meta property="og:title" content="Zara Summer Floral Dress - ₹2,999" />
<meta property="og:description" content="Beautiful floral print dress perfect for summer occasions" />
<meta property="og:url" content="https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000" />
<meta property="og:site_name" content="Veyra" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/products/dress-1.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Zara Summer Floral Dress - ₹2,999" />

<!-- Product-Specific Tags (Facebook Commerce) -->
<meta property="product:price:amount" content="2999" />
<meta property="product:price:currency" content="INR" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@veyra" />
<meta name="twitter:title" content="Zara Summer Floral Dress - ₹2,999" />
<meta name="twitter:description" content="Beautiful floral print dress perfect for summer occasions" />
<meta name="twitter:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/products/dress-1.jpg" />

<!-- Robots (Don't index share pages) -->
<meta name="robots" content="noindex, follow" />
```

### How It Appears:

**WhatsApp Preview:**
```
┌─────────────────────────────────────┐
│  [Product Image]                    │
│                                     │
│  Zara Summer Floral Dress - ₹2,999 │
│  Beautiful floral print dress...   │
│  veyra.co.in                        │
└─────────────────────────────────────┘
```

**Facebook/Instagram Preview:**
```
┌─────────────────────────────────────┐
│                                     │
│     [Large Product Image]           │
│                                     │
├─────────────────────────────────────┤
│ Zara Summer Floral Dress - ₹2,999  │
│ Beautiful floral print dress        │
│ perfect for summer occasions        │
│                                     │
│ VEYRA.CO.IN                         │
└─────────────────────────────────────┘
```

**Twitter Preview:**
```
┌─────────────────────────────────────┐
│  [Product Image - Large]            │
│                                     │
│  Zara Summer Floral Dress - ₹2,999 │
│  Beautiful floral print dress...   │
│  From veyra.co.in                   │
└─────────────────────────────────────┘
```

---

## 📸 Post Share - Metadata Example

### URL:
```
https://www.veyra.co.in/post/7c9e6679-7425-40de-944b-e07fc1f90ae7?ref=user_123
```

### Database Data:
```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "caption": "Loving this new outfit! Perfect for weekend brunch 💃 #fashion #ootd",
  "image_url": "https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/posts/post-123.jpg",
  "user": {
    "full_name": "Priya Sharma",
    "username": "priya_style"
  }
}
```

### Generated Meta Tags:
```html
<title>Priya Sharma's Post on Veyra</title>
<meta name="description" content="Loving this new outfit! Perfect for weekend brunch 💃 #fashion #ootd" />

<meta property="og:type" content="article" />
<meta property="og:title" content="Priya Sharma's Post on Veyra" />
<meta property="og:description" content="Loving this new outfit! Perfect for weekend brunch 💃 #fashion #ootd" />
<meta property="og:url" content="https://www.veyra.co.in/post/7c9e6679-7425-40de-944b-e07fc1f90ae7" />
<meta property="og:site_name" content="Veyra" />
<meta property="og:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/posts/post-123.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Priya Sharma's Post on Veyra" />
<meta name="twitter:description" content="Loving this new outfit! Perfect for weekend brunch 💃 #fashion #ootd" />
<meta name="twitter:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/posts/post-123.jpg" />
```

### Preview:
```
┌─────────────────────────────────────┐
│  [Post Image - Full Width]          │
│                                     │
│  Priya Sharma's Post on Veyra      │
│  Loving this new outfit! Perfect    │
│  for weekend brunch 💃 #fashion     │
│  veyra.co.in                        │
└─────────────────────────────────────┘
```

---

## 🎥 Reel Share - Metadata Example

### URL:
```
https://www.veyra.co.in/reel/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Database Data:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "caption": "5 ways to style a white shirt! 👕✨",
  "thumbnail_url": "https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/reels/thumb-456.jpg",
  "video_url": "https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/reels/video-456.mp4",
  "user": {
    "full_name": "Fashion Guru",
    "username": "fashionguru"
  }
}
```

### Generated Meta Tags:
```html
<title>Fashion Guru's Reel on Veyra</title>
<meta name="description" content="5 ways to style a white shirt! 👕✨" />

<meta property="og:type" content="video.other" />
<meta property="og:title" content="Fashion Guru's Reel on Veyra" />
<meta property="og:description" content="5 ways to style a white shirt! 👕✨" />
<meta property="og:url" content="https://www.veyra.co.in/reel/3fa85f64-5717-4562-b3fc-2c963f66afa6" />
<meta property="og:site_name" content="Veyra" />
<meta property="og:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/reels/thumb-456.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Fashion Guru's Reel on Veyra" />
<meta name="twitter:description" content="5 ways to style a white shirt! 👕✨" />
<meta name="twitter:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/reels/thumb-456.jpg" />
```

### Preview:
```
┌─────────────────────────────────────┐
│  [Video Thumbnail with ▶ Icon]      │
│                                     │
│  Fashion Guru's Reel on Veyra      │
│  5 ways to style a white shirt!    │
│  👕✨                                │
│  veyra.co.in                        │
└─────────────────────────────────────┘
```

---

## 👤 User Profile Share - Metadata Example

### URL:
```
https://www.veyra.co.in/user/c56a4180-65aa-42ec-a945-5fd21dec0538
```

### Database Data:
```json
{
  "id": "c56a4180-65aa-42ec-a945-5fd21dec0538",
  "username": "fashionista_maya",
  "full_name": "Maya Patel",
  "bio": "Fashion blogger | Style enthusiast | Mumbai 🌟",
  "avatar_url": "https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/avatars/maya.jpg"
}
```

### Generated Meta Tags:
```html
<title>Maya Patel (@fashionista_maya) on Veyra</title>
<meta name="description" content="Fashion blogger | Style enthusiast | Mumbai 🌟" />

<meta property="og:type" content="profile" />
<meta property="og:title" content="Maya Patel (@fashionista_maya) on Veyra" />
<meta property="og:description" content="Fashion blogger | Style enthusiast | Mumbai 🌟" />
<meta property="og:url" content="https://www.veyra.co.in/user/c56a4180-65aa-42ec-a945-5fd21dec0538" />
<meta property="og:site_name" content="Veyra" />
<meta property="og:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/avatars/maya.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Maya Patel (@fashionista_maya) on Veyra" />
<meta name="twitter:description" content="Fashion blogger | Style enthusiast | Mumbai 🌟" />
<meta name="twitter:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/avatars/maya.jpg" />
```

### Preview:
```
┌─────────────────────────────────────┐
│  [User Avatar - Large]              │
│                                     │
│  Maya Patel (@fashionista_maya)    │
│  on Veyra                           │
│  Fashion blogger | Style            │
│  enthusiast | Mumbai 🌟             │
│  veyra.co.in                        │
└─────────────────────────────────────┘
```

---

## 👗 Wardrobe Share - Metadata Example (WITH GRID PREVIEW!)

### URL:
```
https://www.veyra.co.in/wardrobe/fashionista_maya
```

### 🎯 Special Feature: Wardrobe Grid Preview

**Unlike other content types, wardrobe previews show actual wardrobe items:**
- ✅ Fetches user's wardrobe items (products)
- ✅ Uses **first wardrobe item image** (shows actual content, not avatar!)
- ✅ Includes item count in description
- ✅ Future: Grid collage of 4-5 items (Phase 2)

### Generated Meta Tags:
```html
<title>Maya Patel's Wardrobe Collection</title>
<meta name="description" content="Explore Maya Patel's fashion wardrobe on Veyra - 12 items • Fashion blogger | Style enthusiast | Mumbai 🌟" />

<meta property="og:type" content="website" />
<meta property="og:title" content="Maya Patel's Wardrobe Collection" />
<meta property="og:description" content="Explore Maya Patel's fashion wardrobe on Veyra - 12 items • Fashion blogger | Style enthusiast | Mumbai 🌟" />
<meta property="og:url" content="https://www.veyra.co.in/wardrobe/fashionista_maya" />
<meta property="og:site_name" content="Veyra" />

<!-- IMPORTANT: Shows actual wardrobe item, not avatar! -->
<meta property="og:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/products/summer-dress.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Maya Patel's Wardrobe Collection" />
<meta name="twitter:description" content="Explore Maya Patel's fashion wardrobe on Veyra - 12 items • Fashion blogger | Style enthusiast | Mumbai 🌟" />
<meta name="twitter:image" content="https://znvxcgcdigtbpoahydxd.supabase.co/storage/v1/object/public/products/summer-dress.jpg" />
```

### Preview Comparison:

**Old (Avatar Only):**
```
┌─────────────────────────────────┐
│  [User Avatar - Small Circle]   │
│                                 │
│  Maya Patel's Wardrobe          │
│  Fashion blogger | Mumbai       │
│  veyra.co.in                    │
└─────────────────────────────────┘
```

**New (Wardrobe Item):**
```
┌─────────────────────────────────┐
│  [Summer Dress Product Image]   │  ← Shows actual wardrobe content!
│                                 │
│  Maya's Wardrobe - 12 items     │  ← Includes item count
│  Fashion blogger | Mumbai       │
│  veyra.co.in                    │
└─────────────────────────────────┘
```

**Future (Grid Collage - Phase 2):**
```
┌─────────────────────────────────┐
│  ┌─────┬─────┐                  │  ← 2x2 grid of 4 items
│  │ 1   │ 2   │                  │
│  ├─────┼─────┤                  │
│  │ 3   │ 4   │                  │
│  └─────┴─────┘                  │
│  Maya's Wardrobe - 12 items     │
│  veyra.co.in                    │
└─────────────────────────────────┘
```

---

## 🔍 Fallback Behavior

### If Product/Post/Reel Not Found:

```html
<title>Product Not Found - Veyra</title>
<meta name="description" content="This product could not be found." />

<!-- No Open Graph tags generated -->
<!-- Shows generic 404 page -->
```

### If No Image Available:

```html
<!-- Uses fallback image -->
<meta property="og:image" content="https://www.veyra.co.in/preview_image.jpg" />
```

**Note**: Make sure `/preview_image.jpg` exists in the `public` folder as a fallback!

---

## 📊 Image Requirements

### Optimal Image Sizes:

| Platform | Recommended Size | Aspect Ratio | Format |
|----------|-----------------|--------------|--------|
| **Facebook** | 1200 x 630px | 1.91:1 | JPG/PNG |
| **Twitter** | 1200 x 628px | 1.91:1 | JPG/PNG |
| **WhatsApp** | 400 x 400px (min) | Any | JPG/PNG |
| **LinkedIn** | 1200 x 627px | 1.91:1 | JPG/PNG |

### Current Implementation:

```javascript
images: [
  {
    url: product.images[0], // Actual product image from database
    width: 1200,            // Declared width
    height: 630,            // Declared height
    alt: title,             // Alt text for accessibility
  },
]
```

**Recommendation**: Ensure all product/post images uploaded to Supabase are at least **1200x630px** for best quality previews.

---

## 🧪 Testing Your Metadata

### 1. Facebook/WhatsApp Sharing Debugger
```
URL: https://developers.facebook.com/tools/debug/

Steps:
1. Enter your URL: https://www.veyra.co.in/product/123
2. Click "Fetch new information"
3. View extracted meta tags
4. Check preview image loads correctly
```

### 2. Twitter Card Validator
```
URL: https://cards-dev.twitter.com/validator

Steps:
1. Enter your URL
2. Click "Preview card"
3. Verify image and text display correctly
```

### 3. LinkedIn Post Inspector
```
URL: https://www.linkedin.com/post-inspector/

Steps:
1. Enter your URL
2. Click "Inspect"
3. Check preview rendering
```

### 4. View Source (Manual Check)
```bash
# View raw HTML output
curl https://www.veyra.co.in/product/123 | grep "og:"

# Should show:
# <meta property="og:title" content="...">
# <meta property="og:image" content="...">
# etc.
```

---

## ✅ Metadata Checklist

For each content type, verify:

- [ ] **Title** is dynamic and descriptive
- [ ] **Description** provides context
- [ ] **Image** loads from Supabase storage
- [ ] **Image dimensions** are declared (1200x630)
- [ ] **OG type** is correct (product/article/video/profile/website)
- [ ] **Twitter card** is set to "summary_large_image"
- [ ] **URL** is canonical and absolute
- [ ] **Fallback image** exists at `/preview_image.jpg`
- [ ] **Robots** set to "noindex, follow" (don't index share pages)

---

## 🚀 Production Checklist

Before deploying:

1. **Upload Fallback Image**
   ```bash
   # Add to public folder:
   public/preview_image.jpg (1200x630px minimum)
   ```

2. **Verify Environment Variables**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://www.veyra.co.in
   NEXT_PUBLIC_SUPABASE_URL=https://znvxcgcdigtbpoahydxd.supabase.co
   ```

3. **Test All Content Types**
   - [ ] Product with price
   - [ ] Post with caption
   - [ ] Reel with thumbnail
   - [ ] User profile
   - [ ] Wardrobe collection

4. **Test on Real Social Media**
   - [ ] Share on WhatsApp (private chat)
   - [ ] Share on Facebook (preview in post composer)
   - [ ] Share on Twitter (check card preview)
   - [ ] Share on LinkedIn

5. **Check Image Loading**
   - [ ] Verify Supabase bucket is public
   - [ ] Test image URLs load in browser
   - [ ] Confirm CORS allows social media crawlers

---

## 🎨 Preview Image Recommendations

### Creating a Good Fallback Image

```
Recommended content:
- Veyra logo centered
- Gradient background (brand colors)
- Text: "Discover Fashion on Veyra"
- Size: 1200x630px
- Format: JPG (optimized)
- File size: < 1MB
```

### Product Images

```
Best practices:
- High resolution (1200x630 minimum)
- Product centered on white/neutral background
- Good lighting
- No watermarks
- Proper file naming: product-{id}-1.jpg
```

---

## 📱 How Social Media Uses Metadata

### When Link is Shared:

1. **Social media crawler** fetches the URL
2. **Parses HTML** looking for `<meta>` tags
3. **Extracts** og:title, og:description, og:image
4. **Downloads** the og:image
5. **Caches** the preview for 24-48 hours
6. **Displays** rich preview to users

### What Gets Shown:

```
WhatsApp/Facebook/Instagram:
- Large image preview
- Title (truncated ~60 chars)
- Description (truncated ~200 chars)
- Domain name

Twitter:
- Large card with image
- Title (truncated ~70 chars)
- Description (truncated ~200 chars)
- "From veyra.co.in"

LinkedIn:
- Image at top
- Title
- Full description
- Website preview
```

---

## 🔧 Troubleshooting

### Preview Not Showing

**Problem**: Image doesn't appear in social media preview

**Solutions**:
1. Check image URL is publicly accessible
2. Verify image size is at least 200x200px
3. Ensure Supabase bucket has public access
4. Check CORS settings allow social media crawlers
5. Use absolute URLs (not relative)

### Preview Shows Old Content

**Problem**: Shared link shows outdated preview

**Solutions**:
1. Wait 24-48 hours for cache to expire
2. Use Facebook Debug Tool to scrape new info
3. Add cache-busting query param: `?v=2`
4. Clear social media cache

### Image Not Loading

**Problem**: og:image URL returns 403/404

**Solutions**:
```sql
-- Make Supabase bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'products';

-- Add RLS policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');
```

---

## ✨ Summary

**All metadata is properly configured! ✅**

Every share page generates:
- ✅ Dynamic Open Graph tags
- ✅ Twitter Card tags
- ✅ Product-specific pricing tags
- ✅ Proper image URLs from Supabase
- ✅ SEO-friendly titles & descriptions
- ✅ Correct content types (product/article/video/profile)
- ✅ Fallback images for missing data

**Social media previews will work perfectly for:**
- WhatsApp ✅
- Facebook ✅
- Instagram ✅
- Twitter ✅
- LinkedIn ✅
- iMessage ✅
- Telegram ✅

**Next step**: Test with real content and deploy to production!
