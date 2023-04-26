import { Restaurant, RestaurantConfig } from 'src/types/restaurant';

export const SET_RESTAURANT = '@restaurant/SET_RESTAURANT';
export const SET_KITCHEN_STATE = '@restaurant/SET_KITCHEN_STATE';
export const SET_RESTAURANT_CONFIG = '@restaurant/SET_RESTAURANT_CONFIG';

interface SetRestaurant {
  type: typeof SET_RESTAURANT;
  restaurant: Restaurant;
}

interface SetKitchenStateAction {
  type: typeof SET_KITCHEN_STATE;
  state: boolean;
}

interface SetRestaurantConfig {
  type: typeof SET_RESTAURANT_CONFIG;
  index: keyof RestaurantConfig;
  value: any;
}

export type RestaurantActionTypes = SetRestaurant | SetKitchenStateAction | SetRestaurantConfig;
