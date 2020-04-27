import { combineReducers } from 'redux';
import cart from './cart/reducer';
import restaurant from './restaurant/reducer';
import user from './user/reducer';
import order from './order/reducer';
import promotion from './promotion/reducer';

const reducers = combineReducers({ cart, user, restaurant, order, promotion });

export default reducers;
