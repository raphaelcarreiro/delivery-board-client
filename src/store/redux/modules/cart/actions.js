export function prepareProduct(product, amount) {
  return {
    type: '@cart/PREPARE_PRODUCT',
    product,
    amount,
  };
}

export function addToCart() {
  return {
    type: '@cart/ADD_TO_CART',
  };
}

export function removeFromCart(productUid) {
  return {
    type: '@cart/REMOVE_FROM_CART',
    productUid,
  };
}
