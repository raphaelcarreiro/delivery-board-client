const INITIAL_STATE = {
  shipmentAddress: {},
  customer: null,
  paymentMethod: null,
  products: [],
  shipment_method: 'delivery',
  change: 0,
  creditCard: {
    number: '',
    name: '',
    card_id: '',
    expiration_date: '',
    cvv: '',
    cpf: '',
  },
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
        // shipment_method: 'delivery',
        shipmentAddress: action.address,
      };
    }

    case '@order/SET_PAYMENT_METHOD': {
      return {
        ...state,
        paymentMethod: action.paymentMethod,
      };
    }

    case '@order/SET_PRODUCTS': {
      return {
        ...state,
        products: action.products,
      };
    }

    case '@order/SET_CHANGE': {
      return {
        ...state,
        change: action.value,
      };
    }

    case '@order/CHANGE_CREDITCARD': {
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          [action.index]: action.value,
        },
      };
    }

    case '@order/CHANGE': {
      return {
        ...state,
        [action.index]: action.value,
      };
    }

    case '@order/SET_CUSTOMER_COLLECT': {
      return {
        ...state,
        shipment_method: 'customer_collect',
        shipmentAddress: {},
      };
    }

    case '@order/SET_INITIAL_STATE': {
      return {
        ...INITIAL_STATE,
        products: state.products,
      };
    }

    default: {
      return state;
    }
  }
}
