// app/product/[id]/page.tsx - Product share page with dynamic metadata

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ref?: string; r?: string }>;
}

// Generate metadata for social media previews
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    // Fetch product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description, images, price, category, brand')
      .eq('id', id)
      .single();

    if (error || !product) {
      return {
        title: 'Product Not Found - Veyra',
        description: 'This product could not be found.',
      };
    }

    const productName = product.brand
      ? `${product.brand} ${product.name}`
      : product.name;

    // Generate metadata with product details
    return genMeta({
      title: `${productName} - ₹${product.price?.toLocaleString() || 'N/A'}`,
      description:
        product.description ||
        `Check out this ${product.category || 'product'} on Veyra!`,
      image: product.images?.[0] || '/preview_image.jpg',
      url: `https://www.veyra.co.in/product/${id}`,
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
export default async function ProductSharePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  try {
    // Fetch product for page content
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description, images, price, brand')
      .eq('id', id)
      .single();

    if (error || !product) {
      notFound();
    }

    const productName = product.brand
      ? `${product.brand} ${product.name}`
      : product.name;

    return (
      <SharePage
        contentType="product"
        contentId={id}
        title={productName}
        description={product.description}
        imageUrl={product.images?.[0]}
        referralId={referralId}
      />
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

// Enable static generation for known products (optional)
export const revalidate = 3600; // Revalidate every hour
