import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomer, setPaymentMethod, setProducts, setShipmentAddress } from 'src/store/redux/modules/order/actions';
import Shipment from './steps/shipment/Shipment';
import { setUser } from 'src/store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { steps } from './steps/steps';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Payment from 'src/components/checkout/steps/payment/Payment';
import Confirm from 'src/components/checkout/steps/confirm/Confirm';
import CheckoutEmptyCart from 'src/components/checkout/steps/CheckoutEmptyCart';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import CheckoutSuccess from 'src/components/checkout/steps/success/CheckoutSuccess';
import { clearCart } from 'src/store/redux/modules/cart/actions';
import Cart from 'src/components/checkout/cart/Cart';
import { AppContext } from 'src/App';
import IndexAppbarActions from 'src/components/index/IndexAppbarActions';
import DialogFullscreen from 'src/components/dialog/DialogFullscreen';
import CheckoutButtons from 'src/components/checkout/CheckoutButtons';
import CheckoutMobileButtons from 'src/components/checkout/CheckoutMobileButtons';

const cartWidth = 450;

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: 15,
  },
  productDescription: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '20%',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 60,
    borderLeft: '1px solid #eee',
  },
  step: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 10,
    border: `2px solid ${theme.palette.primary.dark}`,
  },
  container: {
    flex: 1,
    // border: '1px solid #ddd',
    // padding: 20,
    // borderRadius: 4,
  },
  actions: ({ step }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: step > 1 ? 'space-between' : 'flex-end',
    marginTop: 20,
  }),
  cart: ({ isCartVisible }) => ({
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    transform: isCartVisible ? 'none' : `translateX(${cartWidth}px)`,
    position: 'fixed',
    top: 80,
    minWidth: cartWidth,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 0 6px 4px #ddd',
    padding: '10px 20px 20px 20px',
    zIndex: 9,
    overflowY: 'auto',
  }),
  stepDescription: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
}));

export const CheckoutContext = React.createContext({
  handleStepNext: () => {},
  handleStepPrior: () => {},
  handleSubmitOrder: () => {},
  handleSetStep: () => {},
  createdOrder: null,
  step: null,
});

export default function Checkout() {
  const messaging = useContext(MessagingContext);
  const app = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const classes = useStyles({ step, isCartVisible: app.isCartVisible });

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue = {
    handleStepNext: handleStepNext,
    handleStepPrior: handleStepPrior,
    handleSubmitOrder: handleSubmitOrder,
    handleSetStep: handleSetStep,
    createdOrder,
    step,
  };

  useEffect(() => {
    app.handleCartVisibility(false);
    if (user.loadedFromStorage) {
      api()
        .get(`/users/${user.id}`)
        .then(response => {
          dispatch(setUser(response.data));
          const customer = response.data.customer;
          const address = customer && customer.addresses.find(address => address.is_main);

          dispatch(setCustomer(customer));
          dispatch(setShipmentAddress(address));
        })
        .catch(err => {
          if (err.response) messaging(err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const customer = user.customer;
      const address = customer.addresses.find(address => address.is_main);

      dispatch(setCustomer(customer));
      dispatch(setShipmentAddress(address || {}));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api()
      .get('/order/paymentMethods')
      .then(response => {
        setPaymentMethods(response.data);
        dispatch(setPaymentMethod(response.data[0]));
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      });
  }, []);

  useEffect(() => {
    dispatch(setProducts(cart.products));
  }, [cart]);

  function handleSubmitOrder() {
    if (cart.total < restaurant.minimum_order) {
      messaging.handleOpen(`Valor mínimo do pedido deve ser ${restaurant.formattedMinimumOrder}`);
      return;
    }
    setSaving(true);
    api()
      .post('/orders', order)
      .then(response => {
        setCreatedOrder(response.data);
        dispatch(clearCart());
        handleStepNext();
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleStepNext() {
    setStep(step + 1);
  }

  function handleStepPrior() {
    if (step > 1) setStep(step - 1);
  }

  function handleSetStep(step) {
    if (step < 1 || step > 4) return;
    setStep(step);
  }

  function handleSetPaymentMethod(method) {
    dispatch(setPaymentMethod(method));
  }

  return (
    <>
      {!app.isMobile && app.windowWidth >= 960 ? (
        <div className={classes.cart}>
          <Cart />
        </div>
      ) : (
        <>
          {app.isCartVisible && (
            <DialogFullscreen title="Carrinho" handleModalState={() => app.handleCartVisibility(false)}>
              <Cart />
            </DialogFullscreen>
          )}
        </>
      )}
      <CustomAppbar
        title={currentStep.id === 'STEP_SUCCESS' ? 'Pedido recebido' : 'Finalizar pedido'}
        actionComponent={<IndexAppbarActions />}
      />
      {saving && <Loading background="rgba(250,250,250,0.5)" />}
      {loading ? (
        <Loading />
      ) : currentStep.id === 'STEP_SUCCESS' ? (
        <CheckoutContext.Provider value={checkoutContextValue}>
          <CheckoutSuccess />
        </CheckoutContext.Provider>
      ) : cart.products.length === 0 ? (
        <CheckoutEmptyCart />
      ) : (
        <Grid container direction="column" justify="space-between" className={classes.container}>
          <CheckoutContext.Provider value={checkoutContextValue}>
            <div>
              <Grid item xs={12} className={classes.title}>
                <Typography variant="h6" className={classes.stepDescription}>
                  <span className={classes.step}>{currentStep.order}</span>
                  {currentStep.description}
                </Typography>
              </Grid>

              {currentStep.id === 'STEP_SHIPMENT' ? (
                <Shipment shipment addresses={user.customer ? user.customer.addresses : []} />
              ) : currentStep.id === 'STEP_PAYMENT' ? (
                <Payment
                  handleSetPaymentMethod={handleSetPaymentMethod}
                  paymentMethods={paymentMethods}
                  paymentMethodId={order.paymentMethod.id}
                />
              ) : (
                currentStep.id === 'STEP_CONFIRM' && <Confirm />
              )}
            </div>
            <CheckoutButtons
              handleStepNext={handleStepNext}
              handleStepPrior={handleStepPrior}
              currentStep={currentStep}
            />
            <CheckoutMobileButtons
              handleStepNext={handleStepNext}
              handleStepPrior={handleStepPrior}
              currentStep={currentStep}
            />
          </CheckoutContext.Provider>
        </Grid>
      )}
    </>
  );
}
