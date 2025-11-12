# Veyra Sharing Feature - Complete Implementation Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Current Implementation Status](#current-implementation-status)
3. [Link Generation Strategy](#link-generation-strategy)
4. [Website Redirect Setup](#website-redirect-setup)
5. [Social Media Link Previews (Open Graph)](#social-media-link-previews-open-graph)
6. [App Deep Linking Configuration](#app-deep-linking-configuration)
7. [Share Service Implementation](#share-service-implementation)
8. [Product Sharing Implementation](#product-sharing-implementation)
9. [Post Sharing Implementation](#post-sharing-implementation)
10. [Reel Sharing Implementation](#reel-sharing-implementation)
11. [Wardrobe Sharing Implementation](#wardrobe-sharing-implementation)
12. [Database & Analytics](#database--analytics)
13. [Testing Guide](#testing-guide)
14. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### High-Level Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER SHARES CONTENT                        │
│  (Product, Post, Reel, or Wardrobe Collection)               │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              SHARE SERVICE GENERATES LINK                     │
│                                                               │
│  Posts:     https://veyra.app/post/{postId}                  │
│  Reels:     https://veyra.app/reel/{reelId}                  │
│  Products:  https://veyra.app/product/{productId}            │
│  Wardrobe:  https://veyra.app/wardrobe/{username}            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│               SHARE VIA NATIVE DIALOG                         │
│  • WhatsApp                                                   │
│  • Telegram                                                   │
│  • Instagram Stories                                          │
│  • Twitter                                                    │
│  • Facebook                                                   │
│  • SMS / Email                                                │
│  • Copy to Clipboard                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│           RECIPIENT RECEIVES & CLICKS LINK                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│           BROWSER OPENS VEYRA.APP WEBSITE                     │
│                                                               │
│  URL: https://veyra.app/product/123                          │
│  Loads: share.html (smart redirect page)                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│        JAVASCRIPT ATTEMPTS TO OPEN APP                        │
│                                                               │
│  Tries: veyraapp://product/123                               │
│  Waits: 2 seconds to detect if app opened                    │
└──────────┬──────────────────────────┬────────────────────────┘
           │                          │
    App Installed?               No App Installed
           │                          │
           ▼                          ▼
┌────────────────────┐      ┌──────────────────────┐
│   APP OPENS        │      │   FALLBACK UI        │
│                    │      │                      │
│ Deep link handler  │      │ Shows:               │
│ catches URL        │      │ • Product preview    │
│                    │      │ • Download buttons   │
│ Routes to screen:  │      │ • View on web option │
│ /product/123       │      └──────────────────────┘
│                    │
│ Fetches & displays │
│ product data       │
└────────────────────┘
```

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        VEYRA ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │   MOBILE APP    │◄────────┤   SUPABASE DB    │          │
│  │                 │         │                  │          │
│  │ • Share Service │         │ • products       │          │
│  │ • Deep Linking  │         │ • posts          │          │
│  │ • Share Modals  │         │ • reels          │          │
│  │ • Navigation    │         │ • profiles       │          │
│  └────────┬────────┘         │ • product_shares │          │
│           │                  │ • post_shares    │          │
│           │                  │ • notifications  │          │
│           │                  └──────────────────┘          │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                       │
│  │    WEBSITE      │                                       │
│  │  (veyra.app)    │                                       │
│  │                 │                                       │
│  │ • Landing page  │                                       │
│  │ • share.html    │                                       │
│  │ • App redirects │                                       │
│  │ • Download links│                                       │
│  └─────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Current Implementation Status

### ✅ **Already Implemented**

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Post Sharing UI | ✅ Complete | `/components/ui/SharePostModal.tsx` | 828 lines, fully functional |
| Generic Post/Reel Sharing | ✅ Complete | `/components/ui/ShareModal.tsx` | 732 lines |
| Wardrobe Sharing UI | ✅ Complete | `/components/ui/WardrobeShareModal.tsx` | 766 lines |
| Share Service (Basic) | ✅ Complete | `/services/shareService.ts` | Post & profile sharing |
| Share Hook | ✅ Complete | `/hooks/useSharePost.ts` | User fetching & notifications |
| Feed Integration | ✅ Complete | `/app/(protected)/(tabs)/index.tsx` | Uses ShareModal |
| Reels Integration | ✅ Complete | `/app/(protected)/(tabs)/reels.tsx` | Uses ShareModal |
| Social Media Links | ✅ Complete | All modals | WhatsApp, Telegram, Twitter, FB, LinkedIn |
| Database Tracking | ✅ Complete | `post_shares` table | Analytics for post shares |
| Notifications | ✅ Complete | `notifications` table | Share notifications |
| App Scheme Config | ✅ Complete | `/app.json` | `veyraapp://` scheme |

### ⚠️ **Partially Implemented**

| Feature | Status | What's Missing |
|---------|--------|----------------|
| Deep Linking | ⚠️ Partial | No URL handler in `app/_layout.tsx` |
| Link Generation | ⚠️ Partial | Missing product URLs, reel detail URLs |
| Reel Detail Screen | ⚠️ Missing | No `/app/(protected)/reel/[id].tsx` |
| Wardrobe Detail Screen | ⚠️ Missing | No `/app/(protected)/wardrobe/[username].tsx` |

### ❌ **Not Implemented**

| Feature | Status | Priority |
|---------|--------|----------|
| Product Sharing | ❌ Missing | 🔴 Critical |
| Product Share Modal | ❌ Missing | 🔴 Critical |
| Website Redirect Page | ❌ Missing | 🔴 Critical |
| Deep Link Handler | ❌ Missing | 🔴 Critical |
| Product Share Tracking | ❌ Missing | 🟡 High |
| Universal Links (iOS) | ❌ Missing | 🟢 Medium |
| App Links (Android) | ❌ Missing | 🟢 Medium |

---

## Link Generation Strategy

### URL Format Standards

All shareable links follow this pattern:

```
https://veyra.app/{contentType}/{identifier}
```

### Supported Content Types

| Content Type | URL Pattern | Example | Identifier Type |
|-------------|-------------|---------|-----------------|
| **Product** | `/product/{id}` | `https://veyra.app/product/550e8400-e29b-41d4-a716-446655440000` | UUID |
| **Post** | `/post/{id}` | `https://veyra.app/post/7c9e6679-7425-40de-944b-e07fc1f90ae7` | UUID |
| **Reel** | `/reel/{id}` | `https://veyra.app/reel/3fa85f64-5717-4562-b3fc-2c963f66afa6` | UUID |
| **User Profile** | `/user/{id}` | `https://veyra.app/user/c56a4180-65aa-42ec-a945-5fd21dec0538` | UUID |
| **Wardrobe** | `/wardrobe/{username}` | `https://veyra.app/wardrobe/fashionista123` | Username (string) |

### Link Generation Service

```typescript
// services/shareService.ts

export interface ShareContent {
  type: 'product' | 'post' | 'reel' | 'profile' | 'wardrobe';
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  username?: string; // For wardrobe
}

class ShareService {
  private readonly WEB_BASE_URL = 'https://veyra.app';
  private readonly APP_SCHEME = 'veyraapp://';

  /**
   * Generate web URL for sharing (HTTPS)
   * This is the PRIMARY method - always use this for sharing
   */
  generateWebUrl(content: ShareContent): string {
    const { type, id, username } = content;

    switch (type) {
      case 'product':
        return `${this.WEB_BASE_URL}/product/${id}`;

      case 'post':
        return `${this.WEB_BASE_URL}/post/${id}`;

      case 'reel':
        return `${this.WEB_BASE_URL}/reel/${id}`;

      case 'profile':
        return `${this.WEB_BASE_URL}/user/${id}`;

      case 'wardrobe':
        return `${this.WEB_BASE_URL}/wardrobe/${username || id}`;

      default:
        return this.WEB_BASE_URL;
    }
  }

  /**
   * Generate app scheme URL (for internal use)
   * Used by website to redirect to app
   */
  generateAppUrl(content: ShareContent): string {
    const { type, id, username } = content;
    const path = type === 'wardrobe' ? `${type}/${username || id}` : `${type}/${id}`;
    return `${this.APP_SCHEME}${path}`;
  }
}
```

### Why HTTPS URLs Over Custom Schemes?

| Aspect | `https://veyra.app/product/123` | `veyraapp://product/123` |
|--------|--------------------------------|--------------------------|
| **Professionalism** | ✅ Looks trustworthy | ❌ Looks suspicious |
| **Social Media** | ✅ Works everywhere (WhatsApp, Instagram, Twitter) | ❌ Blocked by many platforms |
| **No App Fallback** | ✅ Shows website/download page | ❌ Shows error message |
| **SEO** | ✅ Can be indexed by Google | ❌ Cannot be indexed |
| **Link Previews** | ✅ Shows rich preview with image/title | ❌ No preview |
| **Analytics** | ✅ Can track clicks | ❌ Harder to track |
| **Future-Proof** | ✅ Can add web app later | ❌ App-only |

**Conclusion:** Always generate HTTPS URLs for sharing. Use custom scheme only internally.

---

## Website Redirect Setup

### Overview

The website acts as a "smart router" that:
1. Receives HTTPS links (`https://veyra.app/product/123`)
2. Attempts to open the app (`veyraapp://product/123`)
3. Falls back to download page if app not installed

### File Structure

```
website/
├── index.html          # Landing page
├── share.html          # Smart redirect page (NEW)
├── preview.jpg         # Default share image
└── .htaccess          # URL rewriting (Apache)
    OR
└── vercel.json        # URL rewriting (Vercel)
    OR
└── netlify.toml       # URL rewriting (Netlify)
```

### Implementation: share.html

This is the core of the web-to-app redirect system.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Veyra - Opening in app...</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="Fashion, style, and personalized shopping on Veyra" />
  <meta name="robots" content="noindex, nofollow"> <!-- Don't index redirect pages -->

  <!-- Open Graph / Social Media Preview -->
  <meta property="og:site_name" content="Veyra" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://veyra.app" />
  <meta property="og:title" content="Check this out on Veyra!" />
  <meta property="og:description" content="Discover fashion, style, and personalized shopping" />
  <meta property="og:image" content="https://veyra.app/preview.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Check this out on Veyra!" />
  <meta name="twitter:description" content="Discover fashion, style, and personalized shopping" />
  <meta name="twitter:image" content="https://veyra.app/preview.jpg" />

  <!-- iOS Smart App Banner -->
  <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                   'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
                   'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
      overflow: hidden;
    }

    .container {
      max-width: 500px;
      width: 100%;
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      font-size: 56px;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: -1px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 30px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .sub-message {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 30px;
    }

    #buttons {
      display: none;
      flex-direction: column;
      gap: 15px;
      margin-top: 30px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 16px 40px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .button:active {
      transform: translateY(0);
    }

    .button.primary {
      background: white;
      color: #667eea;
    }

    .button.secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .platform-icons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 40px;
      opacity: 0.7;
    }

    .platform-icon {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .footer {
      margin-top: 50px;
      opacity: 0.7;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Veyra</div>

    <div id="loading-state">
      <div class="spinner"></div>
      <div class="message">Opening in app...</div>
      <div class="sub-message">Please wait a moment</div>
    </div>

    <div id="buttons">
      <a href="#" id="appButton" class="button primary">
        📱 Open in Veyra App
      </a>
      <a href="https://play.google.com/store/apps/details?id=com.swapu258.VeyraApp"
         class="button secondary" target="_blank">
        📥 Download for Android
      </a>
      <a href="https://apps.apple.com/app/veyra/idYOUR_APP_ID"
         class="button secondary" target="_blank">
        🍎 Download for iOS
      </a>
    </div>

    <div class="footer">
      © 2024 Veyra - Fashion & Style
    </div>
  </div>

  <script>
    (function() {
      // Configuration
      const APP_SCHEME = 'veyraapp://';
      const DETECTION_TIMEOUT = 2500; // 2.5 seconds

      // Parse current URL to extract path
      // Example: https://veyra.app/product/123 → product/123
      const currentPath = window.location.pathname.substring(1); // Remove leading /

      // Build app deep link URL
      const appUrl = APP_SCHEME + currentPath;

      console.log('Share page loaded');
      console.log('Current path:', currentPath);
      console.log('App URL:', appUrl);

      // State tracking
      let appOpened = false;
      let detectionTimer = null;

      // Update "Open in App" button
      const appButton = document.getElementById('appButton');
      if (appButton) {
        appButton.href = appUrl;
      }

      /**
       * Attempt to open the app
       */
      function openApp() {
        console.log('Attempting to open app...');

        // Method 1: Direct URL change (works on most platforms)
        window.location.href = appUrl;

        // Method 2: Create invisible iframe (iOS fallback)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        // Clean up iframe after attempt
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }

      /**
       * Show fallback UI (app not installed)
       */
      function showFallback() {
        console.log('App not detected, showing fallback');
        appOpened = false;

        const loadingState = document.getElementById('loading-state');
        const buttons = document.getElementById('buttons');

        if (loadingState) loadingState.style.display = 'none';
        if (buttons) buttons.style.display = 'flex';
      }

      /**
       * Detect if app opened successfully
       */
      function setupDetection() {
        // Method 1: Page visibility API
        // When app opens, page becomes hidden
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            console.log('Page hidden - app likely opened');
            appOpened = true;
            clearTimeout(detectionTimer);
          }
        });

        // Method 2: Page blur event
        // When app opens, page loses focus
        window.addEventListener('blur', function() {
          console.log('Page blurred - app likely opened');
          appOpened = true;
          clearTimeout(detectionTimer);
        });

        // Method 3: Timeout fallback
        // If app doesn't open within timeout, show fallback
        detectionTimer = setTimeout(function() {
          if (!appOpened) {
            console.log('Timeout reached, app did not open');
            showFallback();
          }
        }, DETECTION_TIMEOUT);
      }

      /**
       * Main execution
       */
      function init() {
        // Only attempt redirect if we have a valid path
        if (currentPath && currentPath !== '') {
          setupDetection();

          // Small delay before opening app (improves reliability)
          setTimeout(openApp, 100);
        } else {
          // No path specified, redirect to main website
          console.log('No path specified, redirecting to home');
          window.location.href = '/';
        }
      }

      // Start the process when page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

      // Manual button click handler
      if (appButton) {
        appButton.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Manual open app button clicked');
          openApp();
        });
      }
    })();
  </script>
</body>
</html>
```

### URL Rewriting Configuration

#### Option 1: Vercel (Recommended)

```json
{
  "rewrites": [
    {
      "source": "/product/:id",
      "destination": "/share.html"
    },
    {
      "source": "/post/:id",
      "destination": "/share.html"
    },
    {
      "source": "/reel/:id",
      "destination": "/share.html"
    },
    {
      "source": "/user/:id",
      "destination": "/share.html"
    },
    {
      "source": "/wardrobe/:username",
      "destination": "/share.html"
    }
  ],
  "headers": [
    {
      "source": "/share.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

#### Option 2: Netlify

```toml
# netlify.toml
[[redirects]]
  from = "/product/*"
  to = "/share.html"
  status = 200
  force = false

[[redirects]]
  from = "/post/*"
  to = "/share.html"
  status = 200
  force = false

[[redirects]]
  from = "/reel/*"
  to = "/share.html"
  status = 200
  force = false

[[redirects]]
  from = "/user/*"
  to = "/share.html"
  status = 200
  force = false

[[redirects]]
  from = "/wardrobe/*"
  to = "/share.html"
  status = 200
  force = false

# Cache control
[[headers]]
  for = "/share.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

#### Option 3: Apache (.htaccess)

```apache
# .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect all content URLs to share.html
  RewriteRule ^(product|post|reel|user|wardrobe)/(.*)$ /share.html [L,QSA]

  # Don't cache share.html
  <FilesMatch "share\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
```

#### Option 4: Nginx

```nginx
# nginx.conf
server {
  listen 80;
  server_name veyra.app;
  root /var/www/veyra;

  # Redirect content URLs to share.html
  location ~ ^/(product|post|reel|user|wardrobe)/ {
    try_files $uri /share.html;
  }

  # Cache control for share.html
  location = /share.html {
    add_header Cache-Control "public, max-age=0, must-revalidate";
  }
}
```

---

## Social Media Link Previews (Open Graph)

### Overview

When users share links on social media platforms (WhatsApp, Facebook, Twitter, LinkedIn, etc.), those platforms display **rich previews** with images, titles, and descriptions. This is accomplished using **Open Graph meta tags** and **Twitter Card meta tags**.

### What Are Link Previews?

When you share `https://veyra.app/product/123` on WhatsApp, it shows:

```
┌─────────────────────────────────────┐
│  WhatsApp Link Preview              │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │    [Product Image]          │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Nike Air Max 2024                  │
│  ₹8,999 • Fashion & Style           │
│  veyra.app                          │
└─────────────────────────────────────┘
```

Without proper meta tags, it would just show:
```
┌─────────────────────────────────────┐
│  https://veyra.app/product/123      │
│  (no image, no title)               │
└─────────────────────────────────────┘
```

### How Social Media Platforms Read Meta Tags

When you share a link:

1. **User shares link**: `https://veyra.app/product/123`
2. **Platform's crawler requests the page**: Facebook/WhatsApp/Twitter bots fetch the HTML
3. **Crawler reads meta tags**: Looks for `<meta property="og:image">` etc.
4. **Platform displays preview**: Shows image, title, description extracted from meta tags

**Important:** Social media crawlers **do NOT execute JavaScript**. They only read the raw HTML returned by the server.

### The Challenge

**Problem:** We have a static `share.html` page with the same meta tags for all content:

```html
<!-- Same for ALL products, posts, reels -->
<meta property="og:image" content="https://veyra.app/preview.jpg" />
<meta property="og:title" content="Check this out on Veyra!" />
```

**Result:** Every shared link shows the same generic preview. ❌

**Solution:** We need **dynamic meta tags** that change based on the content being shared. ✅

---

## Solution Options

### Option 1: Static Meta Tags by Content Type ⭐ (Basic)

**Complexity:** Very Easy
**Setup Time:** 10 minutes
**Dynamic Images:** No (but better than nothing)

Show different static images for products vs posts vs reels, but same image for all products.

**When to use:** Quick temporary solution until you implement dynamic previews.

**Implementation:**

You can't do this with JavaScript (crawlers don't run JS), but you can create separate static pages:

```
website/
├── product-share.html  (product preview image)
├── post-share.html     (post preview image)
└── reel-share.html     (reel preview image)
```

Then route accordingly:
```json
// vercel.json
{
  "rewrites": [
    { "source": "/product/:id", "destination": "/product-share.html" },
    { "source": "/post/:id", "destination": "/post-share.html" },
    { "source": "/reel/:id", "destination": "/reel-share.html" }
  ]
}
```

**Pros:**
- Easy to implement
- No backend needed
- Better than one image for everything

**Cons:**
- Still shows same image for all products
- Not truly dynamic
- Maintenance overhead (3 files)

---

### Option 2: Serverless Functions (Dynamic Meta Tags) ⭐⭐⭐ (Recommended)

**Complexity:** Medium
**Setup Time:** 1-2 hours
**Dynamic Images:** Yes - Each product/post shows its own image!

Use serverless functions (Vercel Functions / Netlify Functions) to generate HTML with dynamic meta tags on-the-fly.

**How it works:**

```
User shares: https://veyra.app/product/123
              ↓
WhatsApp crawler requests page
              ↓
Serverless function runs:
  1. Parses URL to get: type='product', id='123'
  2. Fetches product from Supabase
  3. Generates HTML with product's image, title, price
  4. Returns HTML to crawler
              ↓
WhatsApp shows rich preview with actual product image!
```

**Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│  Social Media Crawler (WhatsApp/Facebook/Twitter)       │
└────────────────────┬────────────────────────────────────┘
                     │ GET https://veyra.app/product/123
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel/Netlify Edge Network                            │
│  Routes to: /api/share (serverless function)            │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Serverless Function                                     │
│  • Parses: product/123                                  │
│  • Queries Supabase: SELECT * FROM products WHERE id=.. │
│  • Gets: {title, price, images, description}            │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Generate Dynamic HTML                                   │
│  <meta og:image="product.images[0]" />                  │
│  <meta og:title="Nike Air Max - ₹8,999" />              │
│  <meta og:description="Product description..." />       │
└────────────────────┬────────────────────────────────────┘
                     │ Return HTML
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Crawler receives HTML → Extracts meta tags → Shows!    │
└─────────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ Shows actual product/post images and details
- ✅ Works with existing Supabase setup
- ✅ No need to rebuild entire website
- ✅ Serverless = auto-scaling, no server maintenance
- ✅ Works on ALL social platforms

**Cons:**
- Requires serverless function deployment
- Small delay (100-300ms to fetch from DB)
- Need to configure environment variables

---

### Implementation: Serverless Functions

#### Step 1: Create Serverless Function

**For Vercel:**

```typescript
// api/share.ts

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface MetaData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  price?: number;
}

export default async function handler(req: any, res: any) {
  try {
    // Parse URL path: /product/123 → ['product', '123']
    const path = req.url.replace('/api/share', '').substring(1);
    const [contentType, id] = path.split('/');

    console.log('Share request:', { contentType, id, path: req.url });

    // Default meta data (fallback)
    let metaData: MetaData = {
      title: 'Veyra - Fashion & Style',
      description: 'Discover amazing fashion and personalized shopping on Veyra',
      image: 'https://veyra.app/preview.jpg',
      url: `https://veyra.app/${contentType}/${id}`,
      type: 'website',
    };

    // Fetch content-specific data
    if (contentType === 'product' && id) {
      const { data, error } = await supabase
        .from('products')
        .select('title, description, images, price, category')
        .eq('id', id)
        .single();

      if (!error && data) {
        metaData = {
          title: `${data.title} - ₹${data.price.toLocaleString()}`,
          description: data.description || `Check out this ${data.category || 'product'} on Veyra!`,
          image: data.images?.[0] || metaData.image,
          url: metaData.url,
          type: 'product',
          price: data.price,
        };
      }
    }
    else if (contentType === 'post' && id) {
      const { data, error } = await supabase
        .from('posts')
        .select('caption, images, user:profiles(username, display_name)')
        .eq('id', id)
        .single();

      if (!error && data) {
        metaData = {
          title: `${data.user?.display_name || 'User'}'s Post on Veyra`,
          description: data.caption || 'Check out this post on Veyra!',
          image: data.images?.[0] || metaData.image,
          url: metaData.url,
          type: 'article',
        };
      }
    }
    else if (contentType === 'reel' && id) {
      const { data, error } = await supabase
        .from('reels')
        .select('caption, thumbnail_url, video_url, user:profiles(username, display_name)')
        .eq('id', id)
        .single();

      if (!error && data) {
        metaData = {
          title: `${data.user?.display_name || 'User'}'s Reel on Veyra`,
          description: data.caption || 'Watch this reel on Veyra!',
          image: data.thumbnail_url || metaData.image,
          url: metaData.url,
          type: 'video.other',
        };
      }
    }
    else if (contentType === 'user' && id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, bio, avatar_url')
        .eq('id', id)
        .single();

      if (!error && data) {
        metaData = {
          title: `${data.display_name} (@${data.username}) on Veyra`,
          description: data.bio || 'Check out this profile on Veyra!',
          image: data.avatar_url || metaData.image,
          url: metaData.url,
          type: 'profile',
        };
      }
    }
    else if (contentType === 'wardrobe' && id) {
      // id is username for wardrobe
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, bio, avatar_url')
        .eq('username', id)
        .single();

      if (!error && data) {
        metaData = {
          title: `${data.display_name}'s Wardrobe Collection`,
          description: `Explore ${data.display_name}'s fashion wardrobe on Veyra`,
          image: data.avatar_url || metaData.image,
          url: metaData.url,
          type: 'website',
        };
      }
    }

    // Generate and return HTML
    const html = generateShareHTML(metaData, contentType, id);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600'); // Cache for 5-10 minutes
    res.status(200).send(html);

  } catch (error) {
    console.error('Share page error:', error);

    // Return fallback HTML on error
    const fallbackHTML = generateShareHTML({
      title: 'Veyra - Fashion & Style',
      description: 'Discover amazing fashion on Veyra',
      image: 'https://veyra.app/preview.jpg',
      url: 'https://veyra.app',
    }, '', '');

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fallbackHTML);
  }
}

/**
 * Generate HTML with dynamic Open Graph meta tags
 */
function generateShareHTML(meta: MetaData, contentType: string, id: string): string {
  const appUrl = `veyraapp://${contentType}/${id}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="${meta.type || 'website'}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:secure_url" content="${meta.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
  <meta property="og:site_name" content="Veyra" />
  <meta property="og:locale" content="en_US" />

  ${meta.price ? `<meta property="product:price:amount" content="${meta.price}" />
  <meta property="product:price:currency" content="INR" />` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@veyra" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${meta.image}" />
  <meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />

  <!-- Standard Meta Tags -->
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <meta name="robots" content="noindex, follow" />

  <!-- iOS Smart App Banner -->
  <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                   'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
                   'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
      overflow: hidden;
    }

    .container {
      max-width: 500px;
      width: 100%;
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      font-size: 56px;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: -1px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 30px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .sub-message {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 30px;
    }

    #buttons {
      display: none;
      flex-direction: column;
      gap: 15px;
      margin-top: 30px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 16px 40px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .button:active {
      transform: translateY(0);
    }

    .button.primary {
      background: white;
      color: #667eea;
    }

    .button.secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .footer {
      margin-top: 50px;
      opacity: 0.7;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Veyra</div>

    <div id="loading-state">
      <div class="spinner"></div>
      <div class="message">Opening in app...</div>
      <div class="sub-message">Please wait a moment</div>
    </div>

    <div id="buttons">
      <a href="${appUrl}" id="appButton" class="button primary">
        📱 Open in Veyra App
      </a>
      <a href="https://play.google.com/store/apps/details?id=com.swapu258.VeyraApp"
         class="button secondary" target="_blank">
        📥 Download for Android
      </a>
      <a href="https://apps.apple.com/app/veyra/idYOUR_APP_ID"
         class="button secondary" target="_blank">
        🍎 Download for iOS
      </a>
    </div>

    <div class="footer">
      © 2024 Veyra - Fashion & Style
    </div>
  </div>

  <script>
    (function() {
      const APP_SCHEME = 'veyraapp://';
      const DETECTION_TIMEOUT = 2500;
      const currentPath = '${contentType}/${id}';
      const appUrl = APP_SCHEME + currentPath;

      let appOpened = false;
      let detectionTimer = null;

      const appButton = document.getElementById('appButton');
      if (appButton) {
        appButton.href = appUrl;
      }

      function openApp() {
        console.log('Attempting to open app:', appUrl);
        window.location.href = appUrl;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }

      function showFallback() {
        console.log('App not detected, showing fallback');
        appOpened = false;

        const loadingState = document.getElementById('loading-state');
        const buttons = document.getElementById('buttons');

        if (loadingState) loadingState.style.display = 'none';
        if (buttons) buttons.style.display = 'flex';
      }

      function setupDetection() {
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            console.log('Page hidden - app likely opened');
            appOpened = true;
            clearTimeout(detectionTimer);
          }
        });

        window.addEventListener('blur', function() {
          console.log('Page blurred - app likely opened');
          appOpened = true;
          clearTimeout(detectionTimer);
        });

        detectionTimer = setTimeout(function() {
          if (!appOpened) {
            console.log('Timeout reached, app did not open');
            showFallback();
          }
        }, DETECTION_TIMEOUT);
      }

      function init() {
        if (currentPath && currentPath !== '/') {
          setupDetection();
          setTimeout(openApp, 100);
        } else {
          window.location.href = 'https://veyra.app';
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

      if (appButton) {
        appButton.addEventListener('click', function(e) {
          e.preventDefault();
          openApp();
        });
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

**For Netlify:**

```typescript
// netlify/functions/share.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event, context) => {
  try {
    // Parse path from URL
    const path = event.path.substring(1); // Remove leading /
    const [contentType, id] = path.split('/');

    // ... (same logic as Vercel function above)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
      body: html,
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: generateShareHTML({ /* fallback */ }, '', ''),
    };
  }
};
```

#### Step 2: Configure Routing

**Vercel - vercel.json:**

```json
{
  "rewrites": [
    {
      "source": "/product/:id",
      "destination": "/api/share"
    },
    {
      "source": "/post/:id",
      "destination": "/api/share"
    },
    {
      "source": "/reel/:id",
      "destination": "/api/share"
    },
    {
      "source": "/user/:id",
      "destination": "/api/share"
    },
    {
      "source": "/wardrobe/:username",
      "destination": "/api/share"
    }
  ],
  "headers": [
    {
      "source": "/api/share",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=300, s-maxage=600"
        }
      ]
    }
  ]
}
```

**Netlify - netlify.toml:**

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/product/*"
  to = "/.netlify/functions/share"
  status = 200

[[redirects]]
  from = "/post/*"
  to = "/.netlify/functions/share"
  status = 200

[[redirects]]
  from = "/reel/*"
  to = "/.netlify/functions/share"
  status = 200

[[redirects]]
  from = "/user/*"
  to = "/.netlify/functions/share"
  status = 200

[[redirects]]
  from = "/wardrobe/*"
  to = "/.netlify/functions/share"
  status = 200
```

#### Step 3: Environment Variables

Add these in your Vercel/Netlify dashboard:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

#### Step 4: Install Dependencies

```bash
# In your website directory
npm install @supabase/supabase-js

# For TypeScript (optional)
npm install -D @types/node
```

#### Step 5: Deploy

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

### Option 3: Next.js with SSR/SSG ⭐⭐⭐⭐ (Most Professional)

**Complexity:** High
**Setup Time:** 2-3 days
**Dynamic Images:** Yes + Full web app

Rebuild website as a Next.js application with Server-Side Rendering.

**Pros:**
- Most professional solution
- Can build full web app (browse products on web)
- Perfect SEO
- Fastest performance
- Best developer experience

**Cons:**
- Major website rebuild required
- Learning curve if unfamiliar with Next.js
- More infrastructure to maintain

**When to use:** If you plan to build a full web experience later (web app alongside mobile app).

---

## Testing Social Media Previews

### Testing Tools

#### 1. Facebook/WhatsApp Sharing Debugger

URL: https://developers.facebook.com/tools/debug/

```
1. Enter your share URL: https://veyra.app/product/123
2. Click "Fetch new scrape information"
3. View extracted meta tags
4. See preview as it would appear
```

**Common Issues:**
- Cache: Facebook caches for 7 days. Use "Fetch new scrape" to refresh.
- Image size: Must be at least 200x200px, recommended 1200x630px
- Image format: JPG or PNG (not WebP for older platforms)

#### 2. Twitter Card Validator

URL: https://cards-dev.twitter.com/validator

```
1. Enter URL
2. Preview card
3. Debug meta tags
```

#### 3. LinkedIn Post Inspector

URL: https://www.linkedin.com/post-inspector/

```
1. Enter URL
2. Inspect
3. Clear cache if needed
```

#### 4. Manual Testing

**WhatsApp (Easiest):**
```
1. Send link to yourself or a test group
2. WhatsApp will fetch and show preview
3. Check image, title, description
```

**Test Checklist:**

```markdown
## Social Media Preview Tests

### Meta Tags
- [ ] og:title is correct
- [ ] og:description is correct
- [ ] og:image URL is valid and accessible
- [ ] og:image is at least 1200x630px
- [ ] og:url matches shared link
- [ ] twitter:card meta tags present

### Platform-Specific Tests
- [ ] WhatsApp shows preview correctly
- [ ] Facebook shows preview correctly
- [ ] Twitter shows card correctly
- [ ] LinkedIn shows preview correctly
- [ ] Instagram (copy link works)
- [ ] Telegram shows preview

### Content-Specific Tests
- [ ] Product: Shows product image, title, price
- [ ] Post: Shows post image and caption
- [ ] Reel: Shows thumbnail
- [ ] Profile: Shows avatar and bio
- [ ] Wardrobe: Shows user info

### Performance
- [ ] Page loads in under 1 second
- [ ] Images load quickly
- [ ] No broken images
- [ ] Proper caching headers
```

---

## Open Graph Meta Tags Reference

### Essential Tags

```html
<!-- Basic Meta Tags -->
<meta property="og:title" content="Product Title" />
<meta property="og:description" content="Product description" />
<meta property="og:image" content="https://veyra.app/image.jpg" />
<meta property="og:url" content="https://veyra.app/product/123" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Veyra" />

<!-- Image Specifications -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Image description" />
<meta property="og:image:secure_url" content="https://veyra.app/image.jpg" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@veyra" />
<meta name="twitter:title" content="Product Title" />
<meta name="twitter:description" content="Description" />
<meta name="twitter:image" content="https://veyra.app/image.jpg" />
```

### Content-Type Specific Tags

#### For Products:

```html
<meta property="og:type" content="product" />
<meta property="product:price:amount" content="8999" />
<meta property="product:price:currency" content="INR" />
<meta property="product:availability" content="in stock" />
<meta property="product:category" content="Fashion" />
```

#### For Articles/Posts:

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2024-01-11T10:00:00Z" />
<meta property="article:author" content="https://veyra.app/user/123" />
<meta property="article:section" content="Fashion" />
<meta property="article:tag" content="style" />
```

#### For Videos/Reels:

```html
<meta property="og:type" content="video.other" />
<meta property="og:video" content="https://veyra.app/video.mp4" />
<meta property="og:video:secure_url" content="https://veyra.app/video.mp4" />
<meta property="og:video:type" content="video/mp4" />
<meta property="og:video:width" content="1280" />
<meta property="og:video:height" content="720" />
```

### Image Best Practices

**Recommended Sizes:**

| Platform | Size | Aspect Ratio |
|----------|------|--------------|
| Facebook | 1200 x 630px | 1.91:1 |
| Twitter | 1200 x 628px | 1.91:1 |
| LinkedIn | 1200 x 627px | 1.91:1 |
| WhatsApp | 300 x 300px (min) | Any |
| Instagram | 1080 x 1080px | 1:1 |

**General Rules:**
- Minimum: 200 x 200px
- Recommended: 1200 x 630px (works everywhere)
- Maximum: 8MB file size
- Format: JPG or PNG
- Avoid text overlay (may be cropped on mobile)

---

## Image Optimization for Sharing

### Image Storage Recommendations

**Current Setup (Supabase Storage):**
Your product/post images are likely stored in Supabase Storage. These work fine for Open Graph!

**Example:**
```
https://abcdefgh.supabase.co/storage/v1/object/public/products/nike-air-max.jpg
```

**Optimization Tips:**

1. **Generate OG-specific images:**

```sql
-- Add og_image column to products table
ALTER TABLE products ADD COLUMN og_image TEXT;

-- Store optimized 1200x630 version for sharing
UPDATE products SET og_image = 'https://supabase.../og/product-123.jpg';
```

2. **Resize images on upload:**

```typescript
// When uploading product images, create OG version
import sharp from 'sharp';

async function uploadProductImage(file: File, productId: string) {
  // Original image
  const originalPath = `products/${productId}-original.jpg`;
  await supabase.storage.from('products').upload(originalPath, file);

  // OG optimized version (1200x630)
  const ogBuffer = await sharp(file)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toBuffer();

  const ogPath = `products/og/${productId}.jpg`;
  await supabase.storage.from('products').upload(ogPath, ogBuffer);

  return {
    original: originalPath,
    og: ogPath,
  };
}
```

3. **Use CDN for images:**

Supabase Storage is already on a CDN, so you're good! But ensure images are public:

```typescript
// Make bucket public
await supabase
  .storage
  .from('products')
  .createBucket('products', { public: true });
```

### Wardrobe Grid Preview Images

**Special Requirement:** When sharing a wardrobe collection, the preview should show a **grid layout of 4-5 wardrobe items**, not just the user's avatar.

#### Challenge

Social media platforms expect a **single image URL** in the `og:image` tag. We can't send multiple images. Solution: Generate a **composite/collage image** on-the-fly.

#### Solution Options

**Option 1: Pre-generated Collage (Recommended)**

Generate wardrobe collage images periodically and store them.

```typescript
// services/wardrobePreviewService.ts

import sharp from 'sharp';
import { supabase } from './supabase';

/**
 * Generate adaptive grid collage of wardrobe items
 * Adapts layout based on number of items available (1-6 items)
 */
export async function generateWardrobeCollage(
  userId: string,
  username: string
): Promise<string> {
  try {
    // 1. Fetch top 6 wardrobe items
    const { data: items, error } = await supabase
      .from('wardrobe_items')
      .select('id, image_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !items || items.length === 0) {
      // Return user avatar as fallback when no items
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      return profile?.avatar_url || '/preview.jpg';
    }

    // 2. Download images
    const imageBuffers = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.image_url);
        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer);
      })
    );

    // 3. Create adaptive layout based on item count
    const collageBuffer = await createAdaptiveLayout(imageBuffers, items.length);

    // 4. Upload to Supabase Storage
    const fileName = `wardrobes/previews/${username}-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .upload(fileName, collageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '86400', // 24 hours
      });

    if (uploadError) throw uploadError;

    // 5. Get public URL
    const { data } = supabase.storage.from('public').getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error generating wardrobe collage:', error);
    return '/preview.jpg'; // Fallback
  }
}

/**
 * Create adaptive grid layout based on number of items
 * Standard Open Graph size: 1200x630
 */
async function createAdaptiveLayout(
  imageBuffers: Buffer[],
  count: number
): Promise<Buffer> {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const BACKGROUND = { r: 245, g: 245, b: 245 }; // Light gray background

  switch (count) {
    case 1:
      // Single item - full size centered
      return createSingleItemLayout(imageBuffers[0], WIDTH, HEIGHT);

    case 2:
      // Two items - side by side
      return createTwoItemLayout(imageBuffers.slice(0, 2), WIDTH, HEIGHT);

    case 3:
      // Three items - asymmetric layout (1 large + 2 small)
      return createThreeItemLayout(imageBuffers.slice(0, 3), WIDTH, HEIGHT);

    case 4:
      // Four items - 2x2 grid
      return createFourItemLayout(imageBuffers.slice(0, 4), WIDTH, HEIGHT);

    case 5:
      // Five items - 2x3 grid (top 3, bottom 2)
      return createFiveItemLayout(imageBuffers.slice(0, 5), WIDTH, HEIGHT);

    case 6:
    default:
      // Six items - 2x3 grid
      return createSixItemLayout(imageBuffers.slice(0, 6), WIDTH, HEIGHT);
  }
}

/**
 * Layout 1: Single item (centered)
 * ┌────────────┐
 * │            │
 * │   Image    │
 * │            │
 * └────────────┘
 */
async function createSingleItemLayout(
  imageBuffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  const resized = await sharp(imageBuffer)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  return sharp(resized).jpeg({ quality: 90 }).toBuffer();
}

/**
 * Layout 2: Two items (side by side)
 * ┌──────┬──────┐
 * │      │      │
 * │  1   │  2   │
 * │      │      │
 * └──────┴──────┘
 */
async function createTwoItemLayout(
  imageBuffers: Buffer[],
  width: number,
  height: number
): Promise<Buffer> {
  const cellWidth = width / 2;

  const resizedImages = await Promise.all(
    imageBuffers.map((buffer) =>
      sharp(buffer)
        .resize(cellWidth, height, { fit: 'cover', position: 'center' })
        .toBuffer()
    )
  );

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: resizedImages[0], top: 0, left: 0 },
      { input: resizedImages[1], top: 0, left: cellWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 3: Three items (1 large left, 2 small stacked right)
 * ┌────────┬────┐
 * │        │ 2  │
 * │   1    ├────┤
 * │        │ 3  │
 * └────────┴────┘
 */
async function createThreeItemLayout(
  imageBuffers: Buffer[],
  width: number,
  height: number
): Promise<Buffer> {
  const largeWidth = Math.floor(width * 0.67); // 800px
  const smallWidth = width - largeWidth; // 400px
  const smallHeight = height / 2; // 315px

  // Resize images
  const large = await sharp(imageBuffers[0])
    .resize(largeWidth, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  const small1 = await sharp(imageBuffers[1])
    .resize(smallWidth, smallHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  const small2 = await sharp(imageBuffers[2])
    .resize(smallWidth, smallHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: large, top: 0, left: 0 },
      { input: small1, top: 0, left: largeWidth },
      { input: small2, top: smallHeight, left: largeWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 4: Four items (2x2 grid)
 * ┌──────┬──────┐
 * │  1   │  2   │
 * ├──────┼──────┤
 * │  3   │  4   │
 * └──────┴──────┘
 */
async function createFourItemLayout(
  imageBuffers: Buffer[],
  width: number,
  height: number
): Promise<Buffer> {
  const cellWidth = width / 2; // 600px
  const cellHeight = height / 2; // 315px

  const resizedImages = await Promise.all(
    imageBuffers.map((buffer) =>
      sharp(buffer)
        .resize(cellWidth, cellHeight, { fit: 'cover', position: 'center' })
        .toBuffer()
    )
  );

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: resizedImages[0], top: 0, left: 0 },
      { input: resizedImages[1], top: 0, left: cellWidth },
      { input: resizedImages[2], top: cellHeight, left: 0 },
      { input: resizedImages[3], top: cellHeight, left: cellWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 5: Five items (3 top, 2 bottom)
 * ┌────┬────┬────┐
 * │ 1  │ 2  │ 3  │
 * ├─────┼─────────┤
 * │  4  │    5    │
 * └─────┴─────────┘
 */
async function createFiveItemLayout(
  imageBuffers: Buffer[],
  width: number,
  height: number
): Promise<Buffer> {
  const topCellWidth = width / 3; // 400px
  const topCellHeight = height / 2; // 315px
  const bottomLeftWidth = width / 2; // 600px
  const bottomRightWidth = width / 2; // 600px

  // Resize top row (3 items)
  const top1 = await sharp(imageBuffers[0])
    .resize(topCellWidth, topCellHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  const top2 = await sharp(imageBuffers[1])
    .resize(topCellWidth, topCellHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  const top3 = await sharp(imageBuffers[2])
    .resize(topCellWidth, topCellHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  // Resize bottom row (2 items)
  const bottom1 = await sharp(imageBuffers[3])
    .resize(bottomLeftWidth, topCellHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  const bottom2 = await sharp(imageBuffers[4])
    .resize(bottomRightWidth, topCellHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      // Top row
      { input: top1, top: 0, left: 0 },
      { input: top2, top: 0, left: topCellWidth },
      { input: top3, top: 0, left: topCellWidth * 2 },
      // Bottom row
      { input: bottom1, top: topCellHeight, left: 0 },
      { input: bottom2, top: topCellHeight, left: bottomLeftWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 6: Six items (2x3 grid)
 * ┌────┬────┬────┐
 * │ 1  │ 2  │ 3  │
 * ├────┼────┼────┤
 * │ 4  │ 5  │ 6  │
 * └────┴────┴────┘
 */
async function createSixItemLayout(
  imageBuffers: Buffer[],
  width: number,
  height: number
): Promise<Buffer> {
  const cellWidth = width / 3; // 400px
  const cellHeight = height / 2; // 315px

  const resizedImages = await Promise.all(
    imageBuffers.map((buffer) =>
      sharp(buffer)
        .resize(cellWidth, cellHeight, { fit: 'cover', position: 'center' })
        .toBuffer()
    )
  );

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      // Top row
      { input: resizedImages[0], top: 0, left: 0 },
      { input: resizedImages[1], top: 0, left: cellWidth },
      { input: resizedImages[2], top: 0, left: cellWidth * 2 },
      // Bottom row
      { input: resizedImages[3], top: cellHeight, left: 0 },
      { input: resizedImages[4], top: cellHeight, left: cellWidth },
      { input: resizedImages[5], top: cellHeight, left: cellWidth * 2 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Update user's wardrobe preview image
 * Call this when wardrobe is updated
 */
export async function updateWardrobePreview(
  userId: string,
  username: string
): Promise<void> {
  const previewUrl = await generateWardrobeCollage(userId, username);

  // Store preview URL in database
  await supabase
    .from('profiles')
    .update({ wardrobe_preview_url: previewUrl })
    .eq('id', userId);
}
```

