import { Image } from './image';

export interface RestaurantConfig {
  id: number;
  restaurant_id: number;
  pizza_calculate: 'higher_value' | 'average_value';
  require_login: boolean;
  customer_collect: boolean;
  tax_mode: 'district' | 'distance' | 'no_tax' | 'order_value';
  tax_value: number;
  formattedTax: string;
  delivery_time: number;
  order_minimum_value: number;
  formattedOrderMinimumValue: string;
  order_auto_approve: boolean;
  use_postalcode: boolean;
  shipment_schedule: boolean;
  use_deliverer: boolean;
  preserve_cart: boolean;
  google_analytics_id: string;
  facebook_pixel_id: string;
  google_login: boolean;
}

interface RestaurantAddress {
  id: number;
  address: string;
  number: string;
  district: string;
  postal_code: string;
  city: string;
  is_main: boolean;
}

interface RestaurantPhones {
  id: number;
  phone: string;
}

export interface Restaurant {
  id: number;
  is_open: boolean;
  name: string;
  description: string;
  logo?: string;
  favicon?: string;
  keywords?: string;
  title?: string;
  url: string;
  cnpj: string;
  corporate_name: string;
  email: string;
  primary_color: string;
  secondary_color: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  image_id: number;
  cover_id: number;
  working_hours: string;
  minimum_order: number;
  image: Image;
  cover: Image;
  configs: RestaurantConfig;
  delivery_max_distance: number;
  addresses: RestaurantAddress[];
  phones: RestaurantPhones[];
}
