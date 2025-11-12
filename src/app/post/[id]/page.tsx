// app/post/[id]/page.tsx - Post share page with dynamic metadata

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
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        caption,
        image_url,
        user_id,
        profiles!posts_user_id_fkey(username, full_name)
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return {
        title: 'Post Not Found - Veyra',
        description: 'This post could not be found.',
      };
    }

    const userName = (post.profiles as any)?.full_name || 'User';

    return genMeta({
      title: `${userName}'s Post on Veyra`,
      description: post.caption || 'Check out this post on Veyra!',
      image: post.image_url || '/preview_image.jpg',
      url: `https://www.veyra.co.in/post/${id}`,
      type: 'article',
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Veyra - Fashion & Style',
    };
  }
}

export default async function PostSharePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('caption, image_url')
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
        imageUrl={post.image_url}
        referralId={referralId}
      />
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}

export const revalidate = 600; // Revalidate every 10 minutes
