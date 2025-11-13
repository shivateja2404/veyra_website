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
  console.log('[Post Metadata] Generating metadata for post ID:', id);

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        caption,
        user_id,
        profiles!posts_user_id_fkey(username, display_name),
        post_media(media_url, media_type, display_order)
      `)
      .eq('id', id)
      .single();

    console.log('[Post Metadata] Database query result:', { post, error });

    if (error || !post) {
      console.log('[Post Metadata] Post not found, returning 404 metadata');
      return {
        title: 'Post Not Found - Veyra',
        description: 'This post could not be found.',
      };
    }

    console.log('[Post Metadata] Post found, user:', (post.profiles as any)?.display_name);

    const userName = (post.profiles as any)?.display_name || 'User';
    const postMedia = (post.post_media as any)?.[0]?.media_url || '/preview_image.jpg';

    return genMeta({
      title: `${userName}'s Post on Veyra`,
      description: post.caption || 'Check out this post on Veyra!',
      image: postMedia,
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

  console.log('[Post Page] Loading post page for ID:', id);
  console.log('[Post Page] Referral ID:', referralId);

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('caption, post_media(media_url, media_type, display_order)')
      .eq('id', id)
      .single();

    console.log('[Post Page] Database query result:', { post, error });

    if (error || !post) {
      console.log('[Post Page] Post not found, returning 404');
      notFound();
    }

    console.log('[Post Page] Rendering SharePage for post with caption:', post.caption?.substring(0, 50));

    const postMedia = (post.post_media as any)?.[0]?.media_url;

    return (
      <SharePage
        contentType="post"
        contentId={id}
        title="Check out this post on Veyra!"
        description={post.caption}
        imageUrl={postMedia}
        referralId={referralId}
      />
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}

export const revalidate = 600; // Revalidate every 10 minutes
