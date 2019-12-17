const INITIAL_STATE = {
  shipmentAddress: null,
  customer: null,
  paymentMethod: null,
  products: [],
  step: 'shipment',
};

export default function order(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@order/SET_CUSTOMER': {
      return {
        ...state,
        customer: action.customer,
      };
    }

    case '@order/SET_SHIPMENT_ADDRESS': {
      return {
        ...state,
        customer: action.shipmentAddress,
      };
    }

    case '@order/SET_PAYMENT_METHOD': {
      return {
        ...state,
        customer: action.paymentMethod,
      };
    }

    case '@order/SET_PRODUCTS': {
      return {
        ...state,
        customer: action.products,
      };
    }

    default: {
      return state;
    }
  }
}
