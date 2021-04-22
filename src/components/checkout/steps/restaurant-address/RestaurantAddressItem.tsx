import { ListItem, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRestaurantAddress } from 'src/store/redux/modules/order/actions';
import { useSelector } from 'src/store/redux/selector';
import { RestaurantAddress } from 'src/types/restaurant';
import { useCheckout } from '../hooks/useCheckout';

const useStyles = makeStyles(theme => ({
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
  },
}));

interface RestaurantAddressItemProps {
  address: RestaurantAddress;
}

const RestaurantAddressItem: React.FC<RestaurantAddressItemProps> = ({ address }) => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const checkout = useCheckout();
  const dispatch = useDispatch();

  function handleClick(address: RestaurantAddress) {
    dispatch(setRestaurantAddress(address));
    checkout.handleStepNext();
  }

  return (
    <ListItem className={classes.listItem} key={address.id} button onClick={() => handleClick(address)}>
      <Typography gutterBottom>{restaurant?.name}</Typography>
      <Typography variant="h6">
        {address.address}, {address.number}
      </Typography>
      <Typography>{address.district}</Typography>
      <Typography>
        {address.city}, {address.region}
      </Typography>
      <Typography color="textSecondary">{address.postal_code}</Typography>
    </ListItem>
  );
};

export default RestaurantAddressItem;
