import { combineReducers } from 'redux';
import cart from './cart/reducer';
import restaurant from './restaurant/reducer';
import user from './user/reducer';

const reducers = combineReducers({ cart, user, restaurant });

export default reducers;
