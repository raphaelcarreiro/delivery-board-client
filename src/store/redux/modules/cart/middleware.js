import { createHistory } from './actions';

const saveCartAtLocalStorage = cart => {
  localStorage.setItem(process.env.LOCALSTORAGE_CART, JSON.stringify(cart));
};

export const cartMiddlware = store => next => action => {
  const actionsToSaveCart = ['@cart/ADD_PRODUCT', '@cart/REMOVE_PRODUCT', '@cart/UPDATE_PRODUCT', '@cart/RESTORE_CART'];

  if (action.type === '@cart/REMOVE_PRODUCT') {
    const cart = store.getState().cart;
    store.dispatch(createHistory(cart.products));
  }

  next(action);

  if (actionsToSaveCart.includes(action.type)) {
    const cart = store.getState().cart;
    saveCartAtLocalStorage(cart);
  }
};