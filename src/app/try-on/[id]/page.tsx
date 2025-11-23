// app/try-on/[id]/page.tsx - Try-on share page with dynamic metadata

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase, TryOnHistory } from '@/lib/supabase';
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
  console.log('[Try-on Metadata] Generating metadata for try-on ID:', id);

  try {
    // Fetch try-on details with user and product information
    const { data: tryOnData, error: tryOnError } = await supabase
      .from('try_on_history')
      .select(
        `id, result_image_url, user_id, product_id,
        profiles!try_on_history_user_id_fkey (username, display_name),
        products!try_on_history_product_id_fkey (name, description)`
      )
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    console.log('[Try-on Metadata] Database query result:', { tryOnData, tryOnError });

    if (tryOnError || !tryOnData) {
      console.log('[Try-on Metadata] Try-on not found, returning 404 metadata');
      return {
        title: 'Try-on Not Found - Veyra',
        description: 'This try-on could not be found.',
      };
    }

    console.log('[Try-on Metadata] Try-on found');

    const username = (tryOnData.profiles as any)?.username || 'Creator';
    const displayName = (tryOnData.profiles as any)?.display_name || username;
    const productName = (tryOnData.products as any)?.name || 'Product';
    const resultImageUrl = tryOnData.result_image_url;

    // Generate metadata with try-on details
    // Using 3:4 aspect ratio (1080x1440) for vertical sharing
    return genMeta({
      title: `${displayName}'s Try-on on Veyra`,
      description: `Check out the ${username} try-on for the ${productName}`,
      image: resultImageUrl || '/preview_image.jpg',
      url: `https://www.veyra.co.in/try-on/${id}`,
      type: 'website',
      imageWidth: 1080,
      imageHeight: 1440, // 3:4 aspect ratio for vertical content
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Veyra - Try-on & Fashion',
      description: 'Check out amazing try-ons on Veyra',
    };
  }
}

// Main page component
export default async function TryOnSharePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  console.log('[Try-on Page] Loading try-on page for ID:', id);
  console.log('[Try-on Page] Referral ID:', referralId);

  try {
    // Fetch try-on for page content
    const { data: tryOnData, error } = await supabase
      .from('try_on_history')
      .select(
        `id, result_image_url, user_id, product_id,
        profiles!try_on_history_user_id_fkey (username, display_name),
        products!try_on_history_product_id_fkey (name, description)`
      )
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    console.log('[Try-on Page] Database query result:', { tryOnData, error });

    if (error || !tryOnData) {
      console.log('[Try-on Page] Try-on not found, returning 404');
      notFound();
    }

    console.log('[Try-on Page] Rendering SharePage for try-on');

    const username = (tryOnData.profiles as any)?.username || 'Creator';
    const displayName = (tryOnData.profiles as any)?.display_name || username;
    const productName = (tryOnData.products as any)?.name || 'Product';
    const resultImageUrl = tryOnData.result_image_url;

    return (
      <SharePage
        contentType="try-on-result"
        contentId={id}
        title={`${displayName}'s Try-on`}
        description={`Check out the ${username} try-on for the ${productName}`}
        imageUrl={resultImageUrl}
        referralId={referralId}
      />
    );
  } catch (error) {
    console.error('Error loading try-on:', error);
    notFound();
  }
}

// Enable static generation for better performance
export const revalidate = 3600; // Revalidate every hour
