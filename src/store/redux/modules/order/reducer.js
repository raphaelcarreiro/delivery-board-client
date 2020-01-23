const INITIAL_STATE = {
  shipmentAddress: {},
  customer: null,
  paymentMethod: null,
  products: [],
  step: 'shipment',
  shipment_method: 'd',
  change: 0,
  paymentType: 'delivery',
  creditCard: {
    card_number: '',
    card_holder_name: '',
    card_id: '',
    card_expiration_date: '',
    card_cvv: '',
    card_owner_cpf: '',
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

    default: {
      return state;
    }
  }
}
