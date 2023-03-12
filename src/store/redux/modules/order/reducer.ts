import { Order } from 'src/types/order';
import { v4 } from 'uuid';
import packageInfo from '../../../../../package.json';
import { OrderActions } from './types';

const INITIAL_STATE: Order = {
  id: v4(),
  shipment: {
    shipment_method: 'board',
  },
  customer: null,
  paymentMethod: null,
  products: [],
  change: 0,
  coupon: null,
  tax: 0,
  discount: 0,
  origin: {
    version: packageInfo.version,
    app_name: packageInfo.name,
    platform: 'web-app',
  },
  creditCard: null,
  formattedChange: '',
  formattedId: '',
  formattedTax: '',
};

export default function order(state = INITIAL_STATE, action: OrderActions): Order {
  switch (action.type) {
    case '@order/SET_CUSTOMER': {
      return {
        ...state,
        customer: action.customer,
      };
    }

    case '@order/SET_SHIPMENT_METHOD': {
      return {
        ...state,
        shipment: {
          shipment_method: 'board',
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

    case '@order/SET_INITIAL_STATE': {
      return INITIAL_STATE;
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

    default: {
      return state;
    }
  }
}
