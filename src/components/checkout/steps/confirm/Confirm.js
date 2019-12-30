import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import { AppContext } from 'src/App';

const useStyles = makeStyles({
  orderItemData: {
    marginBottom: 15,
  },
  action: {
    marginTop: 30,
  },
  container: {
    padding: 15,
  },
});

export default function Confirm() {
  const order = useSelector(state => state.order);
  const checkout = useContext(CheckoutContext);
  const app = useContext(AppContext);
  const classes = useStyles();

  useEffect(() => {
    if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
  }, []);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.orderItemData}>
        <Typography variant="h5" color="primary">
          Endereço de entrega
        </Typography>
        <Typography>
          {order.shipmentAddress.address}, {order.shipmentAddress.number}
        </Typography>
        <Typography color="textSecondary">{order.shipmentAddress.district}</Typography>
        <Typography color="textSecondary">{order.shipmentAddress.address_complement}</Typography>
        <Typography color="textSecondary">{order.shipmentAddress.postal_code}</Typography>
      </Grid>
      <Grid item xs={12} className={classes.orderItemData}>
        <Typography variant="h5" color="primary">
          Forma de pagamento
        </Typography>
        <Typography>{order.paymentMethod.method}</Typography>
        {order.change > 0 && <Typography>Troco para {moneyFormat(order.change)}</Typography>}
      </Grid>
      <Grid item xs={12} className={classes.action}>
        <Button onClick={checkout.handleSubmitOrder} size="large" variant="contained" color="primary">
          Confirmar Meu Pedido
        </Button>
      </Grid>
    </Grid>
  );
}
