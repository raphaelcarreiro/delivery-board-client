import { createStore, applyMiddleware } from 'redux';
import reducers from './modules/reducers';
import { cartMiddlware } from 'src/store/redux/modules/cart/middleware';

const store = createStore(reducers, applyMiddleware(cartMiddlware));

export { store };
