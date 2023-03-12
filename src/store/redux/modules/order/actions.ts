import { Address } from 'src/types/address';
import { CartProduct } from 'src/types/cart';
import { Coupon } from 'src/types/coupon';
import { Customer } from 'src/types/customer';
import { PaymentMethod } from 'src/types/paymentMethod';
import { ShipmentMethods } from 'src/types/shipment';
import { OrderActions } from './types';

export function setCustomer(customer: Customer): OrderActions {
  return {
    type: '@order/SET_CUSTOMER',
    customer,
  };
}

export function setShipmentMethod(shipmentMethod: ShipmentMethods): OrderActions {
  return {
    type: '@order/SET_SHIPMENT_METHOD',
    shipmentMethod,
  };
}

export function setPaymentMethod(paymentMethod: PaymentMethod): OrderActions {
  return {
    type: '@order/SET_PAYMENT_METHOD',
    paymentMethod,
  };
}

export function setProducts(products: CartProduct[]): OrderActions {
  return {
    type: '@order/SET_PRODUCTS',
    products,
  };
}

export function setInitialState(): OrderActions {
  return {
    type: '@order/SET_INITIAL_STATE',
  };
}

export function setCoupon(coupon: Coupon): OrderActions {
  return {
    type: '@order/SET_COUPON',
    coupon,
  };
}

export function setTax(tax: number): OrderActions {
  return {
    type: '@order/SET_TAX',
    tax,
  };
}

export function setDiscount(discount: number): OrderActions {
  return {
    type: '@order/SET_DISCOUNT',
    discount,
  };
}
