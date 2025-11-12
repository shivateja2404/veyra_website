# Veyra Sharing - Redirect Flow Examples

## Overview
This document shows exactly how URLs redirect from source to destination, including deep linking and referral tracking.

---

## 📱 Redirect Flow Diagram

```
Source URL (Shared Link)
        ↓
Website Page Loads (Next.js SSR)
        ↓
Client-Side JavaScript Executes
        ↓
Attempts Deep Link (veyraapp://)
        ↓
    ┌───────┴────────┐
    ↓                ↓
App Installed    App Not Installed
    ↓                ↓
Opens App        Shows Download Page
```

---

## 1️⃣ Product Sharing

### Example A: Basic Product Share (No Referral)

**Source URL** (What user receives):
```
https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000
```

**Flow**:
1. Browser opens: `https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000`
2. Next.js renders `src/app/product/[id]/page.tsx`
3. Fetches product data from Supabase
4. Renders `SharePage` component
5. JavaScript attempts deep link:
   ```
   veyraapp://product/550e8400-e29b-41d4-a716-446655440000
   ```

**Destination** (If app installed):
```
Mobile App → Product Detail Screen
Product ID: 550e8400-e29b-41d4-a716-446655440000
Referral: None
```

**Destination** (If app NOT installed):
```
Website → Download Page
Shows: Product preview + Download buttons
```

---

### Example B: Product Share WITH Referral

**Source URL** (Shared by creator):
```
https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000?ref=creator_abc123
```

**Flow**:
1. Browser opens URL with `?ref=creator_abc123`
2. Page renders and stores ref in cookies:
   ```javascript
   document.cookie = "veyra_ref=creator_abc123; max-age=2592000; path=/"
   sessionStorage.setItem("veyra_ref", "creator_abc123")
   ```
3. JavaScript attempts deep link WITH ref:
   ```
   veyraapp://product/550e8400-e29b-41d4-a716-446655440000?ref=creator_abc123
   ```

**Destination** (If app installed):
```
Mobile App → Product Detail Screen
Product ID: 550e8400-e29b-41d4-a716-446655440000
Referral: creator_abc123 ✅ (tracked for attribution)
```

**Cookie Set**:
```
veyra_ref=creator_abc123
Expires: 30 days from click
```

---

## 2️⃣ Short Code Redirects

### Example C: Short Code → Product with Auto-Referral

**Source URL** (Short code shared):
```
https://www.veyra.co.in/r/SUMMER2024
```

**Database Entry** (`short_codes` table):
```json
{
  "short_code": "SUMMER2024",
  "content_type": "product",
  "content_id": "550e8400-e29b-41d4-a716-446655440000",
  "creator_id": "creator_abc123",
  "click_count": 42
}
```

**Flow**:
1. Browser opens: `https://www.veyra.co.in/r/SUMMER2024`
2. Next.js handler `src/app/r/[code]/page.tsx` executes
3. Looks up `SUMMER2024` in database
4. Increments `click_count` to 43
5. **Server-side redirect** (HTTP 307):
   ```
   REDIRECT TO:
   https://www.veyra.co.in/product/550e8400-e29b-41d4-a716-446655440000?ref=creator_abc123
   ```

6. Now follows Example B flow above (Product with Referral)

**Final Destination**:
```
Mobile App → Product Detail Screen
Product ID: 550e8400-e29b-41d4-a716-446655440000
Referral: creator_abc123 ✅ (auto-tracked from short code)
Click Count: Incremented in database
```

---

## 3️⃣ Post Sharing

### Example D: Post Share

**Source URL**:
```
https://www.veyra.co.in/post/7c9e6679-7425-40de-944b-e07fc1f90ae7?ref=user_xyz789
```

**Flow**:
1. Browser opens URL
2. Page fetches post data from `posts` table
3. Renders post preview with caption and image
4. Stores `ref=user_xyz789` in cookies
5. Attempts deep link:
   ```
   veyraapp://post/7c9e6679-7425-40de-944b-e07fc1f90ae7?ref=user_xyz789
   ```

**Destination**:
```
Mobile App → Post Detail Screen
Post ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7
Referral: user_xyz789 ✅
```

---

## 4️⃣ Reel Sharing

### Example E: Reel Share

