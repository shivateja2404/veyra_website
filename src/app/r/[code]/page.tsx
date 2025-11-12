// app/r/[code]/page.tsx - Referral short code handler with tracking

import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function ReferralRedirect({ params }: PageProps) {
  const { code } = await params;

  try {
    // Look up referral link in database (using 'code' column, not 'short_code')
    const { data: refLink, error } = await supabase
      .from('short_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !refLink) {
      console.error('Referral link not found:', code, error);
      notFound();
    }

    // Check if expired
    if (refLink.expires_at && new Date(refLink.expires_at) < new Date()) {
      console.error('Referral link expired:', code);
      notFound();
    }

    // Increment click count and update last_clicked_at
    try {
      await supabase
        .from('short_codes')
        .update({
          click_count: (refLink.click_count || 0) + 1,
          last_clicked_at: new Date().toISOString()
        })
        .eq('code', code);
      console.log('Updated click count for:', code);
    } catch (err) {
      console.error('Failed to update click count:', err);
    }

    // Redirect to actual content with creator tracking
    const targetUrl = `/${refLink.content_type}/${refLink.content_id}?ref=${refLink.creator_user_id}`;

    redirect(targetUrl);
  } catch (error) {
    console.error('Error handling referral:', error);
    notFound();
  }
}

// No caching for referral links to ensure click tracking accuracy
export const revalidate = 0;
export const dynamic = 'force-dynamic';
