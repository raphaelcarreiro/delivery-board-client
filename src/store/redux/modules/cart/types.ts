import { Cart, CartProduct, CartRestaurantConfigs } from 'src/types/cart';
import { Coupon } from 'src/types/coupon';
import { Promotion } from 'src/types/promotion';
import { ShipmentMethods } from 'src/types/shipment';

interface SetCartAction {
  type: '@cart/SET_CART';
  cart: Cart;
}

interface AddToCartAction {
  type: '@cart/ADD_PRODUCT';
  product: CartProduct;
  amount: number;
}

interface AddPromotionProductToCartAction {
  type: '@cart/ADD_PROMOTION_PRODUCT';
  promotion: Promotion;
  product: CartProduct;
  amount: number;
}

interface RemoveCartProductAction {
  type: '@cart/REMOVE_PRODUCT';
  productUid: string;
}

interface RemovePromotionFromCartAction {
  type: '@cart/PROMOTION_REMOVE_PRODUCT';
  promotionId: number;
}

interface RemoveFromCartInactivePromotionsAction {
  type: '@cart/INACTIVE_PROMOTION_REMOVE_PRODUCT';
  promotions: Promotion[];
}

interface UpdateCartProductAction {
  type: '@cart/UPDATE_PRODUCT';
  product: CartProduct;
  amount: number;
}

interface CreateCartHistoryAction {
  type: '@cart/CREATE_HISTORY';
  products: CartProduct[];
}

interface RestoreCartAction {
  type: '@cart/RESTORE_CART';
}

interface ClearCartAction {
  type: '@cart/CLEAR_CART';
}

interface SetCartSettingsActions {
  type: '@cart/SET_SETTINGS';
  settings: CartRestaurantConfigs;
}

interface SetCouponToCartAction {
  type: '@cart/SET_COUPON';
  coupon: Coupon;
}

interface RemoveCouponFromCartAction {
  type: '@cart/REMOVE_COUPON';
}

interface UpdateCartTotalAction {
  type: '@cart/UPDATE_TOTAL';
  shipmentMethod: ShipmentMethods;
}

interface SetCartTaxAction {
  type: '@cart/SET_TAX';
  tax: number;
}

interface SetCartDiscount {
  type: '@cart/SET_DISCOUNT';
  discount: number;
  discountType: any;
}

export type CartActions =
  | SetCartDiscount
  | SetCartTaxAction
  | UpdateCartTotalAction
  | RemoveCouponFromCartAction
  | SetCouponToCartAction
  | SetCartSettingsActions
  | ClearCartAction
  | RestoreCartAction
  | CreateCartHistoryAction
  | UpdateCartProductAction
  | SetCartAction
  | RemovePromotionFromCartAction
  | RemoveFromCartInactivePromotionsAction
  | AddToCartAction
  | AddPromotionProductToCartAction
  | RemoveCartProductAction;
