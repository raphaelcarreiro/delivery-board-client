import { Cart, CartProduct, CartRestaurantConfigs } from 'src/types/cart';
import { Coupon } from 'src/types/coupon';
import { Promotion } from 'src/types/promotion';
import { ShipmentMethods } from 'src/types/shipment';
import { CartActions } from './types';

export function setCart(cart: Cart): CartActions {
  return {
    type: '@cart/SET_CART',
    cart,
  };
}

export function addToCart(product: CartProduct, amount: number): CartActions {
  return {
    type: '@cart/ADD_PRODUCT',
    product,
    amount,
  };
}

export function promotionAddToCart(product: CartProduct, amount: number, promotion: Promotion): CartActions {
  return {
    type: '@cart/ADD_PROMOTION_PRODUCT',
    promotion,
    product,
    amount,
  };
}

export function removeFromCart(productUid: string): CartActions {
  return {
    type: '@cart/REMOVE_PRODUCT',
    productUid,
  };
}

export function promotionRemoveFromCart(promotionId: number): CartActions {
  return {
    type: '@cart/PROMOTION_REMOVE_PRODUCT',
    promotionId,
  };
}

export function inactivePromotionRemoveFromCart(promotions: Promotion[]): CartActions {
  return {
    type: '@cart/INACTIVE_PROMOTION_REMOVE_PRODUCT',
    promotions,
  };
}

export function updateProductFromCart(product: CartProduct, amount: number): CartActions {
  return {
    type: '@cart/UPDATE_PRODUCT',
    product,
    amount,
  };
}

export function createHistory(products: CartProduct[]): CartActions {
  return {
    type: '@cart/CREATE_HISTORY',
    products,
  };
}

export function restoreCart(): CartActions {
  return {
    type: '@cart/RESTORE_CART',
  };
}

export function clearCart(): CartActions {
  return {
    type: '@cart/CLEAR_CART',
  };
}

export function setConfigs(settings: CartRestaurantConfigs): CartActions {
  return {
    type: '@cart/SET_SETTINGS',
    settings,
  };
}

export function setCoupon(coupon: Coupon): CartActions {
  return {
    type: '@cart/SET_COUPON',
    coupon,
  };
}

export function removeCoupon(): CartActions {
  return {
    type: '@cart/REMOVE_COUPON',
  };
}

export function updateTotal(shipmentMethod: ShipmentMethods): CartActions {
  return {
    type: '@cart/UPDATE_TOTAL',
    shipmentMethod,
  };
}

export function setTax(tax: number): CartActions {
  return {
    type: '@cart/SET_TAX',
    tax,
  };
}

export function setDiscount(discountType: any, discount: number): CartActions {
  return {
    type: '@cart/SET_DISCOUNT',
    discount,
    discountType,
  };
}
