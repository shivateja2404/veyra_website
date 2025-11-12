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

  try {
    const { data: reel, error } = await supabase
      .from('reels')
      .select(`
        caption,
        thumbnail_url,
        video_url,
        user_id,
        profiles!reels_user_id_fkey(username, full_name)
      `)
      .eq('id', id)
      .single();

    if (error || !reel) {
      return {
        title: 'Reel Not Found - Veyra',
      };
    }

    const userName = (reel.profiles as any)?.full_name || 'User';

    return genMeta({
      title: `${userName}'s Reel on Veyra`,
      description: reel.caption || 'Watch this reel on Veyra!',
      image: reel.thumbnail_url || '/preview_image.jpg',
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
        referralId={referralId}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 600;
