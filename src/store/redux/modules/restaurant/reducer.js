import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = null;

export default function restaurant(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@restaurant/SET_RESTAURANT': {
      return {
        ...action.restaurant,
        formattedMinimumOrder: moneyFormat(action.restaurant.minimum_order),
      };
    }

    case '@restaurant/SET_RESTAURANT_IS_OPEN': {
      return state.id === action.state.restaurantId
        ? {
            ...state,
            is_open: action.state.state,
          }
        : state;
    }

    default: {
      return state;
    }
  }
}
