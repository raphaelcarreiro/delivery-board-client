import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { name, version } from '../../../../../package.json';

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
    token: '',
    brand: '',
  },
  coupon: null,
  tax: 0,
  discount: 0,
  origin: {
    version,
    app_name: name,
    platform: 'web-app',
  },
  restaurant_address: null,
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
        change: action.paymentMethod && action.paymentMethod.kind === 'money' ? state.change : 0,
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

    case '@order/SET_CARD': {
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          ...action.card,
        },
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
          token: '',
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

    case '@order/SET_DISCOUNT': {
      return {
        ...state,
        discount: action.discount,
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

    case '@order/SET_MERCADO_PAGO_CARD_TOKEN': {
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          token: action.token,
        },
      };
    }

    case '@order/SET_RESTAURANT_ADDRESS': {
      return {
        ...state,
        restaurant_address: action.address,
      };
    }

    default: {
      return state;
    }
  }
}
