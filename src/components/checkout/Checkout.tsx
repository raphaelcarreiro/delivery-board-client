import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCustomer,
  setProducts,
  setChange,
  clearCard,
  setCoupon,
  setTax,
  setDiscount,
  setShipmentAddress,
} from 'src/store/redux/modules/order/actions';
import Shipment from './steps/shipment/Shipment';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { steps as defaultSteps, CheckoutStepIds } from './steps/steps';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Payment from 'src/components/checkout/steps/payment/Payment';
import Confirm from 'src/components/checkout/steps/confirm/Confirm';
import CheckoutEmptyCart from 'src/components/checkout/steps/CheckoutEmptyCart';
import CustomAppbar from 'src/components/appbar/CustomAppbar';
import CheckoutSuccess from 'src/components/checkout/steps/success/CheckoutSuccess';
import { clearCart, setTax as cartSetTax } from 'src/store/redux/modules/cart/actions';
import Cart from 'src/components/checkout/cart/Cart';
import IndexAppbarActions from 'src/components/index/IndexAppbarActions';
import DialogFullscreen from 'src/components/dialog/DialogFullscreen';
import CheckoutButtons from 'src/components/checkout/CheckoutButtons';
import ShipmentMethod from './steps/shipment-method/ShipmentMethod';
import { useRouter } from 'next/router';
import InsideLoading from '../loading/InsideLoading';
import { useMessaging } from 'src/hooks/messaging';
import { useAuth } from 'src/hooks/auth';
import { useApp } from 'src/hooks/app';
import CheckoutError from './steps/error/CheckoutError';
import { CheckoutContextValue, CheckoutProvider } from './steps/hooks/useCheckout';
import { useSelector } from 'src/store/redux/selector';
import CheckoutTitle from './CheckoutTitle';
import { Area } from 'src/types/area';

type UseStylesProps = {
  step: number;
  isCartVisible: boolean;
};

const useStyles = makeStyles<Theme, UseStylesProps>(theme => ({
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
  container: {
    flex: 1,
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      marginBottom: 20,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    columnGap: 30,
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  actions: ({ step }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: step > 1 ? 'space-between' : 'flex-end',
    marginTop: 20,
  }),
  cart: {
    display: 'flex',
    position: 'relative',
    backgroundColor: '#eee',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
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
    paddingBottom: 100,
  },
}));

