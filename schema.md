create table public.profiles (
  id uuid not null,
  username character varying(50) not null,
  display_name character varying(100) null,
  bio text null,
  avatar_url character varying(500) null,
  cover_image_url character varying(500) null,
  phone_number character varying(20) null,
  phone_verified boolean null default false,
  website character varying(255) null,
  date_of_birth date null,
  gender character varying(20) null,
  profile_public boolean null default true,
  wardrobe_public boolean null default false,
  activity_public boolean null default true,
  followers_count integer null default 0,
  following_count integer null default 0,
  posts_count integer null default 0,
  is_active boolean null default true,
  last_active_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  is_profile_complete boolean not null default false,
  location jsonb null,
  group_message_requests text not null default 'everyone'::text,
  message_requests text not null default 'everyone'::text,
  wardrobe_likes_count integer null default 0,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_phone_number_key unique (phone_number),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint valid_birth_date check (
    (
      (date_of_birth is null)
      or (date_of_birth < CURRENT_DATE)
    )
  ),
  constraint valid_username check (((username)::text ~ '^[a-zA-Z0-9_]{3,50}$'::text)),
  constraint profiles_followers_count_check check ((followers_count >= 0)),
  constraint valid_website check (
    (
      (website is null)
      or ((website)::text ~ '^https?://'::text)
    )
  ),
  constraint profiles_following_count_check check ((following_count >= 0)),
  constraint profiles_gender_check check (
    (
      (gender)::text = any (
        (
          array[
            'male'::character varying,
            'female'::character varying,
            'non-binary'::character varying,
            'prefer-not-to-say'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint profiles_posts_count_check check ((posts_count >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_profiles_username on public.profiles using btree (username) TABLESPACE pg_default
where
  (is_active = true);

create index IF not exists idx_profiles_last_active on public.profiles using btree (last_active_at desc) TABLESPACE pg_default
where
  (is_active = true);

create index IF not exists idx_profiles_location_coords on public.profiles using gin (location) TABLESPACE pg_default;

create index IF not exists idx_profiles_wardrobe_likes_count on public.profiles using btree (wardrobe_likes_count desc) TABLESPACE pg_default;

create index IF not exists idx_profiles_wardrobe_public on public.profiles using btree (wardrobe_public) TABLESPACE pg_default
where
  (wardrobe_public = true);

create index IF not exists idx_profiles_wardrobe_trending on public.profiles using btree (
  wardrobe_public,
  is_active,
  wardrobe_likes_count desc
) TABLESPACE pg_default
where
  (
    (wardrobe_public = true)
    and (is_active = true)
  );

create trigger handle_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION handle_updated_at ();

create trigger trigger_notify_on_profile_update
after
update on profiles for EACH row
execute FUNCTION notify_on_profile_update ();


create table public.wardrobe_items (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  product_id uuid not null,
  product_variant_id uuid not null,
  added_at timestamp with time zone null default now(),
  removed_at timestamp with time zone null,
  is_private boolean not null default false,
  constraint wardrobe_items_pkey primary key (id),
  constraint wardrobe_items_user_product_variant_unique unique (user_id, product_id, product_variant_id),
  constraint wardrobe_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint wardrobe_items_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint wardrobe_items_variant_id_fkey foreign KEY (product_variant_id) references product_variants (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_wardrobe_items_user_id on public.wardrobe_items using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_wardrobe_items_product_id on public.wardrobe_items using btree (product_id) TABLESPACE pg_default;

create index IF not exists idx_wardrobe_items_variant_id on public.wardrobe_items using btree (product_variant_id) TABLESPACE pg_default;

create index IF not exists idx_wardrobe_items_removed_at on public.wardrobe_items using btree (removed_at) TABLESPACE pg_default;

create index IF not exists idx_wardrobe_items_user_active on public.wardrobe_items using btree (user_id) TABLESPACE pg_default
where
  (removed_at is null);

  create table public.product_images (
  id uuid not null default gen_random_uuid (),
  product_id uuid not null,
  image_url character varying(500) not null,
  alt_text character varying(255) null,
  is_primary boolean null default false,
  display_order integer null default 0,
  created_at timestamp with time zone null default now(),
  constraint product_images_pkey primary key (id),
  constraint product_images_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint product_images_display_order_check check ((display_order >= 0))
) TABLESPACE pg_default;

create trigger trigger_update_primary_image_delete
after DELETE on product_images for EACH row
execute FUNCTION update_product_primary_image ();

create trigger trigger_update_primary_image_insert
after INSERT on product_images for EACH row
execute FUNCTION update_product_primary_image ();

create trigger trigger_update_primary_image_update
after
update on product_images for EACH row when (
  new.is_primary is distinct from old.is_primary
  or new.image_url::text is distinct from old.image_url::text
)
execute FUNCTION update_product_primary_image ();


create table public.post_media (
  id uuid not null default gen_random_uuid (),
  post_id uuid not null,
  media_type character varying(20) not null,
  media_url character varying(500) not null,
  thumbnail_url character varying(500) null,
  display_order integer null default 0,
  alt_text character varying(255) null,
  width integer null,
  height integer null,
  created_at timestamp with time zone null default now(),
  constraint post_media_pkey primary key (id),
  constraint post_media_post_id_fkey foreign KEY (post_id) references posts (id) on delete CASCADE,
  constraint post_media_height_check check ((height > 0)),
  constraint post_media_media_type_check check (
    (
      (media_type)::text = any (
        (
          array[
            'image'::character varying,
            'video'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint post_media_display_order_check check ((display_order >= 0)),
  constraint post_media_width_check check ((width > 0)),
  constraint valid_media_url check (((media_url)::text ~ '^https?://'::text))
) TABLESPACE pg_default;