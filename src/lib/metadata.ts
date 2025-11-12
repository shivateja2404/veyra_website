// lib/metadata.ts - Metadata generation utility for social media previews

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

const DEFAULT_IMAGE = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.veyra.co.in'}/preview_image.jpg`;

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
