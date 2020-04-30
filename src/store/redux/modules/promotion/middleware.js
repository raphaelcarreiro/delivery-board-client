import { setDiscount } from '../cart/actions';

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
    const promotions = store.getState().promotion;
    const cart = store.getState().cart;

    if (promotions) {
      promotions.forEach(promotion => {
        if (promotion.categories.length > 0) {
        } else if (promotion.products.length > 0) {
        } else if (promotion.order_value) {
          const { order_value: orderValue } = promotion.order_value;
          const { safe } = promotion;
          if (cart.total >= orderValue) {
            store.dispatch(setDiscount(safe.discount_type, safe.discount));
          } else {
            store.dispatch(setDiscount('value', 0));
          }
        }
      });
    }
  }
};
