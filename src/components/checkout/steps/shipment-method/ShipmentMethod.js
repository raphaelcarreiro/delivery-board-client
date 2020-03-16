import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { CheckoutContext } from '../../Checkout';
import { setCustomerCollect, orderChange, setShipmentMethod } from 'src/store/redux/modules/order/actions';
import { updateTotal } from 'src/store/redux/modules/cart/actions';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actions: {
    display: 'flex',
    '& button': {
      marginRight: 20,
      width: 300,
      height: 100,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridGap: 10,
      '& button': {
        margin: 0,
        width: 280,
      },
    },
  },
}));

export default function ShipmentMethod() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);

  function handleSetCustomerCollect() {
    dispatch(setShipmentMethod('customer_collect'));
    dispatch(updateTotal('customer_collect')); // update cart total
    checkout.handleStepNext();
  }

  function handleSetDelivery() {
    dispatch(setShipmentMethod('delivery'));
    dispatch(updateTotal('delivery')); // update cart total
    checkout.handleStepNext();
  }

  return (
    <div className={classes.container}>
      <div className={classes.actions}>
        <Button variant="outlined" color="primary" size="large" onClick={handleSetCustomerCollect}>
          Quero retirar
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={handleSetDelivery}>
          Quero receber em casa
        </Button>
      </div>
    </div>
  );
}
