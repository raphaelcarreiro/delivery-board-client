import { Dispatch, MiddlewareAPI } from 'redux';
import { RootState } from 'src/store/redux/selector';
import {
  updateTotal,
  setDiscount,
  promotionAddToCart,
  promotionRemoveFromCart,
  inactivePromotionRemoveFromCart,
} from '../actions';
import { CartActions } from '../types';

import { checkCategories } from './checkPromotionCategories';
import { checkProducts } from './checkPromotionProducts';
import { checkValue } from './checkPromotionValue';

export default function checkPromotion(store: MiddlewareAPI<Dispatch<CartActions>, RootState>) {
  const promotions = store.getState().promotions;
  const cart = store.getState().cart;
  const order = store.getState().order;

  if (promotions) {
    store.dispatch(inactivePromotionRemoveFromCart(promotions));
    store.dispatch(setDiscount('value', 0));

    promotions.forEach(promotion => {
      store.dispatch(promotionRemoveFromCart(promotion.id));
      let checked = false;
      if (promotion.categories.length > 0) {
        // promoção com regras de categorias
        checked = checkCategories(cart, promotion);
      } else if (promotion.products.length > 0) {
        // promoção com regras de produtos
        checked = checkProducts(cart, promotion);
      } else if (promotion.order_value) {
        // promoção com regra de valor de pedido
        checked = checkValue(cart, promotion);
      }

      // se carrinho setisfez condições de alguma promoção ativa.
      if (checked)
        // verifica o tipo de promoção
        switch (promotion.type) {
          case 'safe': {
            const { safe } = promotion;
            store.dispatch(setDiscount(safe.discount_type, safe.discount));
            break;
          }
          case 'get': {
            store.dispatch(promotionRemoveFromCart(promotion.id));
            promotion.offered_products.forEach(product => {
              store.dispatch(promotionAddToCart(product as any, product.amount, promotion));
            });
            break;
          }
        }
      store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
    });
  }
}
