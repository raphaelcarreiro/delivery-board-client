import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from 'src/App';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomer, setPaymentMethod, setProducts, setShipmentAddress } from 'src/store/redux/modules/order/actions';
import Shipment from './steps/shipment/Shipment';
import { setUser } from 'src/store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { steps } from './steps/steps';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    width: 30,
    height: 30,
    borderRadius: '50%',
    marginRight: 10,
    border: `2px solid ${theme.palette.primary.dark}`,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 50,
    justifyContent: 'space-between',
    minHeight: '70vh',
    borderRadius: 4,
    [theme.breakpoints.between('xs', 'sm')]: {
      padding: 15,
      marginRight: 0,
    },
  },
  action: ({ step }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: step > 1 ? 'space-between' : 'flex-end',
    marginTop: 20,
  }),
}));

export const CheckoutContext = React.createContext({
  handleStepNext: () => {},
  handleStepPrior: () => {},
  step: null,
});

export default function Checkout() {
  const app = useContext(AppContext);
  const messaging = useContext(MessagingContext);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [step, setStep] = useState(1);
  const classes = useStyles();

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue = {
    handleStepNext: handleStepNext,
    handleStepPrior: handleStepPrior,
    step,
  };

  useEffect(() => {
    app.handleCartVisibility(true);

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
      dispatch(setShipmentAddress(address));
      setLoading(false);
    }

    dispatch(setProducts(cart.products));
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

  function handleStepNext() {
    setStep(step + 1);
  }

  function handleStepPrior() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <>
      {loading ? (
        <Loading background="#fafafa" />
      ) : (
        <Grid container>
          <Grid item xs={12} md={8} lg={8} xl={8} className={classes.title}>
            <Typography variant="h6" style={{ marginBottom: 20 }}>
              {user.name}, finalize seu pedido.
            </Typography>
            <Typography variant={'body1'}>
              <span className={classes.step}>{currentStep.order}</span>
              {currentStep.description}
            </Typography>
          </Grid>
          <CheckoutContext.Provider value={checkoutContextValue}>
            {currentStep.id === 'STEP_SHIPMENT' && (
              <Shipment shipment addresses={user.customer ? user.customer.addresses : []} />
            )}
          </CheckoutContext.Provider>
        </Grid>
      )}
    </>
  );
}
