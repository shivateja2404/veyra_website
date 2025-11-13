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
  console.log('[Product Metadata] Generating metadata for product ID:', id);

  try {
    // Fetch product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description, base_price, sale_price, primary_image_url')
      .eq('id', id)
      .single();

    console.log('[Product Metadata] Database query result:', { product, error });

    if (error || !product) {
      console.log('[Product Metadata] Product not found, returning 404 metadata');
      return {
        title: 'Product Not Found - Veyra',
        description: 'This product could not be found.',
      };
    }

    console.log('[Product Metadata] Product found:', product.name);

    const displayPrice = product.sale_price || product.base_price;

    // Generate metadata with product details
    return genMeta({
      title: `${product.name} - ₹${displayPrice?.toLocaleString() || 'N/A'}`,
      description:
        product.description?.substring(0, 160) ||
        `Shop ${product.name} on Veyra - India's social commerce platform`,
      image: product.primary_image_url || '/preview_image.jpg',
      url: `https://www.veyra.co.in/product/${id}`,
      type: 'website',
      price: displayPrice,
      currency: 'INR',
      imageWidth: 1200,
      imageHeight: 1200,
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

  console.log('[Product Page] Loading product page for ID:', id);
  console.log('[Product Page] ID type:', typeof id);
  console.log('[Product Page] ID length:', id.length);
  console.log('[Product Page] Referral ID:', referralId);

  try {
    // First, let's check if ANY products exist
    const { data: allProducts, error: countError } = await supabase
      .from('products')
      .select('id, name, status, is_active')
      .limit(5);

    console.log('[Product Page] Sample products in database:', allProducts);
    console.log('[Product Page] Count error:', countError);

    // Fetch product for page content
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description, primary_image_url, status, is_active')
      .eq('id', id)
      .single();

    console.log('[Product Page] Database query result:', { product, error });
    console.log('[Product Page] Full error details:', JSON.stringify(error, null, 2));

    if (error || !product) {
      console.log('[Product Page] Product not found, returning 404');
      console.log('[Product Page] Error code:', error?.code);
      console.log('[Product Page] Error message:', error?.message);
      console.log('[Product Page] Error details:', error?.details);
      notFound();
    }

    console.log('[Product Page] Rendering SharePage for:', product.name);

    return (
      <SharePage
        contentType="product"
        contentId={id}
        title={product.name}
        description={product.description}
        imageUrl={product.primary_image_url}
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
