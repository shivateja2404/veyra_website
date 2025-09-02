export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          phone: string | null
          postal_code: string
          state: string
          street: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          phone?: string | null
          postal_code: string
          state: string
          street: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          phone?: string | null
          postal_code?: string
          state?: string
          street?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_name: string
          created_at: string | null
          description: string | null
          id: string
          profile_id: string
          rating: number | null
          total_sales: number | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          brand_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          profile_id: string
          rating?: number | null
          total_sales?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          brand_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          profile_id?: string
          rating?: number | null
          total_sales?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          size: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          size?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_method: Database["public"]["Enums"]["delivery_method"] | null
          estimated_delivery: string | null
          id: string
          order_number: string
          payment_method: string | null
          shipping_address_id: string | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          estimated_delivery?: string | null
          id?: string
          order_number: string
          payment_method?: string | null
          shipping_address_id?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          estimated_delivery?: string | null
          id?: string
          order_number?: string
          payment_method?: string | null
          shipping_address_id?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          comment_count: number | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          is_archived: boolean | null
          like_count: number | null
          media_urls: string[] | null
          tagged_products: string[] | null
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_archived?: boolean | null
          like_count?: number | null
          media_urls?: string[] | null
          tagged_products?: string[] | null
          type: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          is_archived?: boolean | null
          like_count?: number | null
          media_urls?: string[] | null
          tagged_products?: string[] | null
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string
          category: string
          colors: string[] | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          sale_price: number | null
          sizes: string[] | null
          stock_quantity: number | null
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          category: string
          colors?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          sale_price?: number | null
          sizes?: string[] | null
          stock_quantity?: number | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          category?: string
          colors?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          sale_price?: number | null
          sizes?: string[] | null
          stock_quantity?: number | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          follower_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          location?: string | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          images: string[] | null
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          media_url: string
          tagged_products: string[] | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          media_url: string
          tagged_products?: string[] | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          media_url?: string
          tagged_products?: string[] | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string | null
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string | null
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string | null
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          brand_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          ip_address: string | null
          is_brand: boolean | null
          source: string | null
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          ip_address?: string | null
          is_brand?: boolean | null
          source?: string | null
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          ip_address?: string | null
          is_brand?: boolean | null
          source?: string | null
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          brand: string
          category: string
          color: string
          created_at: string | null
          id: string
          images: string[]
          last_worn: string | null
          name: string
          price: number
          purchase_date: string
          size: string
          store_link: string | null
          times_worn: number | null
          user_id: string
        }
        Insert: {
          brand: string
          category: string
          color: string
          created_at?: string | null
          id?: string
          images: string[]
          last_worn?: string | null
          name: string
          price: number
          purchase_date: string
          size: string
          store_link?: string | null
          times_worn?: number | null
          user_id: string
        }
        Update: {
          brand?: string
          category?: string
          color?: string
          created_at?: string | null
          id?: string
          images?: string[]
          last_worn?: string | null
          name?: string
          price?: number
          purchase_date?: string
          size?: string
          store_link?: string | null
          times_worn?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wardrobe_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "user" | "creator" | "brand"
      delivery_method: "standard" | "express" | "hyperlocal"
      notification_type:
        | "like"
        | "comment"
        | "follow"
        | "order"
        | "message"
        | "mention"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      post_type: "photo" | "reel" | "text"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["user", "creator", "brand"],
      delivery_method: ["standard", "express", "hyperlocal"],
      notification_type: [
        "like",
        "comment",
        "follow",
        "order",
        "message",
        "mention",
      ],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      post_type: ["photo", "reel", "text"],
    },
  },
} as const
