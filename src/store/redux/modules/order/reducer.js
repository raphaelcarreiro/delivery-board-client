import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const INITIAL_STATE = {
  shipment: {},
  customer: null,
  paymentMethod: null,
  products: [],
  change: 0,
  creditCard: {
    number: '',
    name: '',
    card_id: '',
    expiration_date: '',
    cvv: '',
    cpf: '',
  },
  coupon: null,
  tax: 0,
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
        shipment: {
          // ...state.shipment,
          ...action.address,
          shipment_method: 'delivery',
        },
      };
    }

    case '@order/SET_SHIPMENT_METHOD': {
      return {
        ...state,
        shipment: {
          ...state.shipment,
          shipment_method: action.shipmentMethod,
        },
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

    case '@order/SET_INITIAL_STATE': {
      return INITIAL_STATE;
    }

    case '@order/CLEAR_CARD': {
      return {
        ...state,
        creditCard: {
          number: '',
          name: '',
          card_id: '',
          expiration_date: '',
          cvv: '',
          cpf: '',
        },
      };
    }

    case '@order/SET_COUPON': {
      return {
        ...state,
        coupon: action.coupon,
      };
    }

    case '@order/SET_TAX': {
      return {
        ...state,
        tax: action.tax,
      };
    }

    case '@order/SET_SCHEDULE': {
      return {
        ...state,
        shipment: {
          ...state.shipment,
          scheduled_at: action.date,
          formattedScheduledAt: action.date ? format(action.date, 'HH:mm', { locale: ptBR }) : null,
        },
      };
    }

    default: {
      return state;
    }
  }
}
