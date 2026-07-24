export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  banner_image: string | null;
  emoji: string | null;
  sort_order: number;
  is_active: boolean;
  subcategories: Subcategory[];
  product_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  file_path: string;
  file_size: number;
  sort_order: number;
  is_primary: boolean;
}

export type ProductBadge = 'none' | 'new' | 'bestseller' | 'sale' | 'limited';

export interface DiscountTier {
  id?: number;
  min_qty: number;
  discount_percent: number;
}

export interface Product {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  dimensions: string | null;
  price: number | null;
  mrp: number | null;
  badge: ProductBadge;
  filter_tag: string | null;
  emoji_icon: string | null;
  is_new: boolean;
  is_active: boolean;
  in_stock: boolean;
  stock_qty: number | null;
  category_name?: string;
  category_slug?: string;
  subcategory_name?: string;
  subcategory_slug?: string;
  primary_image?: string | null;
  video_url?: string | null;
  images?: ProductImage[];
  discountTiers?: DiscountTier[];
}

export interface ProductComment {
  id: number;
  name: string;
  rating: number | null;
  comment_text: string;
  created_at: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface CommunityPost {
  id: number;
  title: string | null;
  image_path: string;
  caption: string | null;
  customer_name: string | null;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  discountTiers?: DiscountTier[];
}

export interface Customer {
  phone: string;
  name: string;
  email: string | null;
  total_orders: number;
  total_spent: number;
  first_order_at: string;
  last_order_at: string;
}

export interface OrderSummary {
  orderNumber: string;
  status: string;
  subtotal: number;
  createdAt: string;
  items: {
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
}