### Adaptive Grid Layouts - Visual Guide

The wardrobe collage generator **automatically adapts** the layout based on how many items the user has:

#### Layout 1: Single Item (1 item)
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│           [Full Image]              │
│                                     │
│                                     │
└─────────────────────────────────────┘
Size: 1200 x 630
Use case: User has only 1 wardrobe item
Fallback: Shows single item at full size
```

#### Layout 2: Two Items (2 items)
```
┌──────────────────┬──────────────────┐
│                  │                  │
│                  │                  │
│    [Image 1]     │    [Image 2]     │
│                  │                  │
│                  │                  │
└──────────────────┴──────────────────┘
Size: 600x630 each
Use case: User has 2 wardrobe items
Layout: Side by side split
```

#### Layout 3: Three Items (3 items)
```
┌─────────────────────┬──────────────┐
│                     │              │
│                     │  [Image 2]   │
│    [Image 1]        │              │
│    (Large)          ├──────────────┤
│                     │              │
│                     │  [Image 3]   │
│                     │              │
└─────────────────────┴──────────────┘
Left: 800x630 (large)
Right: 400x315 each (small, stacked)
Use case: User has 3 wardrobe items
Layout: Asymmetric - showcases one main item
```

#### Layout 4: Four Items (4 items) - Most Common
```
┌──────────────────┬──────────────────┐
│                  │                  │
│   [Image 1]      │   [Image 2]      │
│                  │                  │
├──────────────────┼──────────────────┤
│                  │                  │
│   [Image 3]      │   [Image 4]      │
│                  │                  │
└──────────────────┴──────────────────┘
Size: 600x315 each
Use case: User has 4+ wardrobe items
Layout: Classic 2x2 grid
```

#### Layout 5: Five Items (5 items)
```
┌─────────┬─────────┬─────────┐
│         │         │         │
│ [Img 1] │ [Img 2] │ [Img 3] │
│         │         │         │
├──────────────┬──────────────┤
│              │              │
│  [Image 4]   │  [Image 5]   │
│              │              │
└──────────────┴──────────────┘
Top row: 400x315 each (3 items)
Bottom row: 600x315 each (2 items)
Use case: User has 5 wardrobe items
Layout: 3 top, 2 bottom
```

#### Layout 6: Six Items (6+ items) - Maximum
```
┌─────────┬─────────┬─────────┐
│         │         │         │
│ [Img 1] │ [Img 2] │ [Img 3] │
│         │         │         │
├─────────┼─────────┼─────────┤
│         │         │         │
│ [Img 4] │ [Img 5] │ [Img 6] │
│         │         │         │
└─────────┴─────────┴─────────┘
Size: 400x315 each
Use case: User has 6+ wardrobe items
Layout: Full 2x3 grid
Note: Only shows first 6 items
```

### Layout Selection Logic

```typescript
// Automatic layout selection
const itemCount = wardrobeItems.length;

