import { useSelector } from 'src/store/redux/selector';
import { Address } from 'src/types/address';

export function useRestaurantAddress(): Address {
  const order = useSelector(state => state.order);

  return order.restaurant_address;
}
