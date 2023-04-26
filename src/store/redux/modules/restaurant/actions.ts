import { Restaurant, RestaurantConfig } from 'src/types/restaurant';
import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_CONFIG } from './types';

export function setRestaurant(restaurant: Restaurant): RestaurantActionTypes {
  return {
    type: SET_RESTAURANT,
    restaurant,
  };
}

export function setKitchenState(state: boolean): RestaurantActionTypes {
  return {
    type: '@restaurant/SET_KITCHEN_STATE',
    state,
  };
}

export function setRestaurantConfig(index: keyof RestaurantConfig, value: any): RestaurantActionTypes {
  return {
    type: SET_RESTAURANT_CONFIG,
    index,
    value,
  };
}
