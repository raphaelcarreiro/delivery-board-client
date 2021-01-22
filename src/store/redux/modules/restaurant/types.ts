import { Restaurant, RestaurantConfig } from 'src/types/restaurant';

export const SET_RESTAURANT = '@restaurant/SET_RESTAURANT';
export const SET_RESTAURANT_IS_OPEN = '@restaurant/SET_RESTAURANT_IS_OPEN';
export const SET_RESTAURANT_CONFIG = '@restaurant/SET_RESTAURANT_CONFIG';

interface SetRestaurant {
  type: typeof SET_RESTAURANT;
  restaurant: Restaurant;
}

interface SetRestaurantIsOpen {
  type: typeof SET_RESTAURANT_IS_OPEN;
  state: boolean;
}

interface SetRestaurantConfig {
  type: typeof SET_RESTAURANT_CONFIG;
  index: keyof RestaurantConfig;
  value: any;
}

export type RestaurantActionTypes = SetRestaurant | SetRestaurantIsOpen | SetRestaurantConfig;
