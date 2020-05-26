import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

OrderPayment.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderPayment({ order }) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Forma de pagamento
      </Typography>
      {order.payment_method.kind === 'online_payment' ? (
        <>
          <Typography>{order.payment_method.method}</Typography>
        </>
      ) : (
        <>
          <Typography>Pagamento na entrega</Typography>
          <Typography>
            {order.payment_method.method}
            {order.change > 0 && (
              <Typography
                color="textSecondary"
                display="inline"
                variant="body1"
              >{`, troco para ${order.formattedChange}`}</Typography>
            )}
          </Typography>
        </>
      )}
    </>
  );
}
