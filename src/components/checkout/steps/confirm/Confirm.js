import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import { AppContext } from 'src/App';

const useStyles = makeStyles(theme => ({
  orderItemData: {
    marginBottom: 12,
  },
  action: {
    marginTop: 30,
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },
  container: {
    padding: 15,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  total: {
    fontWeight: 300,
  },
  btnTotal: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  title: {
    fontWeight: 400,
  },
  link: {
    cursor: 'pointer',
    display: 'inline-block',
    marginTop: 1,
  },
}));

export default function Confirm() {
  const order = useSelector(state => state.order);
  const cart = useSelector(state => state.cart);
  const checkout = useContext(CheckoutContext);
  const mainRestaurantAddress = useSelector(state => state.restaurant).addresses.find(address => address.is_main);
  const app = useContext(AppContext);
  const classes = useStyles();

  useEffect(() => {
    if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
  }, []);

  function handleChangeStep(step) {
    checkout.handleSetStep(step);
  }

  return (
    <Grid container className={classes.container}>
      {order.shipment_method === 'delivery' ? (
        <Grid item xs={12} className={classes.orderItemData}>
          <Typography variant="h5" className={classes.title}>
            Endereço de entrega
          </Typography>
          <Typography>
            {order.shipmentAddress.address}, {order.shipmentAddress.number}
          </Typography>
          <Typography>{order.shipmentAddress.district}</Typography>
          <Typography>{order.shipmentAddress.address_complement}</Typography>
          <Typography>{order.shipmentAddress.postal_code}</Typography>
          <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
            Alterar
          </Typography>
        </Grid>
      ) : (
        <Grid item xs={12} className={classes.orderItemData}>
          <Typography variant="h5" className={classes.title}>
            Cliente retira em
          </Typography>
          <Typography>
            {mainRestaurantAddress.address}, {mainRestaurantAddress.number}
          </Typography>
          <Typography>{mainRestaurantAddress.district}</Typography>
          <Typography>{mainRestaurantAddress.address_complement}</Typography>
          <Typography>{mainRestaurantAddress.postal_code}</Typography>
          <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
            Alterar
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} className={classes.orderItemData}>
        <Typography variant="h5" className={classes.title}>
          Forma de pagamento
        </Typography>
        {order.paymentMethod.kind === 'online_payment' ? (
          <>
            <Typography>Pagamento on-line</Typography>
            <Typography color="textSecondary">Cartão de crédito</Typography>
            <Typography color="textSecondary">**** **** **** {order.creditCard.card_number.substr(-4)}</Typography>
          </>
        ) : (
          <>
            <Typography>Pagamento na entrega</Typography>
            <Typography>{order.paymentMethod.method}</Typography>
            {order.change > 0 && (
              <Typography color="textSecondary">
                Troco para {moneyFormat(order.change)} ({moneyFormat(order.change - cart.total)})
              </Typography>
            )}
          </>
        )}
        <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(2)}>
          Alterar
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.orderItemData}>
        <Typography variant="h5" className={classes.title}>
          Total à pagar
        </Typography>
        <Typography variant="h6" className={classes.total}>
          {cart.formattedTotal}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.action}>
        <Button
          onClick={checkout.handleSubmitOrder}
          className={classes.btnTotal}
          size="large"
          variant="contained"
          color="primary"
        >
          Confirmar Meu Pedido
        </Button>
      </Grid>
    </Grid>
  );
}
