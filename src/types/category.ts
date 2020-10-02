import { Image } from './image';
import { Product } from './product';
import { Restaurant } from './restaurant';

export interface Category {
  id: number;
  restaurant_id: number;
  image_id: number;
  name: string;
  description: string;
  keywords: string;
  url: string;
  is_pizza: boolean;
  has_ingredient: boolean;
  has_additional: boolean;
  activated: boolean;
  has_complement: boolean;
  available_products_amount: number;
  image: Image;
  restaurant: Restaurant;
  products: Product[];
}
