import { Cart } from 'src/types/cart';
import { Promotion } from 'src/types/promotion';

export function checkValue(cart: Cart, promotion: Promotion) {
  if (!promotion.order_value) {
    return false;
  }

  const response = cart.subtotal >= promotion.order_value.order_value;

  return response;
}
