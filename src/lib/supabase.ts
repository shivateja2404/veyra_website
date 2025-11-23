// lib/supabase.ts - Supabase client and type definitions for share pages

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for share content
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  brand?: string;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at?: string;
}

export interface WardrobeItem {
  id: string;
  user_id: string;
  product_id: string;
  product_variant_id: string;
  added_at: string;
  removed_at?: string | null;
  is_private: boolean;
}

export interface Post {
  id: string;
  caption: string;
  image_url: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface Reel {
  id: string;
  caption: string;
  thumbnail_url: string;
  video_url: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  wardrobe_preview_url?: string;          // Pre-generated wardrobe collage URL
  wardrobe_item_count?: number;           // Auto-updated by trigger
  wardrobe_preview_updated_at?: string;   // Timestamp of last preview generation
}

export interface ReferralLink {
  id: string;
  short_code: string;
  content_type: string;
  content_id: string;
  creator_id: string;
  click_count: number;
}

export interface TryOnHistory {
  id: string;
  user_id: string;
  product_id: string;
  image_hash: string;
  garment_image_url: string;
  result_image_url: string;
  alphabake_tryon_id?: string;
  processing_time_ms?: number;
  garment_type?: string;
  mode?: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  is_deleted?: boolean;
  share_count?: number;
  download_count?: number;
}

// Sharing feature types (from 20250111_sharing_feature_complete.sql)
export interface SharedLink {
  id: string;
  content_type: 'product' | 'post' | 'reel' | 'wardrobe' | 'profile';
  content_id: string;
  creator_user_id: string;
  shared_by_user_id?: string;
  share_url: string;
  short_code?: string;
  view_count: number;
  click_count: number;
  install_count: number;
  conversion_count: number;
  platform?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
  last_viewed_at?: string;
}

export interface ShortCode {
  id: string;
  code: string;
  content_type: 'product' | 'post' | 'reel' | 'wardrobe' | 'profile';
  content_id: string;
  creator_user_id: string;
  full_url: string;
  click_count: number;
  unique_clicks: number;
  conversion_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  last_clicked_at?: string;
}

export interface CreatorShare {
  id: string;
  share_id?: string;
  short_code?: string;
  creator_user_id: string;
  shared_by_user_id?: string;
  content_type: 'product' | 'post' | 'reel' | 'wardrobe' | 'profile';
  content_id: string;
  visitor_session_id?: string;
  visitor_ip_hash?: string;
  visitor_user_agent?: string;
  visitor_platform?: 'ios' | 'android' | 'web';
  first_click_at: string;
  app_opened: boolean;
  app_opened_at?: string;
  conversion: boolean;
  conversion_at?: string;
  conversion_type?: 'purchase' | 'follow' | 'signup' | 'like';
  conversion_value?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorCommission {
  id: string;
  creator_user_id: string;
  creator_share_id?: string;
  commission_type: 'sale' | 'referral' | 'bonus' | 'milestone';
  commission_amount: number;
  commission_rate?: number;
  base_amount?: number;
  currency: string;
  content_type?: string;
  content_id?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  approved_at?: string;
  paid_at?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
