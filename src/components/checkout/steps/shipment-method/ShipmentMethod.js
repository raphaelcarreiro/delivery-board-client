import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { CheckoutContext } from '../../Checkout';
import { setShipmentMethod, setSchedule } from 'src/store/redux/modules/order/actions';
import ShipmentCollectSchedule from './ShipmentCollectSchedule';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actions: {
    display: 'flex',
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
    marginRight: 20,
    width: 350,
    height: 100,
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
    alignItems: 'center',
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
  const checkout = useContext(CheckoutContext);
  const restaurant = useSelector(state => state.restaurant);
  const order = useSelector(state => state.order);
  const [dialogCollectSchedule, setDialogSchecule] = useState(false);

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
          <ListItem button className={classes.button} onClick={handleSetCustomerCollect}>
            <Typography variant="h6">Quero retirar</Typography>
            {order.shipment.scheduled_at && (
              <Typography color="textSecondary">Agendado para as {order.shipment.formattedScheduledAt}</Typography>
            )}
          </ListItem>
          <ListItem button className={classes.button} onClick={handleSetDelivery}>
            <Typography variant="h6">Quero receber em casa</Typography>
          </ListItem>
        </div>
      </div>
    </>
  );
}
