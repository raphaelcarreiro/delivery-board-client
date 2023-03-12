import { Middleware } from 'redux';
import { RootState } from '../../selector';
import { createHistory, setConfigs, updateTotal } from './actions';

import checkPromotion from './promotion/checkPromotion';

export const middleware: Middleware<any, RootState> = store => next => action => {
  const actionsToSaveCart = [
    '@cart/ADD_PRODUCT',
    '@cart/REMOVE_PRODUCT',
    '@cart/UPDATE_PRODUCT',
    '@cart/RESTORE_CART',
    '@cart/SET_COUPON',
    '@cart/REMOVE_COUPON',
    '@cart/SET_CART',
    '@order/SET_SHIPMENT_METHOD',
    '@order/SET_SHIPMENT_ADDRESS',
    '@promotion/SET_PROMOTIONS',
  ];

  // actions para salvar configurações do restaurante no carrinho
  const actionsToSetConfigs = ['@restaurant/SET_RESTAURANT'];

  // cria histórico para recuperar item excluído do carrinho
  if (action.type === '@cart/REMOVE_PRODUCT') {
    const cart = store.getState().cart;
    store.dispatch(createHistory(cart.products));
  }

  next(action);

  // atualiza as configurações do restaurante no carrinho para calculos
  if (actionsToSetConfigs.includes(action.type)) {
    const configs = store.getState().restaurant?.configs;

    if (!configs) {
      return;
    }

    store.dispatch(
      setConfigs({
        pizza_calculate: configs.pizza_calculate,
        tax_mode: configs.tax_mode,
        tax_value: configs.tax_value,
        order_minimum_value: configs.order_minimum_value,
        order_minimum_products_amount: configs.order_minimum_products_amount,
        cart_accumulate_discount: configs.cart_accumulate_discount,
      })
    );
  }

  // atualiza total do carrinho de acordo com a action emitida
  if (actionsToSaveCart.includes(action.type)) {
    const order = store.getState().order;
    store.dispatch(updateTotal(order.shipment.shipment_method));
  }

  /*
   * verifica se há promoções e aplica ao carrinho depois da atualização do total.
   * total é atualizado novamente
   */
  if (actionsToSaveCart.includes(action.type)) {
    checkPromotion(store);
  }
};
