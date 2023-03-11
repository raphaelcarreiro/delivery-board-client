import { configureStore } from '@reduxjs/toolkit';
import { middleware } from './modules/cart/middleware';
import { boardMovementMiddleware } from './modules/boardMovement/boardMovementMiddleware';
import reducers from './modules/reducers';

const store = configureStore({
  reducer: reducers,
  middleware: [middleware, boardMovementMiddleware],
});

export { store };
