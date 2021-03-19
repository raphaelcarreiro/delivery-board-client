import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PaymentTabs from './PaymentTabs';
import PaymentOnlineList from './list/PaymentOnlineList';
import PaymentList from './list/PaymentList';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 15,
  },
}));

Payment.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  paymentMethodId: PropTypes.number,
};

export default function Payment({ paymentMethods, paymentMethodId }) {
  const classes = useStyles();
  const { configs } = useSelector(state => state.restaurant);
  const online = useMemo(() => paymentMethods.some(method => method.mode === 'online'), [paymentMethods]);
  const offline = useMemo(() => paymentMethods.some(method => method.mode === 'offline'), [paymentMethods]);
  const [tab, setTab] = useState(offline ? 'offline' : 'online');

  useEffect(() => {
    const paymentMethod = paymentMethods.find(method => method.id === paymentMethodId);
    if (paymentMethod && paymentMethod.mode === 'online') setTab('online');
  }, [paymentMethods, paymentMethodId]);

  useEffect(() => {
    if (configs.facebook_pixel_id) fbq('track', 'AddPaymentInfo');
  }, [configs.facebook_pixel_id]);

  function handleTabChange(event, tab) {
    setTab(tab);
  }

  return (
    <>
      <PaymentTabs handleTabChange={handleTabChange} tab={tab} online={online} offline={offline} />
      <div className={classes.container}>
        {tab === 'offline' ? (
          <PaymentList paymentMethodId={paymentMethodId} paymentMethods={paymentMethods} />
        ) : (
          <PaymentOnlineList paymentMethodId={paymentMethodId} paymentMethods={paymentMethods} />
        )}
      </div>
    </>
  );
}
