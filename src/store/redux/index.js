import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './modules/reducers';
import { cartMiddlware } from 'src/store/redux/modules/cart/middleware';
import { initialize as reactotronInitialize } from 'src/config/ReactotronInitialize';

function middlewares() {
  if (process.env.NODE_ENV === 'development' && process.browser) {
    const reactotron = reactotronInitialize();
    return compose(applyMiddleware(cartMiddlware), reactotron.createEnhancer());
  } else return applyMiddleware(cartMiddlware);
}

const store = createStore(reducers, middlewares());

export { store };