if (itemCount === 0) {
  return userAvatar; // Fallback to avatar
} else if (itemCount === 1) {
  return createSingleItemLayout(); // Full size
} else if (itemCount === 2) {
  return createTwoItemLayout(); // Side by side
} else if (itemCount === 3) {
  return createThreeItemLayout(); // Asymmetric
} else if (itemCount === 4) {
  return createFourItemLayout(); // 2x2 grid
} else if (itemCount === 5) {
  return createFiveItemLayout(); // 3 top, 2 bottom
} else {
  return createSixItemLayout(); // 2x3 grid (max 6 items)
}
```

### Preview Examples

**User with 1 item:**
```
┌─────────────────────────────────────┐
│  [Single Dress Image - Full Size]   │
│                                     │
│  Sarah's Wardrobe Collection        │
│  1 item • Fashion & Style           │
└─────────────────────────────────────┘
```

**User with 3 items:**
```
┌─────────────────────┬──────────────┐
│                     │ [Shoes]      │
│    [Main Outfit]    ├──────────────┤
│                     │ [Bag]        │
└─────────────────────┴──────────────┘
Sarah's Wardrobe Collection
3 items • Fashion & Style
```

**User with 4+ items:**
```
┌──────────────────┬──────────────────┐
│ [Dress]          │ [Jacket]         │
├──────────────────┼──────────────────┤
│ [Shoes]          │ [Accessories]    │
└──────────────────┴──────────────────┘
Sarah's Wardrobe Collection
4+ items • Fashion & Style
```

### Benefits of Adaptive Layouts

| Item Count | Layout | Benefit |
|------------|--------|---------|
| 1 item | Full size | Makes single item look impressive |
| 2 items | Side by side | Equal emphasis on both |
| 3 items | Asymmetric | Highlights main item + supporting |
| 4 items | 2x2 grid | Balanced, professional look |
| 5 items | 3+2 grid | Shows variety without clutter |
| 6+ items | 2x3 grid | Maximum variety showcase |

**Database Schema Update:**

```sql
-- Add wardrobe_preview_url column to profiles table
ALTER TABLE profiles
ADD COLUMN wardrobe_preview_url TEXT;

