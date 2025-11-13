// app/reel/[id]/page.tsx - Reel share page with dynamic metadata

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMetadata as genMeta } from '@/lib/metadata';
import SharePage from '@/components/SharePage';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ref?: string; r?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  console.log('[Reel Metadata] Generating metadata for reel ID:', id);

  try {
    const { data: reel, error } = await supabase
      .from('reels')
      .select(`
        caption,
        user_id,
        profiles!reels_user_id_fkey(username, display_name),
        post_media(media_url, thumbnail_url, media_type, display_order)
      `)
      .eq('id', id)
      .single();

    console.log('[Reel Metadata] Database query result:', { reel, error });

    if (error || !reel) {
      console.log('[Reel Metadata] Reel not found, returning 404 metadata');
      return {
        title: 'Reel Not Found - Veyra',
      };
    }

    console.log('[Reel Metadata] Reel found, user:', (reel.profiles as any)?.display_name);

    const userName = (reel.profiles as any)?.display_name || 'User';
    const reelThumbnail = (reel.post_media as any)?.[0]?.thumbnail_url || (reel.post_media as any)?.[0]?.media_url || '/preview_image.jpg';

    return genMeta({
      title: `${userName}'s Reel on Veyra`,
      description: reel.caption || 'Watch this reel on Veyra!',
      image: reelThumbnail,
      url: `https://www.veyra.co.in/reel/${id}`,
      type: 'video.other',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function ReelSharePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  console.log('[Reel Page] Loading reel page for ID:', id);
  console.log('[Reel Page] Referral ID:', referralId);

  try {
    const { data: reel, error } = await supabase
      .from('reels')
      .select('caption, post_media(media_url, thumbnail_url, media_type, display_order)')
      .eq('id', id)
      .single();

    console.log('[Reel Page] Database query result:', { reel, error });

    if (error || !reel) {
      console.log('[Reel Page] Reel not found, returning 404');
      notFound();
    }

    console.log('[Reel Page] Rendering SharePage for reel with caption:', reel.caption?.substring(0, 50));

    const reelThumbnail = (reel.post_media as any)?.[0]?.thumbnail_url || (reel.post_media as any)?.[0]?.media_url;

    return (
      <SharePage
        contentType="reel"
        contentId={id}
        title="Watch this reel on Veyra!"
        description={reel.caption}
        imageUrl={reelThumbnail}
        referralId={referralId}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 600;
