import { useMemo } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { Position } from 'src/types/position';

export function useRestaurantAddressPosition(): Position {
  const order = useSelector(state => state.order);

  const restaurantAddressCoordinate = useMemo(() => {
    return {
      lat: order.restaurant_address.latitude as number,
      lng: order.restaurant_address.longitude as number,
    };
  }, [order.restaurant_address]);

  return restaurantAddressCoordinate;
}
