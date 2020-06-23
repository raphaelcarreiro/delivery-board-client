import React, { useEffect, useState } from 'react';
import PaymentList from './PaymentList';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PaymentTabs from './PaymentTabs';
import PaymentOnlineList from './PaymentOnlineList';

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

export default function Payment({ paymentMethods, paymentMethodId }) {
  const classes = useStyles();
  const { configs } = useSelector(state => state.restaurant);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const paymentMethod = paymentMethods.find(method => method.id === paymentMethodId);

    if (paymentMethod && paymentMethod.mode === 'online') setTab(1);
  }, [paymentMethods, paymentMethodId]);

  useEffect(() => {
    if (configs.facebook_pixel_id) fbq('track', 'AddPaymentInfo');
  }, [configs.facebook_pixel_id]);

  function handleTabChange(event, tab) {
    setTab(tab);
  }

  return (
    <>
      <PaymentTabs handleTabChange={handleTabChange} tab={tab} />
      <div className={classes.container}>
        {tab === 0 ? (
          <PaymentList paymentMethodId={paymentMethodId} paymentMethods={paymentMethods} />
        ) : (
          <PaymentOnlineList paymentMethodId={paymentMethodId} paymentMethods={paymentMethods} />
        )}
      </div>
    </>
  );
}
