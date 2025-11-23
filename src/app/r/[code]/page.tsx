// app/r/[code]/page.tsx - Referral short code handler with tracking

import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function ReferralRedirect({ params }: PageProps) {
  const { code } = await params;

  console.log('[Short Code Redirect] Processing short code:', code);

  try {
    // Look up referral link in database (using 'code' column, not 'short_code')
    const { data: refLink, error } = await supabase
      .from('short_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    console.log('[Short Code Redirect] Database query result:', { refLink, error });

    if (error || !refLink) {
      console.error('[Short Code Redirect] Referral link not found:', code, error);
      notFound();
    }

    console.log('[Short Code Redirect] Short code found:', {
      content_type: refLink.content_type,
      content_id: refLink.content_id,
      creator_user_id: refLink.creator_user_id,
      current_clicks: refLink.click_count
    });

    // Check if expired
    if (refLink.expires_at && new Date(refLink.expires_at) < new Date()) {
      console.error('[Short Code Redirect] Referral link expired:', code);
      notFound();
    }

    // Increment click count and update last_clicked_at
    try {
      const newClickCount = (refLink.click_count || 0) + 1;
      await supabase
        .from('short_codes')
        .update({
          click_count: newClickCount,
          last_clicked_at: new Date().toISOString()
        })
        .eq('code', code);
      console.log('[Short Code Redirect] Updated click count for:', code, '- New count:', newClickCount);
    } catch (err) {
      console.error('[Short Code Redirect] Failed to update click count:', err);
    }

    // Redirect to actual content with creator tracking
    const targetUrl = `/${refLink.content_type}/${refLink.content_id}?ref=${refLink.creator_user_id}`;

    console.log('[Short Code Redirect] Redirecting to:', targetUrl);

    redirect(targetUrl);
  } catch (error) {
    console.error('Error handling referral:', error);
    notFound();
  }
}

// No caching for referral links to ensure click tracking accuracy
export const revalidate = 0;
export const dynamic = 'force-dynamic';