-- Create index
CREATE INDEX idx_profiles_wardrobe_preview ON profiles(wardrobe_preview_url);

-- Optional: Track item count for faster queries
ALTER TABLE profiles
ADD COLUMN wardrobe_item_count INTEGER DEFAULT 0;

-- Update count trigger
CREATE OR REPLACE FUNCTION update_wardrobe_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET wardrobe_item_count = (
    SELECT COUNT(*) FROM wardrobe_items WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
  )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wardrobe_count_trigger
AFTER INSERT OR DELETE ON wardrobe_items
FOR EACH ROW
EXECUTE FUNCTION update_wardrobe_count();
```

**Option 2: On-Demand Generation (Serverless Function)**

Generate collage when share link is accessed.

```typescript
// api/wardrobe-preview/route.ts (Next.js API Route)

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    // 1. Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch wardrobe items
    const { data: items } = await supabase
      .from('wardrobe_items')
      .select('image_url')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(4);

    if (!items || items.length === 0) {
      return NextResponse.redirect('/preview.jpg');
    }

    // 3. Generate collage (same logic as above)
    // ... image processing code ...

    // 4. Return image
    return new NextResponse(collageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
```

**Option 3: Third-Party Service (Easiest)**

Use a service like Cloudinary or Imgix to generate collages.

```typescript
// Using Cloudinary
const wardrobePreviewUrl = cloudinary.url('wardrobes', {
  transformation: [
    { width: 600, height: 315, crop: 'fill', gravity: 'auto' },
    { overlay: 'item1', width: 600, height: 315, x: 0, y: 0 },
    { overlay: 'item2', width: 600, height: 315, x: 600, y: 0 },
    { overlay: 'item3', width: 600, height: 315, x: 0, y: 315 },
    { overlay: 'item4', width: 600, height: 315, x: 600, y: 315 },
  ],
});
```

#### Implementation in Website

Update wardrobe share page to use collage image:

```typescript
// app/wardrobe/[username]/page.tsx

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, wardrobe_preview_url')
      .eq('username', username)
      .single();

    if (error || !profile) {
      return { title: 'Wardrobe Not Found - Veyra' };
    }

    // Use wardrobe_preview_url if available, otherwise generate on-demand
    const previewImage =
      profile.wardrobe_preview_url ||
      `/api/wardrobe-preview?username=${username}` ||
      profile.avatar_url ||
      '/preview.jpg';

    return genMeta({
      title: `${profile.display_name}'s Wardrobe Collection`,
      description: `Explore ${profile.display_name}'s fashion wardrobe on Veyra`,
      image: previewImage, // ← Now shows grid of items!
      url: `https://veyra.app/wardrobe/${username}`,
      type: 'website',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}
```

#### When to Regenerate Collage

Trigger collage regeneration when:

```typescript
// After adding/removing wardrobe items
export async function addWardrobeItem(userId: string, item: WardrobeItem) {
  // 1. Add item
  await supabase.from('wardrobe_items').insert(item);

  // 2. Regenerate preview
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();

  if (profile) {
    await updateWardrobePreview(userId, profile.username);
  }
}

// Or use database trigger
CREATE OR REPLACE FUNCTION update_wardrobe_preview_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark profile for preview regeneration
  UPDATE profiles
  SET wardrobe_preview_needs_update = TRUE
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wardrobe_item_changed
AFTER INSERT OR UPDATE OR DELETE ON wardrobe_items
FOR EACH ROW
EXECUTE FUNCTION update_wardrobe_preview_trigger();
```

#### Performance Considerations

**Pre-generated (Recommended):**
- ✅ Fast load times (image already exists)
- ✅ No computation on share
- ❌ Storage cost (minimal)
- ❌ Needs to regenerate when wardrobe changes

**On-Demand:**
- ✅ Always up-to-date
- ✅ No storage needed
- ❌ Slower first load (~500-1000ms)
- ❌ Higher server costs

**Best Practice:** Use pre-generated collages with background regeneration.

```typescript
// Regenerate collages in background job (run nightly)
async function regenerateWardrobePreviews() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('wardrobe_preview_needs_update', true)
    .limit(100);

  for (const profile of profiles) {
    await updateWardrobePreview(profile.id, profile.username);

    // Mark as updated
    await supabase
      .from('profiles')
      .update({ wardrobe_preview_needs_update: false })
      .eq('id', profile.id);
  }
}
```

---

## Debugging Common Issues

### Issue 1: Same Image for All Links

**Symptom:** All shared links show the same generic image.

**Cause:** Meta tags are static, not dynamic.

**Fix:** Implement serverless function (Option 2 above).

### Issue 2: Image Not Loading

**Symptom:** Preview shows broken image icon.

**Cause:**
- Image URL is not publicly accessible
- Image is too large (>8MB)
- Image has CORS issues

**Fix:**
```typescript
// Ensure Supabase bucket is public
await supabase.storage.from('products').createBucket('products', {
  public: true,
  fileSizeLimit: 5242880, // 5MB
});

// Check image URL is accessible
fetch('https://your-image-url.jpg')
  .then(res => console.log('Image accessible:', res.ok))
  .catch(err => console.error('Image not accessible:', err));
```

### Issue 3: Old Preview Cached

**Symptom:** Changed meta tags but preview still shows old version.

**Cause:** Social platforms cache previews for 7+ days.

**Fix:**
```
1. Facebook: Use Sharing Debugger and "Fetch new scrape information"
2. LinkedIn: Use Post Inspector and clear cache
3. Twitter: Cache expires after 7 days
4. WhatsApp: Can't manually clear, wait for cache expiry

Or: Change image URL to bust cache
https://veyra.app/image.jpg?v=2
```

### Issue 4: Meta Tags Not Being Read

**Symptom:** No preview shown at all.

**Cause:**
- JavaScript-generated meta tags (crawlers don't execute JS)
- Server returning error (500, 404)
- Redirect issues

**Fix:**
```bash
# Test what crawler sees
curl -A "facebookexternalhit/1.1" https://veyra.app/product/123

# Should return HTML with meta tags in <head>
```

---

## Implementation Checklist

### Phase 1: Basic Setup
- [ ] Choose approach (Serverless recommended)
- [ ] Set up serverless function (Vercel/Netlify)
- [ ] Configure environment variables
- [ ] Test function locally

### Phase 2: Database Integration
- [ ] Verify image URLs are public
- [ ] Test image loading speed
- [ ] Consider adding `og_image` column for optimized images
- [ ] Ensure all content types have image fields

### Phase 3: Meta Tag Generation
- [ ] Implement dynamic meta tags for products
- [ ] Implement dynamic meta tags for posts
- [ ] Implement dynamic meta tags for reels
- [ ] Implement dynamic meta tags for profiles
- [ ] Implement dynamic meta tags for wardrobes

### Phase 4: Testing
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator
- [ ] Test with LinkedIn Post Inspector
- [ ] Test actual sharing on WhatsApp
- [ ] Test on Instagram (copy link)
- [ ] Verify images load correctly
- [ ] Check preview on all platforms

### Phase 5: Optimization
- [ ] Add image caching headers
- [ ] Optimize image sizes (1200x630)
- [ ] Test loading performance
- [ ] Set up error handling/fallbacks
- [ ] Monitor serverless function logs

---

## Cost Considerations

### Serverless Function Costs

**Vercel:**
- Free tier: 100GB-hours per month
- Each request ~50-100ms execution time
- ~100,000 requests/month on free tier
- More than enough for most apps

**Netlify:**
- Free tier: 125,000 function invocations/month
- More than sufficient for previews

**Supabase:**
- Database queries are counted in your normal quota
- Storage bandwidth counted (images served)
- Usually well within free tier limits

**Estimate:**
- 1000 shares/day = ~30,000 function calls/month
- Well within free tiers ✅

---

## Resources

### Documentation
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing](https://developers.facebook.com/docs/sharing/webmasters)
- [LinkedIn Post Inspector](https://www.linkedin.com/help/linkedin/answer/a521928)

### Tools
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Meta Tags Generator](https://metatags.io/)
- [Image Resizer](https://www.iloveimg.com/resize-image)

### Testing
- [Open Graph Check](https://www.opengraph.xyz/)
- [Social Share Preview](https://socialsharepreview.com/)

---

## App Deep Linking Configuration

### Step 1: Update app.json

Add deep linking configuration for both custom scheme and universal links.

```json
{
  "expo": {
    "name": "Veyra",
    "slug": "VeyraApp",
    "scheme": "veyraapp",
    "version": "1.0.0",

    "ios": {
      "bundleIdentifier": "com.swapu258.VeyraApp",
      "buildNumber": "1.0.0",
      "supportsTablet": true,

      "associatedDomains": [
        "applinks:veyra.app",
        "applinks:www.veyra.app"
      ],

      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["veyraapp"]
          }
        ]
      }
    },

    "android": {
      "package": "com.swapu258.VeyraApp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },

      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "veyra.app",
              "pathPrefix": "/product"
            },
            {
              "scheme": "https",
              "host": "veyra.app",
              "pathPrefix": "/post"
            },
            {
              "scheme": "https",
              "host": "veyra.app",
              "pathPrefix": "/reel"
            },
            {
              "scheme": "https",
              "host": "veyra.app",
              "pathPrefix": "/user"
            },
            {
              "scheme": "https",
              "host": "veyra.app",
              "pathPrefix": "/wardrobe"
            },
            {
              "scheme": "veyraapp"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },

    "plugins": [
      "expo-router"
    ]
  }
}
```

### Step 2: Create Deep Link Handler

Add deep link handling logic to the root layout.

```typescript
// app/_layout.tsx

