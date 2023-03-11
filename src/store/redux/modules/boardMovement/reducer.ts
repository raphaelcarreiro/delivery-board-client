import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getOrderStatusText } from 'src/components/board/getOrderStatusText';
import { moneyFormat } from 'src/helpers/numberFormat';
import { BoardMovement } from 'src/types/boardMovement';
import { BoardMovementActions } from './types';

const INITIAL_STATE: BoardMovement | null = null;

export default function reducer(state = INITIAL_STATE, action: BoardMovementActions): BoardMovement | null {
  switch (action.type) {
    case '@boardMovement/SET_BOARD_MOVEMENT': {
      return {
        ...action.movement,
        formattedCreatedAt: format(parseISO(action.movement.created_at), 'PPp', { locale: ptBR }),
        products: [],
        payments: [],
      };
    }

    case '@boardMovement/SET_PRODUCTS': {
      if (!state) {
        return state;
      }

      return {
        ...state,
        products: action.products,
      };
    }

    case '@boardMovement/ADD_PRODUCTS': {
      if (!state) {
        return state;
      }

      return {
        ...state,
        products: [
          ...state.products,
          ...action.products.map(product => ({
            ...product,
            formattedStatus: getOrderStatusText('board', product.status),
            formattedTotal: moneyFormat(product.total),
          })),
        ],
      };
    }

    case '@boardMovement/REMOVE_PRODUCT': {
      if (!state) {
        return state;
      }

      return {
        ...state,
        products: state.products.filter(product => product.order_product_id !== action.orderProductId),
      };
    }

    case '@boardMovement/REMOVE_PAYMENT': {
      if (!state) {
        return state;
      }

      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.paymentId),
      };
    }

    case '@boardMovement/ADD_PAYMENT': {
      if (!state) {
        return state;
      }

      const exist = state.payments.find(payment => payment.id === action.payment.id);

      if (exist) {
        return state;
      }

      return {
        ...state,
        payments: [
          ...state.payments,
          {
            ...action.payment,
            formattedCreatedAt: format(parseISO(action.payment.created_at), 'PPp', { locale: ptBR }),
            formattedValue: moneyFormat(action.payment.value),
          },
        ],
      };
    }

    case '@boardMovement/SET_PAYMENTS': {
      if (!state) {
        return state;
      }

      return {
        ...state,
        payments: action.payments,
      };
    }

    case '@boardMovement/UPDATE_TOTAL': {
      if (!state) {
        return state;
      }

      const total = state.products.reduce((previous, product) => previous + product.total, 0);
      const totalPaid = state.payments.reduce((previous, payment) => previous + payment.value, 0);

      return {
        ...state,
        total,
        totalPaid,
        formattedTotalPaid: moneyFormat(totalPaid),
        formattedTotal: moneyFormat(total),
      };
    }

    default: {
      return state;
    }
  }
}