**Source URL**:
```
https://www.veyra.co.in/reel/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Flow**:
1. Browser opens URL
2. Fetches reel thumbnail and caption
3. Generates video Open Graph tags
4. Attempts deep link:
   ```
   veyraapp://reel/3fa85f64-5717-4562-b3fc-2c963f66afa6
   ```

**Destination**:
```
Mobile App → Reel Player Screen
Reel ID: 3fa85f64-5717-4562-b3fc-2c963f66afa6
Auto-plays video
```

---

## 5️⃣ User Profile Sharing

### Example F: User Profile

**Source URL**:
```
https://www.veyra.co.in/user/c56a4180-65aa-42ec-a945-5fd21dec0538?ref=friend_123
```

**Flow**:
1. Browser opens URL
2. Fetches user profile from `profiles` table
3. Shows avatar, name, and bio
4. Stores referral
5. Attempts deep link:
   ```
   veyraapp://user/c56a4180-65aa-42ec-a945-5fd21dec0538?ref=friend_123
   ```

**Destination**:
```
Mobile App → User Profile Screen
User ID: c56a4180-65aa-42ec-a945-5fd21dec0538
Referral: friend_123 ✅
```

---

## 6️⃣ Wardrobe Sharing

### Example G: Wardrobe Collection

**Source URL**:
```
https://www.veyra.co.in/wardrobe/fashionista_maya
```

**Flow**:
1. Browser opens URL
2. Looks up username `fashionista_maya` in `profiles` table
3. Fetches wardrobe items
4. Attempts deep link:
   ```
   veyraapp://wardrobe/fashionista_maya
   ```

**Destination**:
```
Mobile App → Wardrobe Screen
Username: fashionista_maya
Shows: User's wardrobe collection
```

---

## 🔄 Complete Multi-Hop Example

### Example H: Short Code → Product → App (Full Journey)

**User Journey**:

**Step 1**: Creator shares short link
```
Source: https://www.veyra.co.in/r/PROMO50
```

**Step 2**: Server-side redirect (HTTP 307)
```
Redirect: https://www.veyra.co.in/product/abc-123-def?ref=creator_xyz
```

**Step 3**: Client receives redirected URL
```
Browser URL: https://www.veyra.co.in/product/abc-123-def?ref=creator_xyz
Cookies set: veyra_ref=creator_xyz (30 days)
```

**Step 4**: JavaScript deep link attempt
```
Deep Link: veyraapp://product/abc-123-def?ref=creator_xyz
```

**Step 5A**: If app installed
```
Final Destination: Veyra App → Product Screen
Product: abc-123-def
Referral: creator_xyz ✅ TRACKED
```

**Step 5B**: If app NOT installed
```
Final Destination: Download Page
Shows:
- Product preview image
- Product name and price
- "Download for Android" button
- "Download for iOS" button
- Cookie still set for attribution when they install later
```

---

## 📊 Redirect Types Summary

| Source Pattern | Redirect Type | Destination | Ref Tracking |
|---------------|---------------|-------------|--------------|
| `/product/{id}` | Client-side (JavaScript) | `veyraapp://product/{id}` | Manual via `?ref=` |
| `/post/{id}` | Client-side | `veyraapp://post/{id}` | Manual via `?ref=` |
| `/reel/{id}` | Client-side | `veyraapp://reel/{id}` | Manual via `?ref=` |
| `/user/{id}` | Client-side | `veyraapp://user/{id}` | Manual via `?ref=` |
| `/wardrobe/{username}` | Client-side | `veyraapp://wardrobe/{username}` | Manual via `?ref=` |
| `/r/{code}` | **Server-side (HTTP 307)** | `/product/{id}?ref={creator}` | **Auto from database** |

---

## 🍪 Cookie & Storage Tracking

### When URL has `?ref=creator_123`:

**Cookies Set**:
```javascript
// Cookie (survives browser close, 30 days)
document.cookie = "veyra_ref=creator_123; max-age=2592000; path=/; SameSite=Lax"

// Session Storage (cleared on browser close)
sessionStorage.setItem("veyra_ref", "creator_123")
```

**Deep Link Generated**:
```
veyraapp://product/abc-123?ref=creator_123
```

**Mobile App Receives**:
```javascript
// Parse deep link URL
const url = new URL("veyraapp://product/abc-123?ref=creator_123");
const ref = url.searchParams.get("ref"); // "creator_123"

// Store in app
AsyncStorage.setItem("referral_user", ref);

// Use for attribution
if (userMakesPurchase) {
  creditReferrer(ref); // Credit creator_123
}
```