import { useEffect, useState } from 'react';
import { router, Slot, useSegments, useNavigationContainerRef } from 'expo-router';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const navigationRef = useNavigationContainerRef();

  // Deep Link Handler
  useEffect(() => {
    // Wait for navigation to be ready
    if (!navigationRef?.isReady()) {
      return;
    }

    const setupDeepLinking = async () => {
      try {
        // Handle initial URL (app opened from closed state)
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Initial URL:', initialUrl);
          handleDeepLink(initialUrl);
        }

        // Listen for URL changes (app opened from background)
        const subscription = Linking.addEventListener('url', ({ url }) => {
          console.log('URL event:', url);
          handleDeepLink(url);
        });

        setIsReady(true);

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error('Deep linking setup error:', error);
      }
    };

    setupDeepLinking();
  }, [navigationRef]);

  /**
   * Parse and handle deep link URLs
   */
  const handleDeepLink = (url: string) => {
    try {
      console.log('Processing deep link:', url);

      // Parse the URL
      const parsed = Linking.parse(url);
      console.log('Parsed URL:', parsed);

      let path = '';
      let params: Record<string, string> = {};

      // Extract path based on URL scheme
      if (url.includes('veyraapp://')) {
        // Custom scheme: veyraapp://product/123
        path = url.replace('veyraapp://', '');
      } else if (url.includes('veyra.app/')) {
        // Universal link: https://veyra.app/product/123
        const urlParts = url.split('veyra.app/');
        path = urlParts[1] || '';
      }

      console.log('Extracted path:', path);

      // Remove query parameters and trailing slashes
      path = path.split('?')[0].replace(/\/$/, '');

      // Route to appropriate screen based on path
      if (path.startsWith('product/')) {
        const id = path.split('/')[1];
        if (id) {
          console.log('Navigating to product:', id);
          router.push(`/(protected)/product/${id}`);
        }
      }
      else if (path.startsWith('post/')) {
        const id = path.split('/')[1];
        if (id) {
          console.log('Navigating to post:', id);
          router.push(`/(protected)/post/${id}`);
        }
      }
      else if (path.startsWith('reel/')) {
        const id = path.split('/')[1];
        if (id) {
          console.log('Navigating to reel:', id);
          router.push(`/(protected)/reel/${id}`);
        }
      }
      else if (path.startsWith('user/')) {
        const id = path.split('/')[1];
        if (id) {
          console.log('Navigating to user profile:', id);
          router.push(`/(protected)/user/${id}`);
        }
      }
      else if (path.startsWith('wardrobe/')) {
        const username = path.split('/')[1];
        if (username) {
          console.log('Navigating to wardrobe:', username);
          router.push(`/(protected)/wardrobe/${username}`);
        }
      }
      else {
        console.log('Unknown path, navigating to home');
        router.push('/(protected)/(tabs)/');
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  return <Slot />;
}
```

### Step 3: Handle Authentication State

If user is not logged in, redirect to auth before showing content.

```typescript
// app/_layout.tsx (enhanced with auth check)

import { useAuth } from '@/hooks/useAuth'; // Your auth hook

export default function RootLayout() {
  const { user, loading } = useAuth();
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);

  const handleDeepLink = (url: string) => {
    // If user not logged in, save the deep link for after login
    if (!user && !loading) {
      console.log('User not logged in, saving deep link for after auth');
      setPendingDeepLink(url);
      router.push('/(auth)/login');
      return;
    }

    // Process deep link (same as before)
    // ... existing handleDeepLink code
  };

  // After successful login, process pending deep link
  useEffect(() => {
    if (user && pendingDeepLink) {
      console.log('User logged in, processing pending deep link');
      handleDeepLink(pendingDeepLink);
      setPendingDeepLink(null);
    }
  }, [user, pendingDeepLink]);

  // ... rest of component
}
```

---

## Share Service Implementation

### Complete Share Service

```typescript
// services/shareService.ts

import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { Share, Platform, Alert } from 'react-native';
import { supabase } from './supabase';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ContentType = 'product' | 'post' | 'reel' | 'profile' | 'wardrobe';

export interface ShareContent {
  type: ContentType;
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  username?: string; // For wardrobe/profile
  price?: number; // For products
}

export interface ShareResult {
  success: boolean;
  action?: 'shared' | 'dismissed';
  error?: string;
}

export type SocialPlatform =
  | 'whatsapp'
  | 'telegram'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'instagram';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  WEB_BASE_URL: 'https://veyra.app',
  APP_SCHEME: 'veyraapp://',
  APP_NAME: 'Veyra',

  // Store URLs (replace with your actual URLs)
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.swapu258.VeyraApp',
  APP_STORE_URL: 'https://apps.apple.com/app/veyra/idYOUR_APP_ID',
} as const;

// ============================================================================
// SHARE SERVICE CLASS
// ============================================================================

class ShareService {

  // ==========================================================================
  // URL GENERATION
  // ==========================================================================

