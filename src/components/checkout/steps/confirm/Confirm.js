import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { moneyFormat } from 'src/helpers/numberFormat';
import { useCheckout } from '../hooks/useCheckout';
import ConfirmShipmentAddressText from './ConfirmShipmentAddressText';

const useStyles = makeStyles(theme => ({
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
    padding: '10px 0',
    borderBottom: '1px solid #eee',
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
    flexDirection: 'column',
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
  const checkout = useCheckout();
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
        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            {order.shipment.shipment_method === 'delivery' ? 'endereço de entrega' : 'endereço para retirada'}
          </Typography>
          <ConfirmShipmentAddressText />
          <div className={classes.deliveryTime}>
            {order.shipment.scheduled_at ? (
              <Typography color="textSecondary" variant="body2">
                agendado para as {order.shipment.formattedScheduledAt}
              </Typography>
            ) : (
              restaurant.configs.delivery_time && (
                <Typography color="textSecondary" variant="body2">
                  tempo estimado para retirada, {restaurant.configs.delivery_time} min
                </Typography>
              )
            )}
          </div>
          <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
            alterar
          </Typography>
        </div>

        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            forma de pagamento
          </Typography>
          {order.paymentMethod.mode === 'online' ? (
            <Typography>pagamento on-line</Typography>
          ) : (
            <Typography>pagamento na entrega</Typography>
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
                  {' - '}troco para {moneyFormat(order.change)}
                </Typography>
              )}
            </Typography>
          )}
          <Typography color="primary" className={classes.link} onClick={() => handleChangeStepById('STEP_PAYMENT')}>
            alterar
          </Typography>
        </div>
        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            total à pagar
          </Typography>
          <Typography variant="h6" className={classes.total}>
            {cart.formattedTotal}
          </Typography>
          {cart.tax > 0 && (
            <Typography color="textSecondary" variant="body2">
              este valor inclui a taxa de {cart.formattedTax} para a entrega
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
