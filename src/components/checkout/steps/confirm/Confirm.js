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
    flexWrap: 'wrap',
  },
  item: {
    position: 'relative',
    flexGrow: 1,
    flexBasis: 300,
    flexShrink: 1,
    marginBottom: 8,
    marginRight: 10,
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ddd',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
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
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 5,
  },
  link: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    cursor: 'pointer',
    display: 'inline-block',
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
              {order.shipment.address}, {order.shipment.number}
            </Typography>
            <Typography>{order.shipment.district}</Typography>
            <Typography>{order.shipment.address_complement}</Typography>
            {order.shipment.postal_code !== '00000000' && <Typography>{order.shipment.postal_code}</Typography>}
            <Typography color="primary" className={classes.link} onClick={() => handleChangeStep(1)}>
              Alterar
            </Typography>
          </div>
        ) : (
          <div className={classes.item}>
            <Typography variant="h5" className={classes.title}>
              Cliente retira
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Endereço para retirada
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
          </div>
        )}
        <div className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Forma de pagamento
          </Typography>
          {order.paymentMethod.kind === 'online_payment' ? (
            <>
              <Typography>Pagamento on-line</Typography>
              <Typography variant="body2">Cartão de crédito</Typography>
              <Typography>**** **** **** {order.creditCard.number.substr(-4)}</Typography>
            </>
          ) : (
            <>
              <Typography>Pagamento na entrega</Typography>
              <Typography>
                <>
                  {order.paymentMethod.method}
                  {order.change > 0 && (
                    <Typography display="inline" variant="body2" color="textSecondary">
                      {' - '}Troco para {moneyFormat(order.change)}
                    </Typography>
                  )}
                </>
              </Typography>
            </>
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
