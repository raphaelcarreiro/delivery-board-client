import { RestaurantState } from './reducer';

export const SET_RESTAURANT = '@restaurant/SET_RESTAURANT';
export const SET_RESTAURANT_IS_OPEN = '@restaurant/SET_RESTAURANT_IS_OPEN';

interface SetRestaurant {
  type: typeof SET_RESTAURANT;
  restaurant: RestaurantState;
}

interface SetRestaurantIsOpen {
  type: typeof SET_RESTAURANT_IS_OPEN;
  state: boolean;
}

export type RestaurantActionTypes = SetRestaurant | SetRestaurantIsOpen;
