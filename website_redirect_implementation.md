# Veyra Website - Smart Redirect Page Implementation Guide

**For: Website Development Team**
**Framework: Next.js**
**Purpose: App deep linking and social media link previews**

---

## Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Architecture](#architecture)
4. [Implementation Steps](#implementation-steps)
5. [Dynamic Routes Setup](#dynamic-routes-setup)
6. [API Routes for Meta Tags](#api-routes-for-meta-tags)
7. [Supabase Integration](#supabase-integration)
8. [Creator Tracking & Referral Links](#creator-tracking--referral-links)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### What We're Building

A smart redirect system that:

1. **Handles deep links from mobile app shares**
   - URLs like `https://veyra.app/product/123`
   - Automatically opens the Veyra mobile app if installed
   - Shows download buttons if app not installed

2. **Generates rich social media previews**
   - When shared on WhatsApp, Facebook, Twitter, etc.
   - Shows product/post images, titles, prices dynamically
   - Uses Open Graph meta tags

3. **Tracks referrals and creator attribution**
   - Short codes: `https://veyra.app/r/xyz789`
   - Query parameters: `https://veyra.app/product/123?ref=user_id`
   - Enables creator commission tracking

### User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks: https://veyra.app/product/123                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Next.js Server-Side Rendering (SSR)                         │
│ 1. Parse URL: product/123                                   │
│ 2. Fetch product data from Supabase                         │
│ 3. Generate HTML with dynamic meta tags                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Client Receives HTML                                         │
│                                                              │
│ Social Media Crawler?                                        │
│ ├─ YES → Reads meta tags → Shows preview                    │
│ └─ NO → JavaScript runs → Tries to open app                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ If App Installed: Opens veyraapp://product/123              │
│ If Not Installed: Shows download buttons                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Requirements

### Technical Stack

- **Framework**: Next.js 13+ (App Router or Pages Router)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended) or any Node.js hosting
- **Node.js**: v18 or higher
- **TypeScript**: Recommended but not required

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### Environment Variables

Create `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_SCHEME=veyraapp://
NEXT_PUBLIC_APP_NAME=Veyra

# Store URLs
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.swapu258.VeyraApp
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/veyra/idYOUR_APP_ID

# Optional: For analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Architecture

### File Structure

```
veyra-website/
├── app/                          # Next.js 13+ App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   │
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx          # Product share page
│   │
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx          # Post share page
│   │
│   ├── reel/
│   │   └── [id]/
│   │       └── page.tsx          # Reel share page
│   │
│   ├── user/
│   │   └── [id]/
│   │       └── page.tsx          # User profile share page
│   │
│   ├── wardrobe/
│   │   └── [username]/
│   │       └── page.tsx          # Wardrobe share page
│   │
│   └── r/
│       └── [code]/
│           └── page.tsx          # Referral short code redirect
│
├── components/
│   └── SharePage.tsx             # Reusable share page component
│
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── metadata.ts               # Meta tag generator
│   └── referrals.ts              # Referral tracking
│
├── public/
│   ├── preview.jpg               # Default share image
│   └── logo.png                  # App logo
│
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── package.json
└── tsconfig.json
```

### Alternative: Pages Router Structure

If using Pages Router instead of App Router:

```
veyra-website/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── product/[id].tsx
│   ├── post/[id].tsx
│   ├── reel/[id].tsx
│   ├── user/[id].tsx
│   ├── wardrobe/[username].tsx
│   └── r/[code].tsx
```

---

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### Step 2: Configure Supabase Client

Create `lib/supabase.ts`:

```typescript
// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions (optional but recommended)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  user_id: string;
}

export interface Post {
  id: string;
  caption: string;
  images: string[];
  user: {
    username: string;
    display_name: string;
  };
}

export interface Reel {
  id: string;
  caption: string;
  thumbnail_url: string;
  video_url: string;
  user: {
    username: string;
    display_name: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

export interface ReferralLink {
  id: string;
  short_code: string;
  content_type: string;
  content_id: string;
  creator_id: string;
  click_count: number;
}
```

### Step 3: Create Metadata Generator

Create `lib/metadata.ts`:

```typescript
// lib/metadata.ts

import { Metadata } from 'next';

interface MetaTagData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'product' | 'video.other' | 'profile';
  price?: number;
  currency?: string;
}

const DEFAULT_IMAGE = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://veyra.app'}/preview.jpg`;

export function generateMetadata(data: MetaTagData): Metadata {
  const {
    title,
    description,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    price,
    currency = 'INR',
  } = data;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Veyra',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@veyra',
    },
    robots: {
      index: false,
      follow: true,
    },
  };

  // Add product-specific tags
  if (type === 'product' && price) {
    metadata.openGraph = {
      ...metadata.openGraph,
      // @ts-ignore - Next.js types don't include product tags
      productPrice: {
        amount: price,
        currency,
      },
    };
  }

  return metadata;
}

export function escapeHtml(text: string): string {
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

### Step 4: Create Reusable Share Page Component

Create `components/SharePage.tsx`:

```typescript
// components/SharePage.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SharePageProps {
  contentType: string;
  contentId: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function SharePage({
  contentType,
  contentId,
  title,
  description,
  imageUrl,
}: SharePageProps) {
  const router = useRouter();
  const [showFallback, setShowFallback] = useState(false);

  const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME || 'veyraapp://';
  const appUrl = `${APP_SCHEME}${contentType}/${contentId}`;

  useEffect(() => {
    let appOpened = false;
    let detectionTimer: NodeJS.Timeout;

    const openApp = () => {
      console.log('Attempting to open app:', appUrl);

      // Method 1: Direct redirect
      window.location.href = appUrl;

      // Method 2: Iframe (iOS fallback)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appUrl;
      document.body.appendChild(iframe);

      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    };

    const setupDetection = () => {
      // Detect if app opened (page becomes hidden)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          appOpened = true;
          clearTimeout(detectionTimer);
        }
      });

      // Detect if app opened (page loses focus)
      window.addEventListener('blur', () => {
        appOpened = true;
        clearTimeout(detectionTimer);
      });

      // Timeout: show fallback if app didn't open
      detectionTimer = setTimeout(() => {
        if (!appOpened) {
          setShowFallback(true);
        }
      }, 2500);
    };

    setupDetection();
    setTimeout(openApp, 100);

    return () => {
      clearTimeout(detectionTimer);
    };
  }, [appUrl]);

  return (
    <div className="share-container">
      <style jsx>{`
        .share-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .content {
          max-width: 500px;
          width: 100%;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 30px auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .message {
          font-size: 20px;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .sub-message {
          font-size: 16px;
          opacity: 0.9;
        }

        .buttons {
          display: flex;
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
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .button.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .footer {
          margin-top: 50px;
          opacity: 0.7;
          font-size: 14px;
        }
      `}</style>

      <div className="content">
        <div className="logo">Veyra</div>

        {!showFallback ? (
          <div>
            <div className="spinner"></div>
            <div className="message">Opening in app...</div>
            <div className="sub-message">Please wait a moment</div>
          </div>
        ) : (
          <div>
            <div className="message">Don't have the Veyra app?</div>
            <div className="buttons">
              <a href={appUrl} className="button">
                📱 Open in Veyra App
              </a>
              <a
                href={process.env.NEXT_PUBLIC_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary"
              >
                📥 Download for Android
              </a>
              <a
                href={process.env.NEXT_PUBLIC_APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary"
              >
                🍎 Download for iOS
              </a>
            </div>
          </div>
        )}

        <div className="footer">© 2024 Veyra - Fashion & Style</div>
      </div>
    </div>
  );
}
```

---

## Dynamic Routes Setup

### Product Share Page

Create `app/product/[id]/page.tsx`:

```typescript
// app/product/[id]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: { id: string };
  searchParams: { ref?: string; r?: string };
}

// Generate metadata for social media previews
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    // Fetch product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('title, description, images, price, category')
      .eq('id', id)
      .single();

    if (error || !product) {
      return {
        title: 'Product Not Found - Veyra',
        description: 'This product could not be found.',
      };
    }

    // Generate metadata with product details
    return genMeta({
      title: `${product.title} - ₹${product.price.toLocaleString()}`,
      description:
        product.description ||
        `Check out this ${product.category || 'product'} on Veyra!`,
      image: product.images?.[0] || '/preview.jpg',
      url: `https://veyra.app/product/${id}`,
      type: 'product',
      price: product.price,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Veyra - Fashion & Style',
      description: 'Discover amazing fashion on Veyra',
    };
  }
}

// Main page component
export default async function ProductSharePage({ params }: PageProps) {
  const { id } = params;

  try {
    // Fetch product for page content
    const { data: product, error } = await supabase
      .from('products')
      .select('title, description, images, price')
      .eq('id', id)
      .single();

    if (error || !product) {
      notFound();
    }

    return (
      <SharePage
        contentType="product"
        contentId={id}
        title={product.title}
        description={product.description}
        imageUrl={product.images?.[0]}
      />
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

// Enable static generation for known products (optional)
export const revalidate = 3600; // Revalidate every hour
```

### Post Share Page

Create `app/post/[id]/page.tsx`:

```typescript
// app/post/[id]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('caption, images, user:profiles(username, display_name)')
      .eq('id', id)
      .single();

    if (error || !post) {
      return {
        title: 'Post Not Found - Veyra',
        description: 'This post could not be found.',
      };
    }

    return genMeta({
      title: `${post.user?.display_name || 'User'}'s Post on Veyra`,
      description: post.caption || 'Check out this post on Veyra!',
      image: post.images?.[0] || '/preview.jpg',
      url: `https://veyra.app/post/${id}`,
      type: 'article',
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Veyra - Fashion & Style',
    };
  }
}

export default async function PostSharePage({ params }: PageProps) {
  const { id } = params;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('caption, images')
      .eq('id', id)
      .single();

    if (error || !post) {
      notFound();
    }

    return (
      <SharePage
        contentType="post"
        contentId={id}
        title="Check out this post on Veyra!"
        description={post.caption}
        imageUrl={post.images?.[0]}
      />
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}

export const revalidate = 600; // Revalidate every 10 minutes
```

### Reel Share Page

Create `app/reel/[id]/page.tsx`:

```typescript
// app/reel/[id]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const { data: reel, error } = await supabase
      .from('reels')
      .select(
        'caption, thumbnail_url, video_url, user:profiles(username, display_name)'
      )
      .eq('id', id)
      .single();

    if (error || !reel) {
      return {
        title: 'Reel Not Found - Veyra',
      };
    }

    return genMeta({
      title: `${reel.user?.display_name || 'User'}'s Reel on Veyra`,
      description: reel.caption || 'Watch this reel on Veyra!',
      image: reel.thumbnail_url || '/preview.jpg',
      url: `https://veyra.app/reel/${id}`,
      type: 'video.other',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function ReelSharePage({ params }: PageProps) {
  const { id } = params;

  try {
    const { data: reel, error } = await supabase
      .from('reels')
      .select('caption, thumbnail_url')
      .eq('id', id)
      .single();

    if (error || !reel) {
      notFound();
    }

    return (
      <SharePage
        contentType="reel"
        contentId={id}
        title="Watch this reel on Veyra!"
        description={reel.caption}
        imageUrl={reel.thumbnail_url}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 600;
```

### User Profile Share Page

Create `app/user/[id]/page.tsx`:

```typescript
// app/user/[id]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, display_name, bio, avatar_url')
      .eq('id', id)
      .single();

    if (error || !profile) {
      return { title: 'User Not Found - Veyra' };
    }

    return genMeta({
      title: `${profile.display_name} (@${profile.username}) on Veyra`,
      description: profile.bio || 'Check out this profile on Veyra!',
      image: profile.avatar_url || '/preview.jpg',
      url: `https://veyra.app/user/${id}`,
      type: 'profile',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function UserSharePage({ params }: PageProps) {
  const { id } = params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, display_name, bio, avatar_url')
      .eq('id', id)
      .single();

    if (error || !profile) {
      notFound();
    }

    return (
      <SharePage
        contentType="user"
        contentId={id}
        title={`${profile.display_name} on Veyra`}
        description={profile.bio}
        imageUrl={profile.avatar_url}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 1800; // 30 minutes
```

### Wardrobe Share Page

Create `app/wardrobe/[username]/page.tsx`:

```typescript
// app/wardrobe/[username]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url')
      .eq('username', username)
      .single();

    if (error || !profile) {
      return { title: 'Wardrobe Not Found - Veyra' };
    }

    // IMPORTANT: Use wardrobe grid preview instead of just avatar
    // This shows a 2x2 grid of wardrobe items (4-5 items)
    const previewImage =
      profile.wardrobe_preview_url || // Pre-generated collage (recommended)
      `/api/wardrobe-preview?username=${username}` || // On-demand generation
      profile.avatar_url || // Fallback to avatar
      '/preview.jpg'; // Final fallback

    return genMeta({
      title: `${profile.display_name}'s Wardrobe Collection`,
      description: `Explore ${profile.display_name}'s fashion wardrobe on Veyra - ${profile.bio || 'Fashion & Style'}`,
      image: previewImage, // Shows grid of 4-5 wardrobe items!
      url: `https://veyra.app/wardrobe/${username}`,
      type: 'website',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function WardrobeSharePage({ params }: PageProps) {
  const { username } = params;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('username', username)
      .single();

    if (error || !profile) {
      notFound();
    }

    return (
      <SharePage
        contentType="wardrobe"
        contentId={username}
        title={`${profile.display_name}'s Wardrobe`}
        description="Explore this wardrobe collection"
        imageUrl={profile.avatar_url}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 1800;
```

---

## Creator Tracking & Referral Links

### Referral Short Code Handler

Create `app/r/[code]/page.tsx`:

```typescript
// app/r/[code]/page.tsx

import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: { code: string };
  searchParams: Record<string, string>;
}

export default async function ReferralRedirect({ params }: PageProps) {
  const { code } = params;

  try {
    // Look up referral link
    const { data: refLink, error } = await supabase
      .from('referral_links')
      .select('*')
      .eq('short_code', code)
      .single();

    if (error || !refLink) {
      notFound();
    }

    // Increment click count
    await supabase.rpc('increment_referral_clicks', { code });

    // Redirect to actual content with creator tracking
    const targetUrl = `/${refLink.content_type}/${refLink.content_id}?ref=${refLink.creator_id}`;
    redirect(targetUrl);
  } catch (error) {
    console.error('Error handling referral:', error);
    notFound();
  }
}
```

### Referral Tracking Utility

Create `lib/referrals.ts`:

```typescript
// lib/referrals.ts

import { supabase } from './supabase';

/**
 * Track referral click
 */
export async function trackReferralClick(
  shortCode: string
): Promise<void> {
  try {
    await supabase.rpc('increment_referral_clicks', { code: shortCode });
  } catch (error) {
    console.error('Error tracking referral click:', error);
  }
}

/**
 * Get referral link details
 */
export async function getReferralLink(shortCode: string) {
  try {
    const { data, error } = await supabase
      .from('referral_links')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching referral link:', error);
    return null;
  }
}

/**
 * Store referral in cookies for later conversion tracking
 */
export function storeReferralInCookie(creatorId: string) {
  if (typeof document !== 'undefined') {
    // Store for 30 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    document.cookie = `veyra_ref=${creatorId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }
}

/**
 * Get referral from cookies
 */
export function getReferralFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/veyra_ref=([^;]+)/);
  return match ? match[1] : null;
}
```

### Enhanced Share Page with Referral Tracking

Update `components/SharePage.tsx` to include referral tracking:

```typescript
// components/SharePage.tsx (add this to the useEffect)

useEffect(() => {
  // Check for referral parameter
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');

  if (ref) {
    // Store referral in cookie for later conversion tracking
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `veyra_ref=${ref}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  // ... rest of existing useEffect code
}, [appUrl]);
```

---

## API Routes for Meta Tags

If you need more control or want to handle meta tags via API routes instead of SSR:

### Create API Route

Create `app/api/meta/route.ts`:

```typescript
// app/api/meta/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json(
      { error: 'Missing type or id' },
      { status: 400 }
    );
  }

  try {
    let metaData: any = {
      title: 'Veyra - Fashion & Style',
      description: 'Discover amazing fashion',
      image: '/preview.jpg',
    };

    // Fetch based on type
    if (type === 'product') {
      const { data } = await supabase
        .from('products')
        .select('title, description, images, price')
        .eq('id', id)
        .single();

      if (data) {
        metaData = {
          title: `${data.title} - ₹${data.price}`,
          description: data.description,
          image: data.images?.[0],
        };
      }
    }
    // ... other types

    return NextResponse.json(metaData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
```

---

## Supabase Integration

### Required Database Functions

Ensure these SQL functions exist in your Supabase database:

```sql
-- Function to increment referral clicks
CREATE OR REPLACE FUNCTION increment_referral_clicks(code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE referral_links
  SET click_count = click_count + 1
  WHERE short_code = code;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS)

Make sure the tables have appropriate RLS policies:

```sql
-- Allow public read access to products
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Allow public read access to posts
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Allow public read access to profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Allow public read access to referral links
CREATE POLICY "Referral links are viewable by everyone"
ON referral_links FOR SELECT
USING (true);

-- Allow public update to referral link click counts
CREATE POLICY "Anyone can increment click counts"
ON referral_links FOR UPDATE
USING (true)
WITH CHECK (true);
```

---

## Testing

### Local Development Testing

```bash
# Start development server
npm run dev

# Test URLs
open http://localhost:3000/product/123
open http://localhost:3000/post/456
open http://localhost:3000/r/abc123
```

### Test Social Media Previews

#### 1. Facebook/WhatsApp Sharing Debugger

URL: https://developers.facebook.com/tools/debug/

```
1. Enter your URL: https://veyra.app/product/123
2. Click "Fetch new information"
3. Check extracted meta tags
4. View preview
```

#### 2. Twitter Card Validator

URL: https://cards-dev.twitter.com/validator

```
1. Enter URL
2. Preview card
3. Check meta tags
```

#### 3. LinkedIn Post Inspector

URL: https://www.linkedin.com/post-inspector/

```
1. Enter URL
2. Inspect
3. Clear cache if needed
```

### Manual Testing Checklist

```markdown
## Share Page Tests

### Functionality
- [ ] App opens on iOS (if installed)
- [ ] App opens on Android (if installed)
- [ ] Download buttons show if app not installed
- [ ] All store links work correctly
- [ ] Referral parameter is preserved (?ref=user_id)
- [ ] Short codes redirect properly (/r/abc123)

### Meta Tags
- [ ] Product: Shows correct image, title, price
- [ ] Post: Shows post image and caption
- [ ] Reel: Shows thumbnail
- [ ] User: Shows avatar and bio
- [ ] Wardrobe: Shows user info

### Social Media
- [ ] WhatsApp preview works
- [ ] Facebook preview works
- [ ] Twitter card works
- [ ] LinkedIn preview works
- [ ] Instagram (copy link) works

### Performance
- [ ] Page loads in < 1 second
- [ ] Images load quickly
- [ ] No console errors
- [ ] Mobile responsive
```

### Load Testing

```bash
# Install apache bench
brew install httpd  # macOS

# Test 100 requests
ab -n 100 -c 10 https://veyra.app/product/123

# Expected: < 500ms average response time
```

---

## Deployment

### Vercel Deployment (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Configure Environment Variables

In Vercel dashboard or via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_SCHEME
vercel env add NEXT_PUBLIC_PLAY_STORE_URL
vercel env add NEXT_PUBLIC_APP_STORE_URL
```

#### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Or connect to GitHub and auto-deploy on push
vercel link
```

### Next.js Configuration

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: [
      'your-supabase-project.supabase.co', // Supabase storage
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.veyra.app' }],
        destination: 'https://veyra.app/:path*',
        permanent: true,
      },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/product/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=600, stale-while-revalidate=1800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={product.images[0]}
  alt={product.title}
  width={1200}
  height={630}
  priority
  quality={85}
/>
```

### Caching Strategy

```typescript
// Aggressive caching for share pages
export const revalidate = 3600; // 1 hour

// Or use dynamic revalidation
export const dynamic = 'force-static'; // Static generation
```

### Database Query Optimization

```typescript
// Select only needed fields
const { data } = await supabase
  .from('products')
  .select('title, images, price') // Not 'SELECT *'
  .eq('id', id)
  .single();
```

### Edge Runtime (Optional)

For faster global performance:

```typescript
// app/product/[id]/page.tsx
export const runtime = 'edge'; // Use Vercel Edge Runtime
```

### Monitoring

Add analytics tracking:

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Issue 1: Meta Tags Not Updating

**Symptom:** Changed product details but preview shows old data

**Solution:**
```bash
# Clear Vercel build cache
vercel --force

# Clear social media cache
# Use Facebook Sharing Debugger > Fetch new information
```

### Issue 2: App Not Opening

**Symptom:** Click link but app doesn't open

**Check:**
```typescript
// Verify APP_SCHEME is correct
console.log(process.env.NEXT_PUBLIC_APP_SCHEME); // Should be: veyraapp://

// Check in browser console
window.location.href = 'veyraapp://product/123';
```

### Issue 3: Database Connection Errors

**Symptom:** `Error fetching product: Invalid API key`

**Solution:**
```bash
# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Restart dev server
npm run dev
```

### Issue 4: Slow Page Load

**Symptom:** Share pages take > 3 seconds to load

**Debug:**
```typescript
// Add timing logs
const start = Date.now();
const { data } = await supabase.from('products').select('*').eq('id', id).single();
console.log(`Query took: ${Date.now() - start}ms`);
```

**Solutions:**
- Enable database connection pooling
- Add database indexes
- Use `select('specific, fields')` instead of `select('*')`
- Implement caching with `revalidate`

### Issue 5: Referral Links Not Working

**Symptom:** `/r/abc123` returns 404

**Check:**
```typescript
// Verify referral_links table exists
const { data } = await supabase.from('referral_links').select('*').limit(1);
console.log(data);

// Check RLS policies
// Ensure public can read referral_links table
```

---

## Security Checklist

### Environment Variables
- [ ] Never commit `.env.local` to Git
- [ ] Use environment variables for all secrets
- [ ] Set different values for dev/staging/production

### Supabase Security
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Use anon key (not service role key) in frontend
- [ ] Limit SELECT fields to only what's needed
- [ ] Don't expose sensitive user data in meta tags

### Headers
- [ ] Set `X-Frame-Options: SAMEORIGIN`
- [ ] Set `X-Content-Type-Options: nosniff`
- [ ] Set `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Enable HTTPS only (automatic on Vercel)

### Input Validation
- [ ] Validate all URL parameters (id, code)
- [ ] Handle SQL injection (Supabase prevents this)
- [ ] Sanitize HTML in meta tags (use escapeHtml)
- [ ] Validate UUIDs before querying

---

## Support & Documentation

### Helpful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Vercel Deployment](https://vercel.com/docs)

### Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Deployment
vercel               # Deploy to preview
vercel --prod        # Deploy to production

# Testing
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Team Contacts

**Mobile App Team:** For app scheme and deep linking questions
**Backend Team:** For Supabase schema and API questions
**DevOps:** For deployment and domain configuration

---

## Acceptance Criteria

Before marking this task as complete:

### Functionality
- [ ] All share URLs work (`/product/:id`, `/post/:id`, etc.)
- [ ] App opens when installed (iOS and Android)
- [ ] Download buttons show when app not installed
- [ ] Referral short codes work (`/r/abc123`)
- [ ] Referral tracking persists via cookies

### Meta Tags
- [ ] Product pages show correct image, title, price
- [ ] Post pages show post image and caption
- [ ] Reel pages show thumbnail
- [ ] User pages show avatar and bio
- [ ] All previews tested on WhatsApp, Facebook, Twitter

### Performance
- [ ] Initial page load < 1 second
- [ ] Images load < 500ms
- [ ] Lighthouse score > 90
- [ ] No console errors

### Deployment
- [ ] Site deployed to production
- [ ] Environment variables configured
- [ ] Custom domain working
- [ ] HTTPS enabled
- [ ] Analytics tracking active

---

**Document Version:** 1.0
**Last Updated:** 2025-01-11
**Author:** Veyra Development Team
