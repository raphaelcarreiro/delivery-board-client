export const promotionMiddleware = store => next => action => {
  next(action);

  const actionsToCheckPromotion = [
    '@cart/ADD_PRODUCT',
    '@cart/REMOVE_PRODUCT',
    '@cart/UPDATE_PRODUCT',
    '@cart/RESTORE_CART',
    '@cart/SET_COUPON',
    '@cart/REMOVE_COUPON',
    '@cart/SET_CART',
  ];

  if (actionsToCheckPromotion.includes(action.type)) {
    // const promotions = store.getState().promotion;
    // const cart = store.getState().cart;
  }
};
