import React, { useState, useEffect, useContext } from 'react';
import PaymentList from './PaymentList';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';
import PaymentCreditCard from './PaymentCreditCard';
import { useDispatch } from 'react-redux';
import { orderChange } from 'src/store/redux/modules/order/actions';

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
  const classes = useStyles();
  const app = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
  }, []);

  function handleTabChange(event, value) {
    setTab(value);
    if (value === 0) {
      dispatch(orderChange('paymentType', 'delivery'));
    } else {
      dispatch(orderChange('paymentType', 'online'));
      app.handleCartVisibility(false);
    }
  }

  return (
    <>
      <Tabs textColor="primary" indicatorColor="primary" value={tab} onChange={handleTabChange}>
        <Tab label="Pague na entrega" />
        <Tab label="Pague online" />
      </Tabs>
      <div className={classes.container}>
        {tab === 0 && (
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
