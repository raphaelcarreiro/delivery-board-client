import { moneyFormat } from 'src/helpers/numberFormat';
import { ShipmentMethods } from 'src/types/shipment';
import { Cart } from 'src/types/cart';

export function updateTotal(cart: Cart, shipmentMethod: ShipmentMethods): Cart {
  const tax = getTax(cart, shipmentMethod);

  const discount = getDiscount(cart);

  const subtotal = cart.products.reduce((sum, value) => sum + value.final_price, 0);

  const total = subtotal - discount + tax;

  return {
    ...cart,
    tax,
    subtotal,
    total,
    discount,
    formattedSubtotal: moneyFormat(subtotal),
    formattedDiscount: moneyFormat(discount),
    formattedTax: moneyFormat(tax),
    formattedTotal: moneyFormat(total),
  };
}

function getCouponDiscount(cart: Cart) {
  const subtotal = cart.products.reduce((sum, value) => sum + value.final_price, 0);

  if (!cart.coupon) {
    return 0;
  }

  return cart?.coupon.discount_type === 'percent' ? subtotal * (cart?.coupon.discount / 100) : cart?.coupon.discount;
}

function getDiscount(cart: Cart) {
  const couponDiscount = getCouponDiscount(cart);

  const promotionDiscount = cart.promotionDiscount ?? 0;

  if (cart.configs?.cart_accumulate_discount) {
    return promotionDiscount + couponDiscount;
  }

  return couponDiscount > promotionDiscount ? couponDiscount : promotionDiscount;
}

function getTax(cart: Cart, shipmentMethod: ShipmentMethods): number {
  if (shipmentMethod !== 'delivery') {
    return 0;
  }

  const someProductNoTax = cart.products.some(product => product.no_tax);

  if (someProductNoTax) {
    return 0;
  }

  const { configs, subtotal } = cart;

  const quantity = cart.products.reduce((carry, product) => carry + product.amount, 0);

  if (configs?.tax_mode === 'order_value') {
    return configs.tax_value > 0 && subtotal < configs.order_minimum_value ? configs.tax_value : 0;
  }

  if (configs?.tax_mode === 'products_amount') {
    return quantity <= configs?.order_minimum_products_amount ? configs.tax_value : 0;
  }

  return cart.tax;
}
