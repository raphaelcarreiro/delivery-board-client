import React, { useState, useEffect, useContext } from 'react';
import PaymentList from './PaymentList';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';
import PaymentCreditCard from './PaymentCreditCard';
import { useSelector } from 'react-redux';
import PaymentOtherList from './PaymentOtherList';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 15,
  },
}));

Payment.propTypes = {
  handleSetPaymentMethod: PropTypes.func.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  paymentMethodId: PropTypes.number,
};

export default function Payment({ handleSetPaymentMethod, paymentMethods, paymentMethodId }) {
  const [tab, setTab] = useState(0);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [othersOnline, setOthersOnline] = useState(false);
  const classes = useStyles();
  const app = useContext(AppContext);
  const order = useSelector(state => state.order);
  const { configs } = useSelector(state => state.restaurant);

  useEffect(() => {
    const paymentMethod = paymentMethods.find(method => method.id === paymentMethodId);
    const online = paymentMethods.find(method => method.kind === 'online_payment');
    const othersOnline = paymentMethods.find(method => method.kind === 'picpay');

    setOnlinePayment(!!online);
    setOthersOnline(!!othersOnline);

    if (paymentMethod) {
      if (paymentMethod.kind === 'online_payment') setTab(1);
      else if (paymentMethod.kind === 'picpay' && !online) setTab(1);
      else if (paymentMethod.kind === 'picpay' && othersOnline) setTab(2);
    }
  }, [paymentMethods, paymentMethodId]);

  useEffect(() => {
    if (configs.facebook_pixel_id) fbq('track', 'AddPaymentInfo');
  }, [configs.facebook_pixel_id]);

  function handleTabChange(event, value) {
    setTab(value);
    app.handleCartVisibility(false);
    if (value === 0) {
      if (order.change > 0) handleSetPaymentMethod(paymentMethods.find(method => method.kind === 'money'));
      else handleSetPaymentMethod(paymentMethods[0]);
    } else if (value === 1) {
      if (onlinePayment) handleSetPaymentMethod(paymentMethods.find(method => method.kind === 'online_payment'));
    } else handleSetPaymentMethod(paymentMethods[0]);
  }

  return (
    <>
      <Tabs textColor="primary" indicatorColor="primary" value={tab} onChange={handleTabChange} variant="scrollable">
        <Tab label="Na entrega" />
        {onlinePayment && <Tab label="Online" />}
        {othersOnline && <Tab label="Outros online" />}
      </Tabs>
      <div className={classes.container}>
        {tab === 0 && paymentMethods ? (
          <PaymentList
            paymentMethodId={paymentMethodId}
            paymentMethods={paymentMethods}
            handleSetPaymentMethod={handleSetPaymentMethod}
          />
        ) : tab === 1 && onlinePayment ? (
          <PaymentCreditCard />
        ) : tab === 1 && othersOnline ? (
          <PaymentOtherList
            paymentMethodId={paymentMethodId}
            paymentMethods={paymentMethods}
            handleSetPaymentMethod={handleSetPaymentMethod}
          />
        ) : (
          tab === 2 &&
          othersOnline && (
            <PaymentOtherList
              paymentMethodId={paymentMethodId}
              paymentMethods={paymentMethods}
              handleSetPaymentMethod={handleSetPaymentMethod}
            />
          )
        )}
      </div>
    </>
  );
}
