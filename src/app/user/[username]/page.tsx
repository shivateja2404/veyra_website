// app/user/[username]/page.tsx - User profile share page with dynamic metadata

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
  console.log('[User Metadata] Generating metadata for username:', username);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, display_name, bio, avatar_url')
      .eq('username', username)
      .single();

    console.log('[User Metadata] Database query result:', { profile, error });

    if (error || !profile) {
      console.log('[User Metadata] User not found, returning 404 metadata');
      return { title: 'User Not Found - Veyra' };
    }

    console.log('[User Metadata] User found:', profile.display_name, '@' + profile.username);

    return genMeta({
      title: `${profile.display_name} (@${profile.username}) on Veyra`,
      description: profile.bio?.substring(0, 160) || `Follow ${profile.display_name} on Veyra`,
      image: profile.avatar_url || '/preview_image.jpg',
      url: `https://www.veyra.co.in/user/${username}`,
      type: 'profile',
      imageWidth: 400,
      imageHeight: 400,
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function UserSharePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  console.log('[User Page] Loading user page for username:', username);
  console.log('[User Page] Referral ID:', referralId);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, display_name, bio, avatar_url')
      .eq('username', username)
      .single();

    console.log('[User Page] Database query result:', { profile, error });

    if (error || !profile) {
      console.log('[User Page] User not found, returning 404');
      notFound();
    }

    console.log('[User Page] Rendering SharePage for user:', profile.display_name);

    return (
      <SharePage
        contentType="user"
        contentId={username}
        title={`${profile.display_name} on Veyra`}
        description={profile.bio}
        imageUrl={profile.avatar_url}
        referralId={referralId}
      />
    );
  } catch (error) {
    notFound();
  }
}

export const revalidate = 1800; // 30 minutes