  /**
   * Generate shareable web URL (PRIMARY method for sharing)
   * Always use this method when generating links to share
   *
   * @example
   * generateWebUrl({ type: 'product', id: '123' })
   * // Returns: 'https://veyra.app/product/123'
   */
  generateWebUrl(content: ShareContent): string {
    const { type, id, username } = content;

    switch (type) {
      case 'product':
        return `${CONFIG.WEB_BASE_URL}/product/${id}`;

      case 'post':
        return `${CONFIG.WEB_BASE_URL}/post/${id}`;

      case 'reel':
        return `${CONFIG.WEB_BASE_URL}/reel/${id}`;

      case 'profile':
        return `${CONFIG.WEB_BASE_URL}/user/${id}`;

      case 'wardrobe':
        return `${CONFIG.WEB_BASE_URL}/wardrobe/${username || id}`;

      default:
        return CONFIG.WEB_BASE_URL;
    }
  }

  /**
   * Generate app scheme URL (internal use only)
   * Used by website redirect page to open the app
   */
  generateAppUrl(content: ShareContent): string {
    const { type, id, username } = content;
    const path = type === 'wardrobe'
      ? `${type}/${username || id}`
      : `${type}/${id}`;

    return `${CONFIG.APP_SCHEME}${path}`;
  }

  /**
   * Generate formatted share message
   */
  generateShareMessage(content: ShareContent): string {
    const url = this.generateWebUrl(content);
    const { title, description, price, type } = content;

    let message = '';

    // Customize message based on content type
    switch (type) {
      case 'product':
        message = title
          ? `Check out "${title}" on ${CONFIG.APP_NAME}!${price ? `\n₹${price}` : ''}`
          : `Check out this product on ${CONFIG.APP_NAME}!`;
        break;

      case 'post':
        message = description || `Check out this post on ${CONFIG.APP_NAME}!`;
        break;

      case 'reel':
        message = `Watch this on ${CONFIG.APP_NAME}!`;
        break;

      case 'profile':
        message = `Check out this profile on ${CONFIG.APP_NAME}!`;
        break;

      case 'wardrobe':
        message = `See this wardrobe collection on ${CONFIG.APP_NAME}!`;
        break;
    }

    return `${message}\n\n${url}`;
  }

  // ==========================================================================
  // NATIVE SHARING
  // ==========================================================================

