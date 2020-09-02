import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import { CheckoutContext } from 'src/components/checkout/Checkout';
import { AppContext } from 'src/App';

const useStyles = makeStyles(theme => ({
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    position: 'relative',
    maxWidth: 900,
    width: '100%',
    marginBottom: 8,
    marginRight: 10,
    padding: 10,
    borderRadius: 4,
    borderBottom: '1px solid #eee',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
    '&:last-child': {
      border: 'none',
    },
  },
  action: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },
  container: {
    display: 'flex',
    padding: 15,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '0 0 30px',
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
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 5,
  },
  link: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    cursor: 'pointer',
    display: 'inline-block',
  },
  deliveryTime: {
    marginTop: 7,
  },
}));

export default function Confirm() {
  const order = useSelector(state => state.order);
  const cart = useSelector(state => state.cart);
  const restaurant = useSelector(state => state.restaurant);
  const checkout = useContext(CheckoutContext);
  const mainRestaurantAddress = useSelector(state => state.restaurant).addresses.find(address => address.is_main);
  const classes = useStyles();

  useEffect(() => {
    // if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
  }, []);

  function handleChangeStep(step) {
    checkout.handleSetStep(step);
  }

  function handleChangeStepById(id) {
    checkout.handleSetStepById(id);
  }

  return (
    <div className={classes.container}>
      <div className={classes.data}>
        {order.shipment.shipment_method === 'delivery' ? (
          <div className={classes.item}>
            <Typography variant="h5" className={classes.title}>
              Endereço de entrega
            </Typography>
            <Typography>
              {order.shipment.address}, {order.shipment.number}, {order.shipment.district}
              {order.shipment.address_complement && `, ${order.shipment.address_complement}`}
              {order.shipment.postal_code !== '00000000' && `, ${order.shipment.postal_code}`}
            </Typography>
            {restaurant.configs.delivery_time && (
              <div className={classes.deliveryTime}>
                <Typography color="textSecondary" variant="body2">
                  Tempo estimado para entrega, {restaurant.configs.delivery_time} min
                </Typography>
              </div>
            )}
            <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
              Alterar
            </Typography>
          </div>
        ) : (
          <div className={classes.item}>
            <Typography variant="h5" className={classes.title}>
              Endereço para retirada
            </Typography>
            <Typography>
              {mainRestaurantAddress.address}, {mainRestaurantAddress.number}
            </Typography>
            <Typography>{mainRestaurantAddress.district}</Typography>
            <Typography>{mainRestaurantAddress.address_complement}</Typography>
            <Typography color="textSecondary">{mainRestaurantAddress.postal_code}</Typography>
            <div className={classes.deliveryTime}>
              {order.shipment.scheduled_at ? (
                <Typography color="textSecondary" variant="body2">
                  Agendado para as {order.shipment.formattedScheduledAt}
                </Typography>
              ) : (
                restaurant.configs.delivery_time && (
                  <Typography color="textSecondary" variant="body2">
                    Tempo estimado para retirada, {restaurant.configs.delivery_time} min
                  </Typography>
                )
              )}
            </div>
            <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
              Alterar
            </Typography>
          </div>
        )}
        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Forma de pagamento
          </Typography>
          {order.paymentMethod.mode === 'online' ? (
            <Typography>Pagamento on-line</Typography>
          ) : (
            <Typography>Pagamento na entrega</Typography>
          )}
          {order.paymentMethod.kind === 'card' && order.paymentMethod.mode === 'online' ? (
            <>
              <Typography variant="body2">{order.paymentMethod.method}</Typography>
              <Typography>**** **** **** {order.creditCard.number.substr(-4)}</Typography>
            </>
          ) : (
            <Typography>
              {order.paymentMethod.method}
              {order.change > 0 && (
                <Typography display="inline" variant="body1" color="textSecondary" component="span">
                  {' - '}Troco para {moneyFormat(order.change)}
                </Typography>
              )}
            </Typography>
          )}
          <Typography color="primary" className={classes.link} onClick={() => handleChangeStepById('STEP_PAYMENT')}>
            Alterar
          </Typography>
        </div>
        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Total à pagar
          </Typography>
          <Typography variant="h6" className={classes.total}>
            {cart.formattedTotal}
          </Typography>
          {cart.tax > 0 && (
            <Typography color="textSecondary" variant="body2">
              Este valor inclui a taxa de {cart.formattedTax} para a entrega
            </Typography>
          )}
        </div>
      </div>
      <div className={classes.action}>
        <Button
          onClick={checkout.handleSubmitOrder}
          className={classes.btnTotal}
          size="large"
          variant="contained"
          color="primary"
          disabled={checkout.saving}
        >
          Confirmar Meu Pedido
        </Button>
      </div>
    </div>
  );
}
