export function prepareProduct(product, amount) {
  return {
    type: '@cart/PREPARE_PRODUCT',
    product,
    amount,
  };
}

export function addToCart() {
  return {
    type: '@cart/ADD_PRODUCT',
  };
}

export function removeFromCart(productUid) {
  return {
    type: '@cart/REMOVE_PRODUCT',
    productUid,
  };
}

export function updateProductFromCart(product, amount) {
  return {
    type: '@cart/UPDATE_PRODUCT',
    product,
    amount,
  };
}
