import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_IS_OPEN } from './types';
import { RestaurantState } from './reducer';

export function setRestaurant(restaurant: RestaurantState): RestaurantActionTypes {
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
