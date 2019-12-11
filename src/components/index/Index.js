import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';

export default function Index() {
  const restaurant = useSelector(state => state.restaurant);

  return (
    <>
      <CustomAppbar title={restaurant ? restaurant.name : 'Carregando'} actionComponent={<IndexAppbarActions />} />
    </>
  );
}
