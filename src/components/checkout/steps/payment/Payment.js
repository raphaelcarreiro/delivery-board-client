import React, { useState, useEffect, useContext } from 'react';
import PaymentList from './PaymentList';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'src/App';

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

  useEffect(() => {
    if (!app.isMobile && app.windowWidth >= 960) app.handleCartVisibility(true);
  }, []);

  function handleTabChange(event, value) {
    setTab(value);
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
      </div>
    </>
  );
}
