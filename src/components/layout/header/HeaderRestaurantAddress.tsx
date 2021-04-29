import { makeStyles, Typography } from '@material-ui/core';
import { RoomOutlined } from '@material-ui/icons';
import React from 'react';
import { useApp } from 'src/hooks/app';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles({
  restaurantAddressContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 4,
    maxWidth: 400,
    width: '100%',
    border: '1px solid transparent',
    '& .content': {
      marginLeft: 10,
    },
    '& .restaurant-address': {
      maxWidth: 330,
    },
    '&:hover': {
      border: '1px solid #ddd',
    },
  },
});

const HeaderRestaurantAddress: React.FC = () => {
  const classes = useStyles();

  const app = useApp();
  const order = useSelector(state => state.order);

  return (
    <>
      {order.restaurant_address && (
        <div onClick={() => app.setDialogRestaurantAddress(true)} className={classes.restaurantAddressContainer}>
          <RoomOutlined />
          <div className="content">
            <Typography variant="body2" color="textSecondary">
              Você esta comprando em
            </Typography>
            <Typography noWrap className="restaurant-address" align="center" variant="body2">
              {order.restaurant_address.nickname} - {order.restaurant_address.address},{' '}
              {order.restaurant_address.number}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderRestaurantAddress;