  /**
   * Open native share dialog
   * Works on both iOS and Android
   */
  async shareNative(content: ShareContent): Promise<ShareResult> {
    try {
      const message = this.generateShareMessage(content);
      const url = this.generateWebUrl(content);

      const result = await Share.share({
        message: Platform.OS === 'ios' ? message : message,
        url: Platform.OS === 'ios' ? url : undefined, // iOS shows URL separately
        title: content.title || `Share from ${CONFIG.APP_NAME}`,
      });

      if (result.action === Share.sharedAction) {
        return {
          success: true,
          action: 'shared',
        };
      } else if (result.action === Share.dismissedAction) {
        return {
          success: false,
          action: 'dismissed',
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Native share error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==========================================================================
  // CLIPBOARD
  // ==========================================================================

  /**
   * Copy link to clipboard
   */
  async copyToClipboard(content: ShareContent): Promise<boolean> {
    try {
      const url = this.generateWebUrl(content);
      await Clipboard.setStringAsync(url);
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      return false;
    }
  }

  /**
   * Get clipboard content
   */
  async getFromClipboard(): Promise<string | null> {
    try {
      return await Clipboard.getStringAsync();
    } catch (error) {
      console.error('Clipboard read error:', error);
      return null;
    }
  }

  // ==========================================================================
  // SOCIAL MEDIA SHARING
  // ==========================================================================

  /**
   * Generate platform-specific share URL
   */
  getSocialShareUrl(platform: SocialPlatform, content: ShareContent): string {
    const url = this.generateWebUrl(content);
    const text = encodeURIComponent(content.title || `Check this out on ${CONFIG.APP_NAME}!`);
    const encodedUrl = encodeURIComponent(url);

    const platformUrls: Record<SocialPlatform, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      instagram: url, // Instagram doesn't support URL sharing, return the URL for copying
    };

    return platformUrls[platform];
  }

  /**
   * Share to specific social platform
   */
  async shareToSocial(
    platform: SocialPlatform,
    content: ShareContent
  ): Promise<boolean> {
    try {
      const shareUrl = this.getSocialShareUrl(platform, content);

      // Special handling for Instagram (copy + open app)
      if (platform === 'instagram') {
        await this.copyToClipboard(content);

        const instagramUrl = 'instagram://story-camera';
        const canOpen = await Linking.canOpenURL(instagramUrl);

        if (canOpen) {
          await Linking.openURL(instagramUrl);
        } else {
          Alert.alert(
            'Link Copied',
            'Link copied to clipboard! Open Instagram and paste to share.',
            [{ text: 'OK' }]
          );
        }
        return true;
      }

      // Open platform share URL
      const canOpen = await Linking.canOpenURL(shareUrl);
      if (canOpen) {
        await Linking.openURL(shareUrl);
        return true;
      } else {
        throw new Error(`Cannot open ${platform}`);
      }
    } catch (error) {
      console.error(`Social share error (${platform}):`, error);
      return false;
    }
  }

  // ==========================================================================
  // ANALYTICS & TRACKING
  // ==========================================================================

  /**
   * Track share event in database
   */
  async trackShare(
    content: ShareContent,
    userId: string,
    shareType: 'external' | 'internal' = 'external',
    sharedWith?: string
  ): Promise<void> {
    try {
      const tableName = `${content.type}_shares`;
      const idColumn = `${content.type}_id`;

      await supabase.from(tableName).insert({
        [idColumn]: content.id,
        shared_by: userId,
        shared_with: sharedWith || null,
        share_type: shareType,
        shared_at: new Date().toISOString(),
      });

      // Increment share count
      await this.incrementShareCount(content.type, content.id);
    } catch (error) {
      console.error('Track share error:', error);
      // Don't throw - tracking failure shouldn't break sharing
    }
  }

  /**
   * Increment share count for content
   */
  private async incrementShareCount(
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    try {
      const tableName = contentType === 'wardrobe'
        ? 'profiles'
        : `${contentType}s`;

      await supabase.rpc(`increment_${contentType}_shares`, {
        [`${contentType}_id`]: contentId,
      });
    } catch (error) {
      console.error('Increment share count error:', error);
    }
  }

  // ==========================================================================
  // CONVENIENCE METHODS (Type-specific sharing)
  // ==========================================================================

  /**
   * Share a product
   */
  async shareProduct(
    productId: string,
    productTitle: string,
    price?: number,
    imageUrl?: string,
    userId?: string
  ): Promise<ShareResult> {
    const content: ShareContent = {
      type: 'product',
      id: productId,
      title: productTitle,
      price,
      imageUrl,
    };

    const result = await this.shareNative(content);

    // Track if successful and user ID provided
    if (result.success && userId) {
      await this.trackShare(content, userId);
    }

    return result;
  }

  /**
   * Share a post
   */
  async sharePost(
    postId: string,
    description?: string,
    imageUrl?: string,
    userId?: string
  ): Promise<ShareResult> {
    const content: ShareContent = {
      type: 'post',
      id: postId,
      description,
      imageUrl,
    };

    const result = await this.shareNative(content);

    if (result.success && userId) {
      await this.trackShare(content, userId);
    }

    return result;
  }

  /**
   * Share a reel
   */
  async shareReel(
    reelId: string,
    userId?: string
  ): Promise<ShareResult> {
    const content: ShareContent = {
      type: 'reel',
      id: reelId,
      title: 'Check out this reel!',
    };

    const result = await this.shareNative(content);

    if (result.success && userId) {
      await this.trackShare(content, userId);
    }

    return result;
  }

  /**
   * Share a profile
   */
  async shareProfile(
    userId: string,
    username?: string,
    currentUserId?: string
  ): Promise<ShareResult> {
    const content: ShareContent = {
      type: 'profile',
      id: userId,
      username,
      title: username ? `Check out @${username}!` : 'Check out this profile!',
    };

    const result = await this.shareNative(content);

    if (result.success && currentUserId) {
      await this.trackShare(content, currentUserId);
    }

    return result;
  }

  /**
   * Share a wardrobe collection
   */
  async shareWardrobe(
    username: string,
    userId?: string
  ): Promise<ShareResult> {
    const content: ShareContent = {
      type: 'wardrobe',
      id: username,
      username,
      title: `Check out ${username}'s wardrobe!`,
    };

    const result = await this.shareNative(content);

    if (result.success && userId) {
      await this.trackShare(content, userId);
    }

    return result;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export default new ShareService();
```

### Usage Examples

```typescript
// In any component

import shareService from '@/services/shareService';

// Example 1: Share a product
const handleShareProduct = async () => {
  const result = await shareService.shareProduct(
    product.id,
    product.title,
    product.price,
    product.images[0],
    currentUser?.id
  );

  if (result.success) {
    Alert.alert('Success', 'Product shared!');
  }
};

// Example 2: Copy product link
const handleCopyLink = async () => {
  const copied = await shareService.copyToClipboard({
    type: 'product',
    id: product.id,
    title: product.title,
  });

  if (copied) {
    Alert.alert('Copied', 'Link copied to clipboard');
  }
};

// Example 3: Share to WhatsApp
const handleShareWhatsApp = async () => {
  await shareService.shareToSocial('whatsapp', {
    type: 'product',
    id: product.id,
    title: product.title,
  });
};

// Example 4: Generate URL for custom use
const productUrl = shareService.generateWebUrl({
  type: 'product',
  id: product.id,
});
console.log(productUrl); // https://veyra.app/product/123
```

---

## Product Sharing Implementation

### Step 1: Create Product Share Modal Component

```typescript
// components/ui/ProductShareModal.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import shareService from '@/services/shareService';
import { useAuth } from '@/hooks/useAuth';

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
}

interface ProductShareModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

interface ShareOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void | Promise<void>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ProductShareModal({
  visible,
  onClose,
  product,
}: ProductShareModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Animation
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(500, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleCopyLink = async () => {
    const success = await shareService.copyToClipboard({
      type: 'product',
      id: product.id,
      title: product.title,
      price: product.price,
    });

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    setSharing(true);
    const result = await shareService.shareProduct(
      product.id,
      product.title,
      product.price,
      product.images[0],
      user?.id
    );
    setSharing(false);

    if (result.success) {
      onClose();
    }
  };

  const handleSocialShare = async (platform: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'linkedin') => {
    const success = await shareService.shareToSocial(platform, {
      type: 'product',
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0],
    });

    if (success && user) {
      await shareService.trackShare(
        { type: 'product', id: product.id, title: product.title },
        user.id
      );
    }
  };

  // =========================================================================
  // SHARE OPTIONS
  // =========================================================================

  const shareOptions: ShareOption[] = [
    {
      id: 'copy',
      label: copied ? 'Copied!' : 'Copy Link',
      icon: 'link',
      color: '#666',
      action: handleCopyLink,
    },
    {
      id: 'share',
      label: 'More Options',
      icon: 'share-outline',
      color: '#666',
      action: handleNativeShare,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: () => handleSocialShare('whatsapp'),
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: 'paper-plane',
      color: '#0088cc',
      action: () => handleSocialShare('telegram'),
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      action: () => handleSocialShare('twitter'),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'logo-facebook',
      color: '#4267B2',
      action: () => handleSocialShare('facebook'),
    },
  ];

  // =========================================================================
  // RENDER
  // =========================================================================

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View style={[styles.modal, modalStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Share Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Product Preview */}
          <View style={styles.productPreview}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.productPrice}>₹{product.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Share Options */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
          >
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={option.action}
                disabled={sharing}
              >
                <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                  <Ionicons name={option.icon} size={28} color={option.color} />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Loading Indicator */}
          {sharing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#667eea" />
              <Text style={styles.loadingText}>Opening...</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  handle: {
    position: 'absolute',
    top: 8,
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  productPreview: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionsContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  option: {
    alignItems: 'center',
    width: 80,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Step 2: Add Share Button to Product Screen

```typescript
// app/(protected)/product/[id].tsx

import { useState } from 'react';
import ProductShareModal from '@/components/ui/ProductShareModal';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // ... existing code to fetch product

  const handleShare = () => {
    setShareModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Product details */}

      {/* Share Button in Header or Floating */}
      <TouchableOpacity
        onPress={handleShare}
        style={styles.shareButton}
      >
        <Ionicons name="share-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Share Modal */}
      {product && (
        <ProductShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          product={product}
        />
      )}
    </View>
  );
}
```

---

## Post Sharing Implementation

### Current Status

Post sharing is already well-implemented with `SharePostModal.tsx`. Here's how to use it:

```typescript
// app/(protected)/(tabs)/index.tsx (Feed Screen)

import SharePostModal from '@/components/ui/SharePostModal';

export default function FeedScreen() {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleShare = (post) => {
    setSelectedPost(post);
    setShareModalVisible(true);
  };

  return (
    <View>
      {/* Feed */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onShare={() => handleShare(post)}
        />
      ))}

      {/* Share Modal */}
      <SharePostModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        postId={selectedPost?.id}
        postType="post"
      />
    </View>
  );
}
```

### Features Already Included

- ✅ Copy link to clipboard
- ✅ Native share dialog
- ✅ Social media sharing (WhatsApp, Telegram, Twitter, Facebook, LinkedIn)
- ✅ Send to friends within app
- ✅ Database tracking (post_shares table)
- ✅ Share count updates
- ✅ Notifications to shared users

---

## Reel Sharing Implementation

### Step 1: Create Reel Detail Screen

```typescript
// app/(protected)/reel/[id].tsx

import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { supabase } from '@/services/supabase';
import ShareModal from '@/components/ui/ShareModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchReel();
  }, [id]);

  const fetchReel = async () => {
    try {
      const { data, error } = await supabase
        .from('reels')
        .select('*, user:profiles(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setReel(data);
    } catch (error) {
      console.error('Error fetching reel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!reel) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Reel not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reel',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: reel.video_url }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          useNativeControls={false}
        />

        {/* Reel Info & Actions */}
        <View style={styles.overlay}>
          {/* User info, like, comment buttons */}

          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => setShareModalVisible(true)}
          >
            <Ionicons name="share-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          postId={reel.id}
          postType="reel"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: SCREEN_HEIGHT,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    gap: 24,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Step 2: Update Reels Screen

Ensure the reels screen uses the enhanced share service:

```typescript
// app/(protected)/(tabs)/reels.tsx

import ShareModal from '@/components/ui/ShareModal';
import shareService from '@/services/shareService';

// In component
const handleShare = async (reel) => {
  setSelectedReel(reel);
  setShareModalVisible(true);

  // Track share opened
  await shareService.trackShare(
    { type: 'reel', id: reel.id },
    user?.id,
    'external'
  );
};
```

---

## Wardrobe Sharing Implementation

### Step 1: Create Wardrobe Detail Screen

```typescript
// app/(protected)/wardrobe/[username].tsx

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '@/services/supabase';
import WardrobeShareModal from '@/components/ui/WardrobeShareModal';

export default function WardrobeDetailScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [profile, setProfile] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    fetchWardrobe();
  }, [username]);

  const fetchWardrobe = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch wardrobe items
      const { data: items, error: itemsError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      setWardrobeItems(items);
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!profile) {
    return <Text>Wardrobe not found</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${profile.display_name}'s Wardrobe`,
          headerRight: () => (
            <TouchableOpacity onPress={() => setShareModalVisible(true)}>
              <Ionicons name="share-outline" size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          <Text style={styles.name}>{profile.display_name}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
        </View>

        {/* Wardrobe Grid */}
        <FlatList
          data={wardrobeItems}
          numColumns={2}
          renderItem={({ item }) => (
            <WardrobeItemCard item={item} />
          )}
          keyExtractor={(item) => item.id}
        />

        <WardrobeShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          username={username}
          items={wardrobeItems.slice(0, 4)}
        />
      </View>
    </>
  );
}
```

---

## Database & Analytics

### Required Tables

#### 1. product_shares (NEW)

```sql
-- supabase/migrations/20250111_product_shares.sql

CREATE TABLE IF NOT EXISTS product_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES profiles(id) ON DELETE SET NULL,
  share_type TEXT DEFAULT 'external' CHECK (share_type IN ('external', 'internal')),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_product_share UNIQUE (product_id, shared_by, shared_at)
);

-- Indexes
CREATE INDEX idx_product_shares_product ON product_shares(product_id);
CREATE INDEX idx_product_shares_user ON product_shares(shared_by);
CREATE INDEX idx_product_shares_timestamp ON product_shares(shared_at);

-- RPC function to increment share count
CREATE OR REPLACE FUNCTION increment_product_shares(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET share_count = COALESCE(share_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
```

#### 2. post_shares (Already Exists)

Verify this table exists:

```sql
SELECT * FROM information_schema.tables
WHERE table_name = 'post_shares';
```

#### 3. Add share_count columns

```sql
-- Add share_count to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Add share_count to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Add share_count to reels table (if separate from posts)
ALTER TABLE reels
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
```

### Analytics Queries

```sql
-- Most shared products (last 30 days)
SELECT
  p.id,
  p.title,
  COUNT(ps.id) as shares,
  COUNT(DISTINCT ps.shared_by) as unique_sharers
FROM products p
LEFT JOIN product_shares ps ON p.id = ps.product_id
WHERE ps.shared_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY shares DESC
LIMIT 10;

-- User share activity
SELECT
  pr.username,
  pr.display_name,
  COUNT(ps.id) as total_shares
FROM profiles pr
LEFT JOIN product_shares ps ON pr.id = ps.shared_by
GROUP BY pr.id
ORDER BY total_shares DESC;

-- Share conversion tracking
SELECT
  ps.product_id,
  p.title,
  COUNT(ps.id) as shares,
  COUNT(o.id) as resulting_orders
FROM product_shares ps
JOIN products p ON ps.product_id = p.id
LEFT JOIN orders o ON o.product_id = ps.product_id
  AND o.user_id = ps.shared_with
  AND o.created_at > ps.shared_at
GROUP BY ps.product_id, p.title;
```

### Creator Tracking & Referral System

#### Overview

Track which user (creator) shared the content to enable:
- **Referral bonuses** - Reward creators when someone buys via their link
- **Attribution tracking** - Know which creator drove the conversion
- **Analytics** - Identify top performing sharers
- **Commission system** - Pay creators for sales they generate

#### How It Works

```
1. User A shares Product 123
   → Link generated: https://veyra.app/product/123?ref=userA_id

2. User B clicks link and buys product
   → System records: Product 123 sold via User A's referral

3. User A gets referral bonus/commission
   → Tracked in referral_conversions table
```

#### Implementation Strategy

**Option 1: Query Parameters (Simplest)**

Add creator ID to the share URL:

```typescript
// services/shareService.ts

generateWebUrl(content: ShareContent, creatorId?: string): string {
  const baseUrl = `${WEB_BASE_URL}/${content.type}/${content.id}`;

  if (creatorId) {
    return `${baseUrl}?ref=${creatorId}`;
  }

  return baseUrl;
}

// Usage:
const url = shareService.generateWebUrl(
  { type: 'product', id: '123' },
  currentUser.id  // Creator ID
);
// Returns: https://veyra.app/product/123?ref=abc-123
```

**Option 2: Short Codes (More Professional)**

Generate unique short codes for each share:

```typescript
// Generate short referral code
async function generateReferralLink(
  contentType: 'product' | 'post' | 'reel',
  contentId: string,
  creatorId: string
): Promise<string> {
  // Generate short code (e.g., "xyz789")
  const shortCode = generateShortCode(8);

  // Store in database
  await supabase.from('referral_links').insert({
    short_code: shortCode,
    content_type: contentType,
    content_id: contentId,
    creator_id: creatorId,
    created_at: new Date().toISOString(),
  });

  return `https://veyra.app/r/${shortCode}`;
}

// Usage:
const url = await generateReferralLink('product', '123', currentUser.id);
// Returns: https://veyra.app/r/xyz789
```

#### Database Schema

##### 1. Add creator tracking to existing share tables

```sql
-- Add creator_id column to product_shares
ALTER TABLE product_shares
ADD COLUMN creator_id UUID REFERENCES profiles(id);

-- Index for creator lookups
CREATE INDEX idx_product_shares_creator ON product_shares(creator_id);

-- Same for post_shares
ALTER TABLE post_shares
ADD COLUMN creator_id UUID REFERENCES profiles(id);

CREATE INDEX idx_post_shares_creator ON post_shares(creator_id);

-- Comment: creator_id is the user who created the product/post
-- shared_by is the user who shared it (could be same or different)
```

##### 2. Referral Links Table (for short codes)

```sql
-- Create referral_links table
CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_code TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('product', 'post', 'reel', 'profile')),
  content_id UUID NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Track usage
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,

  CONSTRAINT unique_short_code UNIQUE (short_code)
);

CREATE INDEX idx_referral_links_short_code ON referral_links(short_code);
CREATE INDEX idx_referral_links_creator ON referral_links(creator_id);
CREATE INDEX idx_referral_links_content ON referral_links(content_type, content_id);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_referral_clicks(code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE referral_links
  SET click_count = click_count + 1
  WHERE short_code = code;
END;
$$ LANGUAGE plpgsql;
```

##### 3. Referral Conversions Table

Track when a referral results in a purchase/action:

```sql
CREATE TABLE IF NOT EXISTS referral_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_link_id UUID REFERENCES referral_links(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- What was purchased/engaged
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,

  -- Conversion details
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('purchase', 'signup', 'follow', 'engagement')),
  conversion_value DECIMAL(10, 2), -- Purchase amount, if applicable

  -- Commission/bonus
  commission_rate DECIMAL(5, 2), -- e.g., 10.00 for 10%
  commission_amount DECIMAL(10, 2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),

  -- Timestamps
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  commission_paid_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB
);

CREATE INDEX idx_referral_conversions_creator ON referral_conversions(creator_id);
CREATE INDEX idx_referral_conversions_referred_user ON referral_conversions(referred_user_id);
CREATE INDEX idx_referral_conversions_status ON referral_conversions(commission_status);
```

##### 4. Creator Earnings Table

Track total earnings per creator:

```sql
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Totals
  total_shares INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  pending_earnings DECIMAL(10, 2) DEFAULT 0,
  paid_earnings DECIMAL(10, 2) DEFAULT 0,

  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creator_earnings_creator ON creator_earnings(creator_id);

-- Function to update creator earnings
CREATE OR REPLACE FUNCTION update_creator_earnings(
  p_creator_id UUID,
  p_commission_amount DECIMAL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO creator_earnings (creator_id, total_conversions, total_earnings, pending_earnings)
  VALUES (p_creator_id, 1, p_commission_amount, p_commission_amount)
  ON CONFLICT (creator_id) DO UPDATE SET
    total_conversions = creator_earnings.total_conversions + 1,
    total_earnings = creator_earnings.total_earnings + p_commission_amount,
    pending_earnings = creator_earnings.pending_earnings + p_commission_amount,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

#### Enhanced Share Service with Creator Tracking

```typescript
// services/shareService.ts (enhanced)

class ShareService {

  /**
   * Generate share URL with creator tracking
   */
  async generateTrackedShareUrl(
    content: ShareContent,
    creatorId: string,
    useShortCode: boolean = false
  ): Promise<string> {

    if (useShortCode) {
      // Generate short referral link
      const shortCode = await this.generateShortCode();

      await supabase.from('referral_links').insert({
        short_code: shortCode,
        content_type: content.type,
        content_id: content.id,
        creator_id: creatorId,
      });

      return `${WEB_BASE_URL}/r/${shortCode}`;
    } else {
      // Use query parameter
      const baseUrl = this.generateWebUrl(content);
      return `${baseUrl}?ref=${creatorId}`;
    }
  }

  /**
   * Generate short code for referral links
   */
  private async generateShortCode(length: number = 8): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    });

    // Check if code already exists
    const { data } = await supabase
      .from('referral_links')
      .select('short_code')
      .eq('short_code', code)
      .single();

    // If exists, generate new one recursively
    if (data) {
      return this.generateShortCode(length);
    }

    return code;
  }

  /**
   * Track referral click
   */
  async trackReferralClick(shortCode: string): Promise<void> {
    await supabase.rpc('increment_referral_clicks', { code: shortCode });
  }

  /**
   * Record referral conversion (purchase, signup, etc.)
   */
  async recordConversion(
    creatorId: string,
    referredUserId: string,
    contentType: string,
    contentId: string,
    conversionType: 'purchase' | 'signup' | 'follow' | 'engagement',
    conversionValue?: number
  ): Promise<void> {
    try {
      // Calculate commission (example: 10% for purchases)
      const commissionRate = conversionType === 'purchase' ? 10.0 : 0;
      const commissionAmount = conversionValue
        ? (conversionValue * commissionRate) / 100
        : 0;

      // Record conversion
      await supabase.from('referral_conversions').insert({
        creator_id: creatorId,
        referred_user_id: referredUserId,
        content_type: contentType,
        content_id: contentId,
        conversion_type: conversionType,
        conversion_value: conversionValue,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        commission_status: 'pending',
      });

      // Update creator earnings
      if (commissionAmount > 0) {
        await supabase.rpc('update_creator_earnings', {
          p_creator_id: creatorId,
          p_commission_amount: commissionAmount,
        });
      }
    } catch (error) {
      console.error('Error recording conversion:', error);
    }
  }
}
```

#### Tracking Flow in the App

##### 1. When User Shares Content

```typescript
// app/(protected)/product/[id].tsx

const handleShare = async () => {
  // Get creator ID from product owner
  const creatorId = product.user_id; // or product.owner_id

  // Generate tracked URL
  const trackedUrl = await shareService.generateTrackedShareUrl(
    {
      type: 'product',
      id: product.id,
      title: product.title,
    },
    creatorId,
    true // Use short code
  );

  // Share via native dialog
  await Share.share({
    message: `Check out ${product.title}!\n\n${trackedUrl}`,
  });

  // Track share event
  await shareService.trackShare(
    { type: 'product', id: product.id },
    currentUser.id,
    'external'
  );
};
```

##### 2. When User Clicks Shared Link

```typescript
// Serverless function (api/share.ts)
// OR app deep link handler (app/_layout.tsx)

export default async function handler(req: any, res: any) {
  const { ref, r } = req.query; // ref=creatorId or r=shortCode

  let creatorId: string | null = null;
  let contentType: string;
  let contentId: string;

  // Handle short code
  if (r) {
    const { data: refLink } = await supabase
      .from('referral_links')
      .select('*')
      .eq('short_code', r)
      .single();

    if (refLink) {
      creatorId = refLink.creator_id;
      contentType = refLink.content_type;
      contentId = refLink.content_id;

      // Track click
      await supabase.rpc('increment_referral_clicks', { code: r });
    }
  }
  // Handle query parameter
  else if (ref) {
    creatorId = ref;
  }

  // Store referral info in session/localStorage for later conversion tracking
  if (creatorId) {
    // Will be used when user makes purchase
    // Store in secure cookie or session
  }

  // ... rest of share page logic
}
```

##### 3. When User Makes Purchase

```typescript
// When creating an order

async function createOrder(
  userId: string,
  productId: string,
  amount: number
) {
  // Create order
  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      product_id: productId,
      amount: amount,
      // ... other fields
    })
    .select()
    .single();

  // Check if this came from a referral
  // Get from session/cookie or check recent referral clicks
  const referralCreatorId = getReferralCreatorId(); // Your implementation

  if (referralCreatorId) {
    // Get product creator
    const { data: product } = await supabase
      .from('products')
      .select('user_id')
      .eq('id', productId)
      .single();

    // Record conversion
    await shareService.recordConversion(
      referralCreatorId,
      userId,
      'product',
      productId,
      'purchase',
      amount
    );
  }

  return order;
}
```

#### Analytics Queries for Creator Tracking

```sql
-- Top creators by conversions
SELECT
  p.username,
  p.display_name,
  ce.total_shares,
  ce.total_clicks,
  ce.total_conversions,
  ce.total_earnings,
  ce.pending_earnings,
  ROUND((ce.total_conversions::DECIMAL / NULLIF(ce.total_clicks, 0)) * 100, 2) as conversion_rate
FROM creator_earnings ce
JOIN profiles p ON ce.creator_id = p.id
ORDER BY ce.total_earnings DESC
LIMIT 20;

-- Referral link performance
SELECT
  rl.short_code,
  rl.content_type,
  p.username as creator_username,
  rl.click_count,
  rl.conversion_count,
  ROUND((rl.conversion_count::DECIMAL / NULLIF(rl.click_count, 0)) * 100, 2) as conversion_rate,
  rl.created_at
FROM referral_links rl
JOIN profiles p ON rl.creator_id = p.id
ORDER BY rl.conversion_count DESC;

-- Pending commissions
SELECT
  p.username,
  p.display_name,
  COUNT(rc.id) as pending_conversions,
  SUM(rc.commission_amount) as pending_amount
FROM referral_conversions rc
JOIN profiles p ON rc.creator_id = p.id
WHERE rc.commission_status = 'pending'
GROUP BY p.id
ORDER BY pending_amount DESC;

-- Conversion timeline
SELECT
  DATE(rc.converted_at) as date,
  COUNT(*) as conversions,
  SUM(rc.conversion_value) as total_value,
  SUM(rc.commission_amount) as total_commission
FROM referral_conversions rc
WHERE rc.converted_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(rc.converted_at)
ORDER BY date DESC;

-- Creator leaderboard
SELECT
  p.username,
  p.display_name,
  p.avatar_url,
  COUNT(DISTINCT rc.referred_user_id) as unique_referrals,
  SUM(rc.conversion_value) as total_sales_generated,
  ce.total_earnings as commission_earned
FROM profiles p
LEFT JOIN creator_earnings ce ON p.id = ce.creator_id
LEFT JOIN referral_conversions rc ON p.id = rc.creator_id
WHERE rc.converted_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, ce.total_earnings
ORDER BY total_sales_generated DESC
LIMIT 10;
```

#### Commission Configuration

Create a commission settings table:

```sql
CREATE TABLE commission_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,
  conversion_type TEXT NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL, -- Percentage
  min_payout DECIMAL(10, 2) DEFAULT 100.00, -- Minimum to withdraw
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_commission_setting UNIQUE (content_type, conversion_type)
);

-- Default settings
INSERT INTO commission_settings (content_type, conversion_type, commission_rate, min_payout) VALUES
('product', 'purchase', 10.00, 100.00),
('post', 'engagement', 0.50, 50.00),
('reel', 'engagement', 0.50, 50.00);
```

#### Creator Dashboard

UI to show creators their performance:

```typescript
// app/(protected)/creator-dashboard.tsx

export default function CreatorDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCreatorStats();
  }, []);

  const fetchCreatorStats = async () => {
    const { data } = await supabase
      .from('creator_earnings')
      .select('*')
      .eq('creator_id', user.id)
      .single();

    setStats(data);
  };

  return (
    <View>
      <Text>Total Shares: {stats?.total_shares}</Text>
      <Text>Total Clicks: {stats?.total_clicks}</Text>
      <Text>Total Conversions: {stats?.total_conversions}</Text>
      <Text>Pending Earnings: ₹{stats?.pending_earnings}</Text>
      <Text>Total Earnings: ₹{stats?.total_earnings}</Text>
    </View>
  );
}
```

---

## Testing Guide

### 1. Local Testing (Development)

#### Test Deep Links in Expo Go

```bash
# iOS Simulator
npx uri-scheme open "veyraapp://product/123" --ios

# Android Emulator
npx uri-scheme open "veyraapp://product/123" --android
```

#### Test HTTPS Links (requires ngrok or similar)

```bash
# Start ngrok tunnel
ngrok http 3000

# Update shareService.ts temporarily
const WEB_BASE_URL = 'https://your-ngrok-url.ngrok.io';

# Test in browser
open https://your-ngrok-url.ngrok.io/product/123
```

### 2. Production Testing

#### iOS Testing

```bash
# Install development build
eas build --platform ios --profile development

# Test custom scheme
xcrun simctl openurl booted "veyraapp://product/123"

# Test universal link (after domain verification)
xcrun simctl openurl booted "https://veyra.app/product/123"
```

#### Android Testing

```bash
# Install development build
eas build --platform android --profile development

# Test custom scheme
adb shell am start -W -a android.intent.action.VIEW \
  -d "veyraapp://product/123" com.swapu258.VeyraApp

# Test app link
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://veyra.app/product/123" com.swapu258.VeyraApp
```

### 3. Test Checklist

```markdown
## Share Functionality Tests

### Product Sharing
- [ ] Share button visible on product screen
- [ ] Share modal opens correctly
- [ ] Copy link works
- [ ] Copied link has correct format (https://veyra.app/product/{id})
- [ ] Native share dialog opens
- [ ] WhatsApp sharing works
- [ ] Telegram sharing works
- [ ] Share tracked in database (product_shares table)
- [ ] Share count increments

### Post Sharing
- [ ] Share button visible on posts
- [ ] SharePostModal opens correctly
- [ ] Can select friends to share with
- [ ] Notifications sent to shared users
- [ ] Share tracked in post_shares table

### Reel Sharing
- [ ] Share button visible on reels
- [ ] Reel link format correct
- [ ] Reel detail screen accessible via link

### Deep Linking
- [ ] veyraapp://product/123 opens product screen
- [ ] veyraapp://post/456 opens post screen
- [ ] veyraapp://reel/789 opens reel screen
- [ ] https://veyra.app/product/123 redirects to app (if installed)
- [ ] Fallback page shown if app not installed
- [ ] Deep link works when app is closed
- [ ] Deep link works when app is in background

### Website Redirect
- [ ] share.html page loads correctly
- [ ] Redirect attempts to open app
- [ ] Download buttons displayed after timeout
- [ ] Correct app store links

### Database & Analytics
- [ ] Shares recorded in database
- [ ] Share count increments correctly
- [ ] Notifications created for internal shares
- [ ] Analytics queries return correct data
```

### 4. Debugging Tools

```typescript
// Add this to app/_layout.tsx for debugging

useEffect(() => {
  // Enable debug logging
  if (__DEV__) {
    Linking.addEventListener('url', ({ url }) => {
      console.log('===== DEEP LINK DEBUG =====');
      console.log('URL received:', url);
      console.log('Parsed:', Linking.parse(url));
      console.log('==========================');
    });
  }
}, []);
```

---

## Troubleshooting

### Common Issues

#### 1. Deep Links Not Opening App

**Symptoms:**
- Clicking link opens browser, doesn't open app
- "Cannot open page" error

**Solutions:**
```bash
# iOS: Verify associated domains
cat ios/VeyraApp/VeyraApp.entitlements

# Android: Verify intent filters
cat android/app/src/main/AndroidManifest.xml

# Rebuild app
npx expo prebuild --clean
eas build --platform ios --profile development
```

#### 2. Share Modal Not Showing

**Check:**
```typescript
// Ensure modal visible prop is true
console.log('Modal visible:', shareModalVisible);

// Check if product data exists
console.log('Product:', product);

// Verify import
import ProductShareModal from '@/components/ui/ProductShareModal';
```

#### 3. Links Generate Wrong URL

**Fix:**
```typescript
// services/shareService.ts
const CONFIG = {
  WEB_BASE_URL: 'https://veyra.app', // Check this is correct
  APP_SCHEME: 'veyraapp://', // Check this matches app.json
};
```

#### 4. Database Tracking Not Working

**Debug:**
```typescript
// Add logging to trackShare method
async trackShare(content, userId) {
  console.log('Tracking share:', { content, userId });
  try {
    const result = await supabase.from('product_shares').insert({...});
    console.log('Track result:', result);
  } catch (error) {
    console.error('Track error:', error);
  }
}
```

#### 5. Website Redirect Not Working

**Check:**
```javascript
// In share.html, add debug logging
console.log('Current path:', window.location.pathname);
console.log('App URL:', appUrl);
console.log('Detection timeout:', DETECTION_TIMEOUT);

// Test URL rewriting
// Visit: https://veyra.app/product/123
// Should load: share.html (check network tab)
```

---

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create `share.html` redirect page
- [ ] Configure URL rewriting (vercel.json/netlify.toml/.htaccess)
- [ ] Deploy website changes
- [ ] Update `app.json` with deep link config
- [ ] Add deep link handler to `app/_layout.tsx`
- [ ] Enhance `shareService.ts` with new methods

### Phase 2: Product Sharing
- [ ] Create `ProductShareModal.tsx` component
- [ ] Add share button to product detail screen
- [ ] Create `product_shares` database table
- [ ] Add `share_count` column to products table
- [ ] Test product sharing end-to-end

### Phase 3: Missing Screens
- [ ] Create `/app/(protected)/reel/[id].tsx`
- [ ] Create `/app/(protected)/wardrobe/[username].tsx`
- [ ] Test deep linking to these screens

### Phase 4: Analytics & Tracking
- [ ] Set up database tracking for all content types
- [ ] Create analytics dashboard queries
- [ ] Add share event logging

### Phase 5: Testing & Polish
- [ ] Test all share flows (product, post, reel, wardrobe)
- [ ] Test deep linking on iOS
- [ ] Test deep linking on Android
- [ ] Test website redirect
- [ ] Verify analytics tracking
- [ ] User acceptance testing

---

## Resources

### Documentation
- [Expo Linking](https://docs.expo.dev/guides/linking/)
- [Universal Links (iOS)](https://developer.apple.com/ios/universal-links/)
- [App Links (Android)](https://developer.android.com/training/app-links)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking/)

### Tools
- [iOS Universal Links Tester](https://branch.io/resources/aasa-validator/)
- [Android App Links Tester](https://developers.google.com/digital-asset-links/tools/generator)
- [ngrok](https://ngrok.com/) - Test HTTPS locally
- [Expo URI Scheme](https://www.npmjs.com/package/uri-scheme) - Test deep links

---

**Document Version:** 1.0
**Last Updated:** 2024-01-11
**Author:** Veyra Development Team
