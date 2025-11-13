// app/wardrobe/[username]/page.tsx - Wardrobe collection share page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ ref?: string; r?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  console.log('[Wardrobe Metadata] Generating metadata for username:', username);

  try {
    // Fetch profile with wardrobe preview columns
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, wardrobe_preview_url, wardrobe_item_count, wardrobe_preview_updated_at')
      .eq('username', username)
      .single();

    console.log('[Wardrobe Metadata] Database query result:', { profile, error });

    if (error || !profile) {
      console.log('[Wardrobe Metadata] Wardrobe not found, returning 404 metadata');
      return { title: 'Wardrobe Not Found - Veyra' };
    }

    console.log('[Wardrobe Metadata] Wardrobe found for:', profile.display_name, 'Items:', profile.wardrobe_item_count);

    // Determine preview image strategy
    let previewImage: string;
    const itemCount = profile.wardrobe_item_count || 0;

    console.log('[Wardrobe Metadata] Determining preview image for item count:', itemCount);

    if (itemCount > 0) {
      // Check if we have a pre-generated preview
      if (profile.wardrobe_preview_url && profile.wardrobe_preview_updated_at) {
        // Use pre-generated collage (most efficient)
        previewImage = profile.wardrobe_preview_url;
        console.log('[Wardrobe Metadata] Using pre-generated preview:', previewImage);
      } else {
        // Preview needs generation - use API endpoint
        // API will generate and save to wardrobe_preview_url
        previewImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.veyra.co.in'}/api/wardrobe-preview?username=${username}`;
        console.log('[Wardrobe Metadata] Using API endpoint for preview:', previewImage);
      }
    } else {
      // Fallback to avatar if no items
      previewImage = profile.avatar_url || '/preview_image.jpg';
      console.log('[Wardrobe Metadata] Using fallback image (no wardrobe items):', previewImage);
    }

    const description = `${profile.display_name}'s wardrobe - ${itemCount} items on Veyra`;

    return genMeta({
      title: `${profile.display_name}'s Wardrobe Collection`,
      description: description.substring(0, 160),
      image: previewImage,
      url: `https://www.veyra.co.in/wardrobe/${username}`,
      type: 'website',
      imageWidth: 1200,
      imageHeight: 630,
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function WardrobeSharePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  console.log('[Wardrobe Page] Loading wardrobe page for username:', username);
  console.log('[Wardrobe Page] Referral ID:', referralId);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('username', username)
      .single();

    console.log('[Wardrobe Page] Database query result:', { profile, error });

    if (error || !profile) {
      console.log('[Wardrobe Page] Wardrobe not found, returning 404');
      notFound();
    }

    console.log('[Wardrobe Page] Rendering SharePage for wardrobe of:', profile.display_name);
    console.log('[Wardrobe Page] Avatar URL:', profile.avatar_url);
    console.log('[Wardrobe Page] Username for contentId:', username);

    return (
      <SharePage
        contentType="wardrobe"
        contentId={username}
        title={`${profile.display_name}'s Wardrobe`}
        description="Explore this wardrobe collection"
        imageUrl={profile.avatar_url || undefined}
        referralId={referralId}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 1800;
