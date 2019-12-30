import React, { useContext, useEffect } from 'react';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { formatId } from 'src/helpers/formatOrderId';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default function CheckoutSuccess() {
  const checkout = useContext(CheckoutContext);
  const user = useSelector(state => state.user);
  const order = checkout.createdOrder;
  const classes = useStyles();
  const app = useContext(AppContext);

  useEffect(() => {
    app.handleCartVisibility(false);
  }, []);

  return (
    <div className={classes.container}>
      <Typography gutterBottom variant="h4">
        {user.name}, recebemos seu pedido!
      </Typography>
      <Typography>O número do pedido é {formatId(order.id)}</Typography>
      <Typography>Vamos te notificar sobre o andamento.</Typography>
    </div>
  );
}
