import { combineReducers } from 'redux';
import cart from './cart/reducer';
import restaurant from './restaurant/reducer';
import user from './user/reducer';
import order from './order/reducer';
import promotions from './promotion/reducer';
import boardMovement from './boardMovement/reducer';

const reducers = combineReducers({ cart, user, restaurant, order, promotions, boardMovement });

export default reducers;
