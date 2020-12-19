import { Restaurant } from 'src/types/restaurant';
import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_IS_OPEN } from './types';

export const INITIAL_STATE: Restaurant | null = null;

export default function restaurant(state = INITIAL_STATE, action: RestaurantActionTypes): Restaurant | null {
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
