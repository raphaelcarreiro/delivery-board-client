import { createHistory, setConfigs, updateTotal } from './actions';

const saveCartAtLocalStorage = cart => {
  localStorage.setItem(process.env.LOCALSTORAGE_CART, JSON.stringify(cart));
};

export const cartMiddlware = store => next => action => {
  // actions para atualizar total e salvar carrinho em local storage
  const actionsToSaveCart = [
    '@cart/ADD_PRODUCT',
    '@cart/REMOVE_PRODUCT',
    '@cart/UPDATE_PRODUCT',
    '@cart/RESTORE_CART',
    '@cart/SET_COUPON',
    '@cart/REMOVE_COUPON',
    '@cart/SET_CART',
    '@order/SET_SHIPMENT_METHOD',
  ];

  // actions para salvar configurações do restaurante no carrinho
  const actionsToSetConfigs = ['@restaurant/SET_RESTAURANT', '@cart/SET_CART'];

  // cria histórico para recuperar item excluído do carrinho
  if (action.type === '@cart/REMOVE_PRODUCT') {
    const cart = store.getState().cart;
    store.dispatch(createHistory(cart.products));
  }

  next(action);

  // atualiza as configurações do restaurante no carrinho para calculos
  if (actionsToSetConfigs.includes(action.type)) {
    const { configs } = store.getState().restaurant;
    store.dispatch(
      setConfigs({
        pizza_calculate: configs.pizza_calculate,
        tax_mode: configs.tax_mode,
        tax_value: configs.tax_value,
        order_minimum_value: configs.order_minimum_value,
      })
    );
  }

  // atualiza total do carrinho de acordo com a action emitida
  if (actionsToSaveCart.includes(action.type)) {
    const cart = store.getState().cart;
    const order = store.getState().order;
    store.dispatch(updateTotal(order.shipment.shipment_method || 'delivery'));
    saveCartAtLocalStorage(cart);
  }

  // salva o carrinho em local storage
  if (actionsToSaveCart.includes(action.type)) {
    const cart = store.getState().cart;
    saveCartAtLocalStorage(cart);
  }
};
