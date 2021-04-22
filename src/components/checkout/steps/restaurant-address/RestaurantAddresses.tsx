import React, { useMemo } from 'react';
import { useSelector } from 'src/store/redux/selector';
import RestaurantAddressList from './RestaurantAddressList';

const RestaurantAddresses: React.FC = () => {
  const restaurant = useSelector(state => state.restaurant);
  const addresses = useMemo(() => restaurant?.addresses, [restaurant]);

  return (
    <div>
      <RestaurantAddressList addresses={addresses} />
    </div>
  );
};

export default RestaurantAddresses;
