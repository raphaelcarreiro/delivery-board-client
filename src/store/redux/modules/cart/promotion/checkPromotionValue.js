export function checkValue(cart, promotion) {
  const { order_value: orderValue } = promotion.order_value;
  const response = cart.subtotal >= orderValue;

  return response;
}
