import { configureStore } from '@reduxjs/toolkit';
import { cartMiddlware } from './modules/cart/middleware';
import reducers from './modules/reducers';

const store = configureStore({
  reducer: reducers,
  middleware: [cartMiddlware],
});

export { store };
