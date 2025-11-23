// lib/metadata.ts - Metadata generation utility for social media previews

import { Metadata } from 'next';

interface MetaTagData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'video.other' | 'profile';
  price?: number;
  currency?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const DEFAULT_IMAGE = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.veyra.co.in'}/preview_image.jpg`;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.veyra.co.in';

// Ensure image URL is absolute with HTTPS
function ensureAbsoluteUrl(imageUrl: string): string {
  if (!imageUrl) return DEFAULT_IMAGE;

  // Already absolute URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Relative URL - make it absolute
  if (imageUrl.startsWith('/')) {
    return `${SITE_URL}${imageUrl}`;
  }

  // No leading slash - add it
  return `${SITE_URL}/${imageUrl}`;
}

// Get image type from URL
function getImageType(imageUrl: string): string {
  const url = imageUrl.toLowerCase();
  if (url.includes('.png')) return 'image/png';
  if (url.includes('.jpg') || url.includes('.jpeg')) return 'image/jpeg';
  if (url.includes('.gif')) return 'image/gif';
  if (url.includes('.webp')) return 'image/webp';
  return 'image/jpeg'; // default
}

export function generateMetadata(data: MetaTagData): Metadata {
  const {
    title,
    description,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    price,
    currency = 'INR',
    imageWidth = 1200,
    imageHeight = 630,
  } = data;

  // Ensure image URL is absolute and uses HTTPS
  const absoluteImageUrl = ensureAbsoluteUrl(image);
  const imageType = getImageType(absoluteImageUrl);

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
          url: absoluteImageUrl,
          secureUrl: absoluteImageUrl.replace('http://', 'https://'),
          width: imageWidth,
          height: imageHeight,
          alt: title,
          type: imageType,
        },
      ],
      locale: 'en_US',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
      site: '@veyra',
      creator: '@veyra',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add product-specific tags as custom meta tags
  if (price) {
    metadata.other = {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
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
