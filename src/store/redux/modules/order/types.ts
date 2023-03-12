import { CartProduct } from 'src/types/cart';
import { Coupon } from 'src/types/coupon';
import { Customer } from 'src/types/customer';
import { PaymentMethod } from 'src/types/paymentMethod';
import { ShipmentMethods } from 'src/types/shipment';

interface SetOrderCustomerAction {
  type: '@order/SET_CUSTOMER';
  customer: Customer;
}

interface SetOrderShipmentMethodAction {
  type: '@order/SET_SHIPMENT_METHOD';
  shipmentMethod: ShipmentMethods;
}

interface SetOrderPaymentMethodAction {
  type: '@order/SET_PAYMENT_METHOD';
  paymentMethod: PaymentMethod;
}

interface SetOrderProductsAction {
  type: '@order/SET_PRODUCTS';
  products: CartProduct[];
}

interface SetOrderInitialStateAction {
  type: '@order/SET_INITIAL_STATE';
}

interface SetOrderCouponAction {
  type: '@order/SET_COUPON';
  coupon: Coupon;
}

interface SetOrderTaxAction {
  type: '@order/SET_TAX';
  tax: number;
}

interface SetOrderDiscountAction {
  type: '@order/SET_DISCOUNT';
  discount: number;
}

export type OrderActions =
  | SetOrderCustomerAction
  | SetOrderShipmentMethodAction
  | SetOrderPaymentMethodAction
  | SetOrderProductsAction
  | SetOrderInitialStateAction
  | SetOrderCouponAction
  | SetOrderTaxAction
  | SetOrderDiscountAction;