const Checkout: React.FC = () => {
  const { handleOpen } = useMessaging();
  const { isCartVisible, handleCartVisibility } = useApp();
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
  const [error, setError] = useState('');
  const [area, setArea] = useState<Area | null>(null);

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue: CheckoutContextValue = {
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
    currentStep,
    area,
  };

  useEffect(() => {
    gtag('event', 'begin_checkout', {
      items: cart.products.map((product, index) => ({
        id: product.id,
        name: product.name,
        list_name: '',
        brand: '',
        category: product.category.name,
        variant: '',
        list_position: index,
        quantity: product.amount,
        price: product.price,
      })),
      coupon: cart.coupon ? cart.coupon.name : '',
    });
  }, [cart]);

  useEffect(() => {
    if (!restaurant) return;

    if (restaurant.payment_gateway === 'mercadopago') {
      api
        .get('/payment-config')
        .then(response => window.Mercadopago.setPublishableKey(response.data.mercado_pago_public_key))
        .catch(err => console.error(err));
    }
  }, [restaurant]);

  useEffect(() => {
    if (!restaurant) return;
    if (restaurant.configs.facebook_pixel_id) fbq('track', 'InitiateCheckout');
  }, [restaurant]);

  useEffect(() => {
    handleCartVisibility(false);
  }, [handleCartVisibility]);

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

    if (cart.products.length === 0) return;

    if (cart.subtotal < restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value') {
      handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`);
      router.push('/menu');
    }
  }, [cart, dispatch, handleOpen, restaurant, router]);

  useEffect(() => {
    if (!restaurant) return;

    if (cart.products.length === 0) return;

    if (
      cart.productsAmount < restaurant.configs.order_minimum_products_amount &&
      restaurant.configs.tax_mode !== 'products_amount'
    ) {
      handleOpen(`A quantidade mínima de produtos é ${restaurant.configs.order_minimum_products_amount}`);
      router.push('/menu');
    }
  }, [cart, restaurant, router, handleOpen]);

  useEffect(() => {
    if (!user.id) return;

    const customer = user.customer;
    dispatch(setCustomer(customer));
  }, [user, dispatch]);

  useEffect(() => {
    api
      .get('/order/paymentMethods')
      .then(response => {
        setPaymentMethods(response.data);
      })
      .catch(err => {
        if (err.response) handleOpen(err.response.data.error);
      });
  }, [dispatch, handleOpen]);

  useEffect(() => {
    if (!order.restaurant_address) return;

    setSaving(true);

    api
      .get(`/area/restaurantAddress/${order.restaurant_address.id}`)
      .then(response => {
        setArea(response.data || null);
        dispatch(setShipmentAddress({}));
        dispatch(cartSetTax(0));
        setStep(1);
      })
      .catch(err => console.error(err))
      .finally(() => setSaving(false));
  }, [order.restaurant_address, dispatch]);

  useEffect(() => {
    dispatch(setProducts(cart.products));
    dispatch(setCoupon(cart.coupon));
  }, [cart, dispatch]);

  function handleSubmitOrder() {
    if (!restaurant) return;

    if (cart.subtotal < restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value') {
      handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`, {
        style: {
          marginBottom: 47,
        },
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
        setError(
          err.response && err.response.status === 400 ? err.response.data.error : 'Não foi possível salvar o pedido'
        );
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleStepNext() {
    if (currentStep?.id === 'STEP_SHIPMENT') {
      if (!order.shipment.id) {
        handleOpen('Informe o endereço');
        return;
      }
    } else if (currentStep?.id === 'STEP_PAYMENT') {
      if (!order.paymentMethod) {
        handleOpen('Selecione uma forma de pagamento');
        return;
      }
    }
    setStep(step + 1);
  }

  function handleStepPrior() {
    if (step > 1) setStep(step - 1);
  }

  function handleSetStep(step: number) {
    if (step < 1 || step > 4) return;
    setStep(step);
  }

  function handleSetStepById(id: CheckoutStepIds) {
    const step = steps.find(s => s.id === id);

    if (!step) return;

    if (order) setStep(step.order);
  }

  return (
    <CheckoutProvider value={checkoutContextValue}>
      <>
        {isCartVisible && (
          <DialogFullscreen title="carrinho" handleModalState={() => handleCartVisibility(false)}>
            <div className={classes.cartContent}>
              <Cart />
            </div>
          </DialogFullscreen>
        )}
      </>

      <CustomAppbar
        title={currentStep?.id === 'STEP_SUCCESS' ? 'pedido recebido' : 'finalizar pedido'}
        actionComponent={<IndexAppbarActions />}
        cancel={step > 1 && currentStep?.id !== 'STEP_SUCCESS'}
        cancelAction={step > 1 ? handleStepPrior : undefined}
      />
      {saving && <Loading background="rgba(250,250,250,0.5)" />}
      {auth.isLoading ? (
        <InsideLoading />
      ) : currentStep?.id === 'STEP_SUCCESS' ? (
        <CheckoutSuccess />
      ) : error ? (
        <CheckoutError handleReset={() => setError('')} errorMessage={error} />
      ) : cart.products.length === 0 ? (
        <CheckoutEmptyCart />
      ) : (
        <div className={classes.container}>
          <div className={classes.grid}>
            <div className={classes.content}>
              <CheckoutTitle />
              {currentStep?.id === 'STEP_SHIPMENT_METHOD' ? (
                <ShipmentMethod />
              ) : currentStep?.id === 'STEP_SHIPMENT' ? (
                <Shipment addresses={user.customer ? user.customer.addresses : []} />
              ) : currentStep?.id === 'STEP_PAYMENT' ? (
                <Payment
                  paymentMethods={paymentMethods}
                  paymentMethodId={order.paymentMethod && order.paymentMethod.id}
                />
              ) : (
                currentStep?.id === 'STEP_CONFIRM' && <Confirm />
              )}
              <CheckoutButtons />
            </div>
            <div className={classes.cart}>
              <Cart />
            </div>
          </div>
        </div>
      )}
    </CheckoutProvider>
  );
};

export default Checkout;
