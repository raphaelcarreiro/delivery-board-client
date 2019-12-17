import React, { useContext, useEffect } from 'react';
import { AppContext } from 'src/App';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomer, setPaymentMethod, setProducts, setShipmentAddress } from 'src/store/redux/modules/order/actions';
import Shipment from './steps/shipment/Shipment';

export default function Checkout() {
  const app = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order) || {};

  useEffect(() => {
    app.handleCartVisibility(false);
    const customer = user.customer;
    const address = customer && customer.addresses.filter(address => address.is_main);

    dispatch(setCustomer(user.customer));
    dispatch(setShipmentAddress(address));
    dispatch(setProducts(cart.products));
  }, []);

  console.log(user);

  return <>{order.step === 'shipment' && <Shipment addresses={user.customer.addresses} />}</>;
}
