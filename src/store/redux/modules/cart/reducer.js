export const INITIAL_STATE = {
  products: [],
  product: null,
  total: 0,
};

export default function cart(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@cart/PREPARE_PRODUCT': {
      return {
        ...state,
        product: {
          amount: action.amount,
          ...action.product,
        },
      };
    }

    case '@cart/ADD_PRODUCT': {
      return {
        ...state,
        products: [...state.products, state.product],
      };
    }
    default: {
      return state;
    }
  }
}
