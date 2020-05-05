export function setCart(cart) {
  return {
    type: '@cart/SET_CART',
    cart,
  };
}

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

export function promotionAddToCart(promotion) {
  return {
    type: '@cart/PROMOTION_ADD_PRODUCT',
    promotion,
  };
}

export function removeFromCart(productUid) {
  return {
    type: '@cart/REMOVE_PRODUCT',
    productUid,
  };
}

export function promotionRemoveFromCart(promotionId) {
  return {
    type: '@cart/PROMOTION_REMOVE_PRODUCT',
    promotionId,
  };
}

export function inactivePromotionRemoveFromCart(promotions) {
  return {
    type: '@cart/INACTIVE_PROMOTION_REMOVE_PRODUCT',
    promotions,
  };
}

export function updateProductFromCart(product, amount) {
  return {
    type: '@cart/UPDATE_PRODUCT',
    product,
    amount,
  };
}

export function createHistory(products) {
  return {
    type: '@cart/CREATE_HISTORY',
    products,
  };
}

export function restoreCart() {
  return {
    type: '@cart/RESTORE_CART',
  };
}

export function clearCart() {
  return {
    type: '@cart/CLEAR_CART',
  };
}

export function setConfigs(configs) {
  return {
    type: '@cart/SET_CONFIGS',
    configs,
  };
}

export function setCoupon(coupon) {
  return {
    type: '@cart/SET_COUPON',
    coupon,
  };
}

export function removeCoupon() {
  return {
    type: '@cart/REMOVE_COUPON',
  };
}

export function updateTotal(shipmentMethod) {
  return {
    type: '@cart/UPDATE_TOTAL',
    shipmentMethod,
  };
}

export function setTax(tax) {
  return {
    type: '@cart/SET_TAX',
    tax,
  };
}

export function setDiscount(discountType, discount) {
  return {
    type: '@cart/SET_DISCOUNT',
    discount,
    discountType,
  };
}
