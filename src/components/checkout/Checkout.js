import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCustomer,
  setPaymentMethod,
  setProducts,
  setShipmentAddress,
  setChange,
  clearCard,
  setCoupon,
  setTax,
  setDiscount,
} from 'src/store/redux/modules/order/actions';
import Shipment from './steps/shipment/Shipment';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { steps as defaultSteps } from './steps/steps';
import { Grid, Typography } from '@material-ui/core';
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
import ShipmentMethod from './steps/shipment-method/ShipmentMethod';
import { useRouter } from 'next/router';
import InsideLoading from '../loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';
import { useAuth } from 'src/hooks/auth';

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
    [theme.breakpoints.down('md')]: {
      marginBottom: 20,
    },
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
    width: cartWidth,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 0 6px 4px #ddd',
    padding: '10px 20px 20px 20px',
    zIndex: 9,
    overflowY: 'auto',
  }),
  stepDescription: {
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  cartContent: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

export const CheckoutContext = React.createContext({
  handleStepNext: () => {},
  handleStepPrior: () => {},
  handleSubmitOrder: () => {},
  handleSetStep: () => {},
  handleSetStepById: () => {},
  setIsCardValid: () => {},
  createdOrder: null,
  step: null,
  cardValidation: {},
  saving: false,
  isCardValid: false,
});

export default function Checkout() {
  const { handleOpen } = useMessaging();
  const { isCartVisible, handleCartVisibility, isMobile, windowWidth } = useContext(AppContext);
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [step, setStep] = useState(1);
  const classes = useStyles({ step, isCartVisible: isCartVisible });
  const [saving, setSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [steps, setSteps] = useState(defaultSteps);
  const [isCardValid, setIsCardValid] = useState(false);
  const dispatch = useDispatch();
  const auth = useAuth();

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue = {
    handleStepNext: handleStepNext,
    handleStepPrior: handleStepPrior,
    handleSubmitOrder: handleSubmitOrder,
    handleSetStep: handleSetStep,
    handleSetStepById: handleSetStepById,
    setIsCardValid: setIsCardValid,
    isCardValid,
    saving,
    createdOrder,
    step,
  };

  useEffect(() => {
    if (!restaurant) return;
    if (restaurant.configs.facebook_pixel_id) fbq('track', 'InitiateCheckout');
  }, [restaurant]);

  useEffect(() => {
    if (!restaurant) return;

    const { configs } = restaurant;

    let stepId = 0;
    let newSteps = defaultSteps.slice();

    if (!configs.customer_collect) {
      newSteps = newSteps.filter(s => s.id !== 'STEP_SHIPMENT_METHOD');
    }

    if (order.shipment.shipment_method === 'customer_collect') {
      newSteps = newSteps.filter(s => s.id !== 'STEP_SHIPMENT');
    }

    setSteps(
      newSteps.map(step => {
        stepId++;
        step.order = stepId;
        return step;
      })
    );
  }, [restaurant, order.shipment.shipment_method]);

  useEffect(() => {
    if (!restaurant) return;

    dispatch(setTax(cart.tax));
    dispatch(setDiscount(cart.discount));
    if (
      cart.subtotal < restaurant.configs.order_minimum_value &&
      restaurant.configs.tax_mode !== 'order_value' &&
      currentStep.id !== 'STEP_SUCCESS' &&
      cart.products.length > 0
    ) {
      handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`);
      router.push('/menu');
    }
  }, [cart.total, restaurant]); // eslint-disable-line

  useEffect(() => {
    if (!user.id || !restaurant || !cart.configs) return;

    if (order.shipment.id) return;

    handleCartVisibility(false);

    function setAddress(address) {
      if (restaurant.configs.tax_mode === 'district') {
        if (address && address.area_region) dispatch(setShipmentAddress(address));
        else dispatch(setShipmentAddress({}));
        return;
      } else if (restaurant.delivery_max_distance && address) {
        if (address.distance <= restaurant.delivery_max_distance) dispatch(setShipmentAddress(address));
        else dispatch(setShipmentAddress({}));
        return;
      }

      dispatch(setShipmentAddress(address || {}));
    }

    const customer = user.customer;
    const address = customer.addresses.find(address => address.is_main);

    dispatch(setCustomer(customer));
    setAddress(address);
  }, [user, dispatch, cart.configs, handleCartVisibility, restaurant]); //eslint-disable-line

  useEffect(() => {
    api
      .get('/order/paymentMethods')
      .then(response => {
        setPaymentMethods(response.data);
        const paymentMethods = response.data;
        const offline = paymentMethods.some(method => method.mode === 'offline');
        if (offline) dispatch(setPaymentMethod(response.data[0]));
      })
      .catch(err => {
        if (err.response) handleOpen(err.response.data.error, null, { marginBottom: 47 });
      });
  }, [dispatch, handleOpen]);

  useEffect(() => {
    dispatch(setProducts(cart.products));
    dispatch(setCoupon(cart.coupon));
  }, [cart, dispatch]);

  function handleSubmitOrder() {
    if (cart.subtotal < restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value') {
      handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`, null, {
        marginBottom: 47,
      });
      return;
    }
    setSaving(true);
    api
      .post('/orders', order)
      .then(response => {
        setCreatedOrder(response.data);

        if (response.data.picpay_payment) {
          window.open(response.data.picpay_payment.payment_url, '_blank');
        }
        dispatch(setChange(0));
        dispatch(clearCard());
        dispatch(clearCart());
        handleStepNext();
      })
      .catch(err => {
        if (err.response) handleOpen(err.response.data.error, null, { marginBottom: 47 });
      })
      .finally(() => {
        setSaving(false);
      });
  }

  async function handleStepNext() {
    if (currentStep.id === 'STEP_SHIPMENT') {
      if (!order.shipment.id) {
        handleOpen('Informe o endereço', null, { marginBottom: 47 });
        return;
      }
    } else if (currentStep.id === 'STEP_PAYMENT') {
      if (!order.paymentMethod) {
        handleOpen('Selecione uma forma de pagamento', null, { marginBottom: 47 });
        return;
      }
    }
    setStep(step + 1);
  }

  function handleStepPrior() {
    if (step > 1) setStep(step - 1);
  }

  function handleSetStep(step) {
    if (step < 1 || step > 4) return;
    setStep(step);
  }

  function handleSetStepById(id) {
    const order = steps.find(s => s.id === id).order;
    if (order) setStep(order);
  }

  return (
    <>
      {!isMobile && windowWidth >= 960 ? (
        <div className={classes.cart}>
          <Cart />
        </div>
      ) : (
        <>
          {isCartVisible && (
            <DialogFullscreen title="carrinho" handleModalState={() => handleCartVisibility(false)}>
              <div className={classes.cartContent}>
                <Cart />
              </div>
            </DialogFullscreen>
          )}
        </>
      )}
      <CustomAppbar
        title={currentStep.id === 'STEP_SUCCESS' ? 'pedido recebido' : 'finalizar pedido'}
        actionComponent={<IndexAppbarActions />}
      />
      {saving && <Loading background="rgba(250,250,250,0.5)" />}
      {auth.isLoading ? (
        <InsideLoading />
      ) : currentStep.id === 'STEP_SUCCESS' ? (
        <CheckoutContext.Provider value={checkoutContextValue}>
          <CheckoutSuccess />
        </CheckoutContext.Provider>
      ) : cart.products.length === 0 ? (
        <CheckoutEmptyCart />
      ) : (
        <Grid container direction="column" justify="space-between" className={classes.container}>
          <CheckoutContext.Provider value={checkoutContextValue}>
            <div className={classes.content}>
              <Grid item xs={12} className={classes.title}>
                <Typography variant="h6" className={classes.stepDescription}>
                  <span className={classes.step}>{currentStep.order}</span>
                  {currentStep.description}
                </Typography>
              </Grid>
              {currentStep.id === 'STEP_SHIPMENT_METHOD' ? (
                <ShipmentMethod />
              ) : currentStep.id === 'STEP_SHIPMENT' ? (
                <Shipment addresses={user.customer ? user.customer.addresses : []} />
              ) : currentStep.id === 'STEP_PAYMENT' ? (
                <Payment
                  paymentMethods={paymentMethods}
                  paymentMethodId={order.paymentMethod && order.paymentMethod.id}
                  isCardValid={isCardValid}
                  setIsCardValid={setIsCardValid}
                />
              ) : (
                currentStep.id === 'STEP_CONFIRM' && <Confirm />
              )}
            </div>
            {currentStep.id !== 'STEP_SHIPMENT_METHOD' && (
              <>
                <CheckoutButtons
                  handleStepNext={handleStepNext}
                  handleStepPrior={handleStepPrior}
                  currentStep={currentStep}
                  quantitySteps={steps.length}
                />
                <CheckoutMobileButtons
                  handleStepNext={handleStepNext}
                  handleStepPrior={handleStepPrior}
                  currentStep={currentStep}
                  quantitySteps={steps.length}
                />
              </>
            )}
          </CheckoutContext.Provider>
        </Grid>
      )}
    </>
  );
}
