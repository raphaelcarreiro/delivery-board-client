import { Image } from './image';
import { Category } from './category';

export interface Additional {
  id: number;
  additional_id: number;
  name: string;
  price: number;
  formattedPrice: string;
  selected: boolean;
  amount: number;
}

export interface Ingredient {
  id: number;
  ingredient_id: number;
  name: string;
  selected: boolean;
}

export interface ComplementCategory {
  id: number;
  product_complement_category_id: number;
  product_id: number;
  name: string;
  min_quantity: number;
  max_quantity: number;
  is_required: boolean;
  is_pizza_taste: boolean;
  is_pizza_size: boolean;
  complements: Complement[];
}

export interface ComplementPrice {
  id: number;
  price: number;
  formattedPrice: string | number;
  product_complement_price_id: number;
  product_complement_size_id: number;
  selected: boolean;
}

export interface ComplementAdditional {
  id: number;
  product_complement_additional_id: number;
  name: string;
  prices: ComplementAdditionalPrice[];
  selected: boolean;
}

export interface ComplementIngredient {
  id: number;
  product_complement_ingredient_id: number;
  name: string;
  selected: boolean;
}

export interface ComplementAdditionalPrice {
  id: number;
  price: number;
  formattedPrice: string | number;
  product_complement_additional_price_id: number;
  product_complement_size_id: number;
  selected: boolean;
}

export interface Complement {
  id: number;
  product_complement_id: number;
  name: string;
  description: string;
  is_activated: boolean;
  selected: boolean;
  taste_amount: number;
  image: Image;
  price?: number;
  formattedPrice?: string | number;
  prices: ComplementPrice[];
  ingredients: ComplementIngredient[];
  additional: ComplementAdditional[];
}

export interface Product {
  id: number;
  uid: number;
  name: string;
  url: string;
  activated: boolean;
  description: string;
  price: number;
  formattedPrice: string;
  special_price: number | null;
  formattedSpecialPrice: string;
  promotion_activated: boolean;
  image: Image;
  category: Category;
  additional: Additional[];
  ingredients: Ingredient[];
  annotation: string;
  complement_categories: ComplementCategory[];
  ready?: boolean;
}

export interface CreatedOrderProduct {
  id: number;
  name: string;
  url: string;
  activated: boolean;
  description: boolean;
  price: number;
  formattedPrice: string;
  special_price: number | null;
  formattedSpecialPrice: string;
  promotion_activated: boolean;
  image: Image;
  category: Category;
  additional: OrderProductAdditional[];
  ingredients: Ingredient[];
  annotation: string;
  complement_categories: ComplementCategory[];
  product_price: number;
  final_price: number;
  formattedFinalPrice: string;
  formattedProductPrice: string;
  amount: number;
}

export interface OrderProductAdditional extends Additional {
  amount: number;
}
