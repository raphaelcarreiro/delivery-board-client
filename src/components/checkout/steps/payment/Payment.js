import React, { useState, useEffect, useContext } from 'react';
import PaymentList from './PaymentList';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';
import PaymentCreditCard from './PaymentCreditCard';
import { useDispatch, useSelector } from 'react-redux';
import { orderChange, setChange } from 'src/store/redux/modules/order/actions';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 15,
  },
}));

Payment.propTypes = {
  handleSetPaymentMethod: PropTypes.func.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  paymentMethodId: PropTypes.number.isRequired,
};

export default function Payment({ handleSetPaymentMethod, paymentMethods, paymentMethodId }) {
  const [tab, setTab] = useState(0);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const classes = useStyles();
  const app = useContext(AppContext);
  const order = useSelector(state => state.order);

  useEffect(() => {
    if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
    const online = paymentMethods.find(method => method.kind === 'online_payment');
    setOnlinePayment(!!online);
    if (online) if (online.id === paymentMethodId) setTab(1);
  }, [paymentMethods]);

  function handleTabChange(event, value) {
    setTab(value);
    app.handleCartVisibility(false);
    if (value === 0) {
      if (order.change > 0) handleSetPaymentMethod(paymentMethods.find(method => method.kind === 'money'));
      else handleSetPaymentMethod(paymentMethods[0]);
    }
    if (value === 1) {
      handleSetPaymentMethod(paymentMethods.find(method => method.kind === 'online_payment'));
    }
  }

  return (
    <>
      <Tabs textColor="primary" indicatorColor="primary" value={tab} onChange={handleTabChange}>
        <Tab label="Pague na entrega" />
        {onlinePayment && <Tab label="Pague online" />}
      </Tabs>
      <div className={classes.container}>
        {tab === 0 && paymentMethods && (
          <PaymentList
            paymentMethodId={paymentMethodId}
            paymentMethods={paymentMethods}
            handleSetPaymentMethod={handleSetPaymentMethod}
          />
        )}
        {tab === 1 && <PaymentCreditCard />}
      </div>
    </>
  );
}
