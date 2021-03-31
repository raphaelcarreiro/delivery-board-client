import { Category } from './category';
import { Image } from './image';
import { Product } from './product';

export interface PromotionCategory extends Category {
  id: number;
  promotion_id: number;
  category_id: number;
  value: number;
}

export interface PromotionProduct extends Product {
  id: number;
  product_id: number;
  amount: number;
  total: number;
}

export interface PromotionOfferedProduct extends Product {
  id: number;
  product_id: number;
  amount: number;
  total: number;
}

export interface PromotionOrderValue {
  id: number;
  promotion_id: number;
  order_value: number;
}

export interface PromotionSafe {
  id: number;
  promotion_id: number;
  discount: number;
  discount_type: 'percent' | 'value';
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  valid_at: string;
  formattedValidAt?: string;
  type: 'safe' | 'get';
  activated: boolean;
  categories: PromotionCategory[];
  products: PromotionProduct[];
  order_value: PromotionOrderValue | null;
  offered_products: PromotionOfferedProduct[];
  safe: PromotionSafe;
  image: null | Image;
}
