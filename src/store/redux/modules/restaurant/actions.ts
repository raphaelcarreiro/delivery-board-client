import { Restaurant, RestaurantConfig } from 'src/types/restaurant';
import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_CONFIG, SET_RESTAURANT_IS_OPEN } from './types';

export function setRestaurant(restaurant: Restaurant): RestaurantActionTypes {
  return {
    type: SET_RESTAURANT,
    restaurant,
  };
}

export function setRestaurantIsOpen(state: boolean): RestaurantActionTypes {
  return {
    type: SET_RESTAURANT_IS_OPEN,
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
