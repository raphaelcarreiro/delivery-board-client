import { List } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'src/store/redux/selector';
import RestaurantAddressSelectorItem from './RestaurantAddressSelectorItem';

const RestaurantAddressSelectorList: React.FC = () => {
  const restaurant = useSelector(state => state.restaurant);

  return (
    <List disablePadding>
      {restaurant?.addresses.map(address => (
        <RestaurantAddressSelectorItem address={address} key={address.id} />
      ))}
    </List>
  );
};

export default RestaurantAddressSelectorList;