---

## 🧪 Testing Examples

### Test 1: Direct Product Link
```bash
curl -I https://www.veyra.co.in/product/123
# Response: 200 OK (page renders)
```

### Test 2: Short Code Redirect
```bash
curl -I https://www.veyra.co.in/r/TEST123
# Response: 307 Temporary Redirect
# Location: /product/456?ref=creator_789
```

### Test 3: With Referral Parameter
```bash
# Open in browser:
https://www.veyra.co.in/product/123?ref=user_abc

# Check cookies:
document.cookie
# Output: "veyra_ref=user_abc; ..."

# Check session storage:
sessionStorage.getItem("veyra_ref")
# Output: "user_abc"
```

---

## 🎯 Real-World Example

### Influencer Campaign

**Scenario**: Influencer @fashionblogger shares a product

**Step 1**: Create short code in database
```sql
INSERT INTO short_codes (short_code, content_type, content_id, creator_id)
VALUES ('BLOGGER10', 'product', '550e8400-...', 'user_blogger_id');
```

**Step 2**: Influencer shares
```
Instagram Bio: veyra.co.in/r/BLOGGER10
WhatsApp: Check out this product! veyra.co.in/r/BLOGGER10
Twitter: Love this! 👗 veyra.co.in/r/BLOGGER10
```

**Step 3**: User clicks link
```
Opens: https://www.veyra.co.in/r/BLOGGER10
```

**Step 4**: Server redirects
```
Redirects to: https://www.veyra.co.in/product/550e8400-...?ref=user_blogger_id
```

**Step 5**: Page loads + sets cookie
```
Cookie: veyra_ref=user_blogger_id (30 days)
```

**Step 6**: App deep link
```
Opens: veyraapp://product/550e8400-...?ref=user_blogger_id
```

**Step 7**: User makes purchase
```
App checks: AsyncStorage.getItem("referral_user")
Credits: user_blogger_id gets commission ✅
```

**Analytics**:
```sql
SELECT
  short_code,
  click_count,
  (SELECT COUNT(*) FROM purchases WHERE referrer_id = creator_id) as conversions
FROM short_codes
WHERE short_code = 'BLOGGER10';

-- Result:
-- short_code: BLOGGER10
-- click_count: 1,247
-- conversions: 89
-- Conversion rate: 7.1%
```

---

## 🔍 Debugging Tips

### Check Redirect in Browser DevTools

1. Open DevTools → Network tab
2. Click shared link
3. Look for redirect chain:
   ```
   /r/CODE123 → 307 Redirect
   /product/abc-123?ref=xyz → 200 OK
   ```

### Verify Deep Link

1. Open DevTools → Console
2. Check logs:
   ```javascript
   console.log('Attempting to open app:', appUrl);
   // Output: "veyraapp://product/123?ref=abc"
   ```

### Verify Cookie Storage

```javascript
// In browser console
document.cookie.split(';').find(c => c.includes('veyra_ref'))
// Output: " veyra_ref=creator_123"
```

---

## 📝 Summary Table

| Scenario | Source URL | Intermediate Redirect | Deep Link | Final Destination |
|----------|-----------|----------------------|-----------|-------------------|
| Product (no ref) | `veyra.co.in/product/123` | None | `veyraapp://product/123` | App: Product 123 |
| Product (with ref) | `veyra.co.in/product/123?ref=abc` | None | `veyraapp://product/123?ref=abc` | App: Product 123 + Ref tracked |
| Short code | `veyra.co.in/r/CODE` | `→ /product/123?ref=xyz` | `veyraapp://product/123?ref=xyz` | App: Product 123 + Ref tracked |
| Post | `veyra.co.in/post/456?ref=abc` | None | `veyraapp://post/456?ref=abc` | App: Post 456 + Ref tracked |
| Reel | `veyra.co.in/reel/789` | None | `veyraapp://reel/789` | App: Reel 789 |
| User | `veyra.co.in/user/abc` | None | `veyraapp://user/abc` | App: User Profile |
| Wardrobe | `veyra.co.in/wardrobe/maya` | None | `veyraapp://wardrobe/maya` | App: Wardrobe Collection |

---

**All redirects are working and tracking user refs properly! ✅**
