import { moneyFormat } from 'src/helpers/numberFormat';
import { Cart } from 'src/types/cart';
import { addProduct, getComplementsPrice } from './cases/addProduct';
import { updateTotal } from './cases/updateTotal';
import { CartActions } from './types';

export const INITIAL_STATE: Cart = {
  products: [],
  product: null,
  total: 0,
  history: [],
  configs: null,
  coupon: null,
  discount: 0,
  subtotal: 0,
  tax: 0,
  productsAmount: 0,
  promotionDiscount: 0,
  formattedDiscount: '',
  formattedSubtotal: '',
  formattedTax: '',
  formattedTotal: '',
};

export default function cart(state = INITIAL_STATE, action: CartActions): Cart {
  switch (action.type) {
    case '@cart/SET_CART': {
      return action.cart;
    }

    case '@cart/ADD_PRODUCT': {
      const product = addProduct(state, action.product, action.amount);

      return {
        ...state,
        products: [...state.products, product],
      };
    }

    case '@cart/ADD_PROMOTION_PRODUCT': {
      const product = addProduct(state, action.product, action.amount, action.promotion);

      return {
        ...state,
        products: [...state.products, product],
      };
    }

    case '@cart/REMOVE_PRODUCT': {
      const products = state.products.filter(product => product.uid !== action.productUid);

      return {
        ...state,
        products,
      };
    }

    case '@cart/PROMOTION_REMOVE_PRODUCT': {
      const products = state.products.filter(product => {
        if (!product.promotion) return true;
        else return product.promotion.id !== action.promotionId;
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/INACTIVE_PROMOTION_REMOVE_PRODUCT': {
      const products = state.products.filter(product => {
        if (!product.promotion) {
          return true;
        }

        return action.promotions.some(promotion => promotion.id === product.promotion?.id);
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/UPDATE_PRODUCT': {
      const products = state.products.map(product => {
        if (product.uid !== action.product.uid) {
          return product;
        }

        const additionalPrice = action.product.additional
          .filter(item => item.selected)
          .reduce((value, additional) => value + additional.price * additional.amount, 0);

        const complementsPrice = getComplementsPrice(action.product, state?.configs);

        const price = action.product.product_price + additionalPrice + complementsPrice;

        const finalPrice = price * action.amount;

        return {
          ...action.product,
          amount: action.amount,
          price,
          final_price: finalPrice,
          formattedPrice: moneyFormat(price),
          formattedFinalPrice: moneyFormat(finalPrice),
          additionalPrice,
        };
      });

      return {
        ...state,
        products,
      };
    }

    case '@cart/RESTORE_CART': {
      return {
        ...state,
        products: state.history,
      };
    }

    case '@cart/CREATE_HISTORY': {
      return {
        ...state,
        history: action.products,
      };
    }

    case '@cart/CLEAR_CART': {
      return {
        ...INITIAL_STATE,
        configs: state.configs ? state.configs : null,
      };
    }

    case '@cart/SET_SETTINGS': {
      return {
        ...state,
        configs: action.settings,
      };
    }

    case '@cart/SET_COUPON': {
      return {
        ...state,
        coupon: action.coupon,
      };
    }

    case '@cart/REMOVE_COUPON': {
      return {
        ...state,
        coupon: null,
      };
    }

    case '@cart/SET_TAX': {
      return {
        ...state,
        tax: action.tax,
        formattedTax: moneyFormat(action.tax),
      };
    }

    case '@cart/SET_DISCOUNT': {
      if (action.discount === 0) {
        return {
          ...state,
          promotionDiscount: 0,
        };
      }

      const subtotal = state.products.reduce((sum, value) => sum + value.final_price, 0);

      let promotionDiscount = action.discountType === 'percent' ? subtotal * (action.discount / 100) : action.discount;

      if (state.configs?.cart_accumulate_discount) {
        promotionDiscount = state.promotionDiscount + promotionDiscount;
      } else {
        promotionDiscount = state.promotionDiscount > promotionDiscount ? state.promotionDiscount : promotionDiscount;
      }

      return {
        ...state,
        promotionDiscount,
      };
    }

    case '@cart/UPDATE_TOTAL': {
      return updateTotal(state, action.shipmentMethod);
    }

    default: {
      return state;
    }
  }
}
