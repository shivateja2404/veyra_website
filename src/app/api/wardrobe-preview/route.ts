// app/api/wardrobe-preview/route.ts - Wardrobe grid collage generator

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateWardrobeCollage } from '@/lib/wardrobeCollage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const format = searchParams.get('format') || 'image'; // 'image' or 'json'

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // 1. Get user profile with wardrobe preview info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, wardrobe_preview_url, wardrobe_item_count, wardrobe_preview_updated_at')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if we have a valid cached preview (not stale)
    const hasCachedPreview = profile.wardrobe_preview_url && profile.wardrobe_preview_updated_at;

    // If cached preview exists and format is JSON, return metadata only
    if (format === 'json' && hasCachedPreview) {
      return NextResponse.json({
        username: profile.username,
        fullName: profile.full_name,
        itemCount: profile.wardrobe_item_count || 0,
        previewUrl: profile.wardrobe_preview_url,
        lastUpdated: profile.wardrobe_preview_updated_at,
        suggestedLayout: getSuggestedLayout(profile.wardrobe_item_count || 0),
      });
    }

    // 2. Fetch wardrobe items through proper join (wardrobe_items -> products -> product_images)
    const { data: wardrobeItems, error: itemsError } = await supabase
      .from('wardrobe_items')
      .select(`
        id,
        product_id,
        products!inner (
          id,
          name,
          product_images!inner (
            image_url,
            is_primary,
            display_order
          )
        )
      `)
      .eq('user_id', profile.id)
      .is('removed_at', null)
      .eq('is_private', false)
      .order('added_at', { ascending: false })
      .limit(6);

    if (itemsError) {
      console.error('Error fetching wardrobe items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch wardrobe items' },
        { status: 500 }
      );
    }

    // Extract image URLs from the nested structure
    // Get primary image first, then fallback to first image by display_order
    const imageUrls = wardrobeItems
      ?.map(item => {
        const product = (item as any).products;
        const images = product?.product_images || [];

        // Sort: primary first, then by display_order
        const sortedImages = [...images].sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.display_order || 0) - (b.display_order || 0);
        });

        return sortedImages[0]?.image_url;
      })
      .filter(Boolean)
      .slice(0, 4) || []; // Take up to 4 items for grid

    // If JSON format requested, return data
    if (format === 'json') {
      return NextResponse.json({
        username: profile.username,
        fullName: profile.full_name,
        itemCount: wardrobeItems?.length || 0,
        items: wardrobeItems?.slice(0, 5).map(item => {
          const product = (item as any).products;
          const images = product?.product_images || [];
          const sortedImages = [...images].sort((a: any, b: any) => {
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return (a.display_order || 0) - (b.display_order || 0);
          });

          return {
            id: item.id,
            productId: item.product_id,
            name: product?.name || 'Wardrobe Item',
            imageUrl: sortedImages[0]?.image_url || null,
          };
        }) || [],
        suggestedLayout: getSuggestedLayout(imageUrls.length),
      });
    }

    // 3. Generate collage image if needed
    if (imageUrls.length === 0) {
      // No wardrobe items - return placeholder or avatar
      return NextResponse.json(
        { error: 'No wardrobe items found' },
        { status: 404 }
      );
    }

    // Generate collage based on item count
    const collageBuffer = await generateWardrobeCollage(imageUrls);

    // 4. Upload collage to storage and update profile
    try {
      const fileName = `wardrobe_previews/${profile.id}_${Date.now()}.jpg`;

      // Upload to Supabase Storage (wardrobe_previews bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wardrobe_previews')
        .upload(fileName, collageBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError && uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('wardrobe_previews')
          .getPublicUrl(fileName);

        // Update profile with preview URL
        await supabase
          .from('profiles')
          .update({
            wardrobe_preview_url: urlData.publicUrl,
            wardrobe_preview_updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        console.log(`Wardrobe preview saved for ${username}: ${urlData.publicUrl}`);
      } else {
        console.error('Failed to upload wardrobe preview:', uploadError);
      }
    } catch (uploadErr) {
      // Non-critical - still return the collage even if save fails
      console.error('Error saving wardrobe preview:', uploadErr);
    }

    // 5. Return image (convert Buffer to Uint8Array for NextResponse)
    return new NextResponse(new Uint8Array(collageBuffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Wardrobe preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

/**
 * Suggest optimal grid layout based on number of items
 */
function getSuggestedLayout(count: number): string {
  if (count === 0) return 'no-items';
  if (count === 1) return 'single-centered';
  if (count === 2) return 'side-by-side';
  if (count === 3) return 'asymmetric-1-large-2-small';
  return 'grid-2x2';
}

// Cache for 1 hour
export const revalidate = 3600;
