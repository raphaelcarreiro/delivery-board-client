import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api } from 'src/services/api';
import { setCustomerAddresses } from 'src/store/redux/modules/user/actions';
import { useSelector } from 'src/store/redux/selector';

export function useAddressDistances(): void {
  const dispatch = useDispatch();
  const order = useSelector(state => state.order);

  useEffect(() => {
    if (!order.restaurant_address) return;

    api
      .post('/addressDistances', { restaurantAddressId: order.restaurant_address.id })
      .then(response => {
        const customerAddresses = response.data;
        dispatch(setCustomerAddresses(customerAddresses));
      })
      .catch(err => console.error(err));
  }, [dispatch, order.restaurant_address]);
}
