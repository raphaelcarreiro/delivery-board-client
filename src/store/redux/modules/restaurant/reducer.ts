import { Restaurant } from 'src/types/restaurant';
import { RestaurantActionTypes, SET_RESTAURANT, SET_RESTAURANT_CONFIG } from './types';

export const INITIAL_STATE: Restaurant | null = null;

export default function restaurant(state = INITIAL_STATE, action: RestaurantActionTypes): Restaurant | null {
  switch (action.type) {
    case SET_RESTAURANT: {
      return action.restaurant;
    }

    case '@restaurant/SET_KITCHEN_STATE': {
      if (state)
        return {
          ...state,
          is_kitchen_open: action.state,
        };
      else return null;
    }

    case SET_RESTAURANT_CONFIG: {
      if (!state) return state;

      return {
        ...state,
        configs: {
          ...state.configs,
          [action.index]: action.value,
        },
      };
    }

    default: {
      return state;
    }
  }
}
