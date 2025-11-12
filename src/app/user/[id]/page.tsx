// app/user/[id]/page.tsx - User profile share page with dynamic metadata

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
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, full_name, bio, avatar_url')
      .eq('id', id)
      .single();

    if (error || !profile) {
      return { title: 'User Not Found - Veyra' };
    }

    return genMeta({
      title: `${profile.full_name} (@${profile.username}) on Veyra`,
      description: profile.bio || 'Check out this profile on Veyra!',
      image: profile.avatar_url || '/preview_image.jpg',
      url: `https://www.veyra.co.in/user/${id}`,
      type: 'profile',
    });
  } catch (error) {
    return { title: 'Veyra - Fashion & Style' };
  }
}

export default async function UserSharePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const referralId = search.ref || search.r;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, full_name, bio, avatar_url')
      .eq('id', id)
      .single();

    if (error || !profile) {
      notFound();
    }

    return (
      <SharePage
        contentType="user"
        contentId={id}
        title={`${profile.full_name} on Veyra`}
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
