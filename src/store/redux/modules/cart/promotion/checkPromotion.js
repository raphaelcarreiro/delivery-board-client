import {
  updateTotal,
  setDiscount,
  prepareProduct,
  promotionAddToCart,
  promotionRemoveFromCart,
  inactivePromotionRemoveFromCart,
} from '../actions';

import { checkCategories } from './checkPromotionCategories';
import { checkProducts } from './checkPromotionProducts';
import { checkValue } from './checkPromotionValue';

export default function checkPromotion(store) {
  const promotions = store.getState().promotion;
  const cart = store.getState().cart;
  const order = store.getState().order;

  if (promotions) {
    store.dispatch(inactivePromotionRemoveFromCart(promotions));
    promotions.forEach(promotion => {
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
              store.dispatch(prepareProduct(product, product.amount));
              store.dispatch(promotionAddToCart({ id: promotion.id, name: promotion.name }));
            });
            break;
          }
        }
      // remove do carrinho itens promocionais e desconto
      else
        promotion.type === 'safe'
          ? store.dispatch(setDiscount('value', 0))
          : store.dispatch(promotionRemoveFromCart(promotion.id));

      store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
    });
  } else {
    store.dispatch(setDiscount('value', 0));
    store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
  }
}
