import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_IS_OPEN } from './types';

export interface RestaurantState {
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
  play_store_link: string;
  configs: {
    id: number;
    restaurant_id: number;
    pizza_calculate: string;
    require_login: boolean;
    customer_collect: boolean;
    tax_mode: string;
    tax_value: number;
    formattedTax: string;
    delivery_time: number;
    order_minimum_value: number;
    formattedMinimumOrder: string;
    order_auto_approve: boolean;
    use_postalcode: boolean;
    shipment_schedule: boolean;
    use_deliverer: boolean;
    preserv_cart: boolean;
    google_analytics_id: string;
    facebook_pixel_id: string;
    google_login: boolean;
  };
}

export const INITIAL_STATE: RestaurantState | null = null;

export default function restaurant(state = INITIAL_STATE, action: RestaurantActionTypes): RestaurantState | null {
  switch (action.type) {
    case SET_RESTAURANT: {
      return action.restaurant;
    }

    case SET_RESTAURANT_IS_OPEN: {
      if (state)
        return {
          ...state,
          is_open: action.state,
        };
      else return null;
    }

    default: {
      return state;
    }
  }
}
