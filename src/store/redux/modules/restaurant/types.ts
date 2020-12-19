import { Restaurant } from 'src/types/restaurant';

export const SET_RESTAURANT = '@restaurant/SET_RESTAURANT';
export const SET_RESTAURANT_IS_OPEN = '@restaurant/SET_RESTAURANT_IS_OPEN';

interface SetRestaurant {
  type: typeof SET_RESTAURANT;
  restaurant: Restaurant;
}

interface SetRestaurantIsOpen {
  type: typeof SET_RESTAURANT_IS_OPEN;
  state: boolean;
}

export type RestaurantActionTypes = SetRestaurant | SetRestaurantIsOpen;
