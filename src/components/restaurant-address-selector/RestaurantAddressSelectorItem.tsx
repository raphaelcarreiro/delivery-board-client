import { ListItem, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRestaurantAddress } from 'src/store/redux/modules/order/actions';
import { RestaurantAddress } from 'src/types/restaurant';
import { useCustomDialog } from '../dialog/CustomDialog';

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
  const { handleCloseDialog } = useCustomDialog();

  function handleClick(address: RestaurantAddress) {
    dispatch(setRestaurantAddress(address));
    handleCloseDialog();
  }

  return (
    <ListItem button disabled={!address.active} className={classes.listItem} onClick={() => handleClick(address)}>
      <Typography gutterBottom>{address.nickname}</Typography>

      <Typography color="textSecondary" variant="body2">
        {address.address}, {address.number}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        {address.city} - {address.region}
      </Typography>
    </ListItem>
  );
};

export default RestaurantAddressSelectorItem;
