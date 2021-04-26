import { ListItem, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRestaurantAddress } from 'src/store/redux/modules/order/actions';
import { RestaurantAddress } from 'src/types/restaurant';
import { useRestaurantAddressSelector } from './hooks/useRestaurantAddressSelector';

const useStyles = makeStyles({
  listItem: {
    borderBottom: '1px solid #eee',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

interface RestaurantAddressSelectorItemProps {
  address: RestaurantAddress;
}

const RestaurantAddressSelectorItem: React.FC<RestaurantAddressSelectorItemProps> = ({ address }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setOpen } = useRestaurantAddressSelector();

  function handleClick(address: RestaurantAddress) {
    dispatch(setRestaurantAddress(address));
    setOpen(false);
  }

  return (
    <ListItem button disabled={!address.active} className={classes.listItem} onClick={() => handleClick(address)}>
      <Typography>
        {address.nickname}, {address.city} - {address.region}
      </Typography>

      <Typography color="textSecondary" variant="body2">
        {address.address}, {address.number}
      </Typography>
    </ListItem>
  );
};

export default RestaurantAddressSelectorItem;
