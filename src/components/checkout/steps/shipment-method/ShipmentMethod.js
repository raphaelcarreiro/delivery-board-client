import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setShipmentMethod, setSchedule } from 'src/store/redux/modules/order/actions';
import ShipmentCollectSchedule from './ShipmentCollectSchedule';
import { useCheckout } from '../../hooks/useCheckout';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: 10,
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1fr',
      gridGap: 10,
      '&>div': {
        margin: 0,
        width: '100%',
      },
    },
  },
  button: {
    height: 100,
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    fontSize: 18,
    flexDirection: 'column',
  },
  icon: {
    fontSize: 38,
    marginRight: 10,
  },
}));

export default function ShipmentMethod() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const checkout = useCheckout();
  const restaurant = useSelector(state => state.restaurant);
  const [dialogCollectSchedule, setDialogSchecule] = useState(false);
  const { area } = useCheckout();

  function handleSetCustomerCollect() {
    dispatch(setShipmentMethod('customer_collect'));
    if (restaurant.configs.shipment_schedule) setDialogSchecule(true);
    else checkout.handleStepNext();
  }

  function handleSetDelivery() {
    dispatch(setShipmentMethod('delivery'));
    dispatch(setSchedule(null));
    checkout.handleStepNext();
  }

  function handleDialogClose() {
    setDialogSchecule(false);
    checkout.handleStepNext();
  }

  return (
    <>
      {dialogCollectSchedule && <ShipmentCollectSchedule onExited={handleDialogClose} />}
      <div className={classes.container}>
        <div className={classes.actions}>
          {area && area.setting.customer_collect && (
            <ListItem button className={classes.button} onClick={handleSetCustomerCollect}>
              <Typography variant="h6">retirar</Typography>
              <Typography variant="body1" color="textSecondary">
                você retira conosco
              </Typography>
            </ListItem>
          )}
          {area && area.setting.delivery && (
            <ListItem button className={classes.button} onClick={handleSetDelivery}>
              <Typography variant="h6">receber</Typography>
              <Typography variant="body1" color="textSecondary">
                nós levamos até você
              </Typography>
            </ListItem>
          )}
        </div>
      </div>
    </>
  );
}
