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
import { setUser } from 'src/store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
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
import * as yup from 'yup';
import { cpfValidation } from 'src/helpers/cpfValidation';
import ShipmentMethod from './steps/shipment-method/ShipmentMethod';
import { useRouter } from 'next/router';
import { cardBrandValidation } from 'src/helpers/cardBrandValidation';

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
  createdOrder: null,
  step: null,
  cardValidation: {},
  saving: false,
});

export default function Checkout() {
  const messaging = useContext(MessagingContext);
  const app = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const classes = useStyles({ step, isCartVisible: app.isCartVisible });
  const [steps, setSteps] = useState(defaultSteps);
  const [cardValidation, setCardValidation] = useState({ approved: false });

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue = {
    handleStepNext: handleStepNext,
    handleStepPrior: handleStepPrior,
    handleSubmitOrder: handleSubmitOrder,
    handleSetStep: handleSetStep,
    handleSetStepById: handleSetStepById,
    setCardValidation: setCardValidation,
    saving,
    createdOrder,
    step,
    cardValidation,
  };

  useEffect(() => {
    if (restaurant.id)
      if (restaurant.configs.facebook_pixel_id) {
        fbq('track', 'InitiateCheckout');
      }
  }, [restaurant]);

  useEffect(() => {
    if (restaurant.id) {
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
    }
  }, [restaurant, order.shipment.shipment_method]);

  useEffect(() => {
    if (restaurant.id) {
      dispatch(setTax(cart.tax));
      dispatch(setDiscount(cart.discount));
      if (
        cart.subtotal < restaurant.configs.order_minimum_value &&
        restaurant.configs.tax_mode !== 'order_value' &&
        currentStep.id !== 'STEP_SUCCESS' &&
        cart.products.length > 0
      ) {
        messaging.handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`);
        router.push('/menu');
      }
    }
  }, [cart.total, restaurant]); // eslint-disable-line

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
          if (restaurant.configs.tax_mode === 'district') {
            if (address) {
              if (address.area_region) {
                dispatch(setShipmentAddress(address));
              }
            } else dispatch(setShipmentAddress({}));
            return;
          }

          dispatch(setShipmentAddress(address || {}));
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

      if (restaurant.configs.tax_mode === 'district') {
        if (address) {
          if (address.area_region) {
            dispatch(setShipmentAddress(address));
          }
        } else dispatch(setShipmentAddress({}));
        setLoading(false);
        return;
      }

      dispatch(setShipmentAddress(address || {}));
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    api()
      .get('/order/paymentMethods')
      .then(response => {
        setPaymentMethods(response.data);
        dispatch(setPaymentMethod(response.data[0]));
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error, null, { marginBottom: 47 });
      });
  }, []); // eslint-disable-line

  useEffect(() => {
    dispatch(setProducts(cart.products));
    dispatch(setCoupon(cart.coupon));
  }, [cart, dispatch]);

  function handleSubmitOrder() {
    if (cart.subtotal < restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value') {
      messaging.handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`, null, {
        marginBottom: 47,
      });
      return;
    }
    setSaving(true);
    api()
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
        if (err.response) messaging.handleOpen(err.response.data.error, null, { marginBottom: 47 });
      })
      .finally(() => {
        setSaving(false);
      });
  }

  async function handleStepNext() {
    if (currentStep.id === 'STEP_SHIPMENT') {
      if (!order.shipment.id) {
        messaging.handleOpen('Informe o endereço', null, { marginBottom: 47 });
        return;
      }
    } else if (currentStep.id === 'STEP_PAYMENT') {
      if (!order.paymentMethod) {
        messaging.handleOpen('Selecione uma forma de pagamento');
        return;
      }
      if (order.paymentMethod.kind === 'card' && order.paymentMethod.mode === 'online') {
        const validation = await handleCardValidation(order.creditCard);
        if (!validation) return;
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

  async function handleCardValidation(card) {
    const schema = yup.object().shape({
      cpf: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .test('cpfValidation', 'CPF inválido', value => {
          return cpfValidation(value);
        })
        .required('CPF é obrigatório'),
      cvv: yup
        .string()
        .min(3, 'O código de segurança deve ter 3 digitos')
        .required('O código de segurança é obrigatório'),
      expiration_date: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(4, 'Data de validade inválida')
        .required('A data de validade do cartão é obrigatória'),
      name: yup.string().required('O nome e sobrenome são obrigatórios'),
      number: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(12, 'Número do cartão inválido')
        .test('cardValidation', 'Infelizmente não trabalhamos com essa bandeira de cartão', value => {
          return cardBrandValidation(value);
        })
        .required('O número do cartão é obrigatório'),
    });

    try {
      await schema.validate(card);
      setCardValidation({ approved: true });
      return true;
    } catch (err) {
      console.log(err.message);
      setCardValidation({
        [err.path]: err.message,
        approvred: false,
      });
      return false;
    }
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
              <div className={classes.cartContent}>
                <Cart />
              </div>
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
