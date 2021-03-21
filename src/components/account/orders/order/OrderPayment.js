import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';

OrderPayment.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderPayment({ order }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        forma de pagamento
      </Typography>
      {order.payment_method.mode === 'online' ? (
        <Typography>pagamento online </Typography>
      ) : (
        <Typography>pagamento na entrega</Typography>
      )}
      <div>
        <Typography display="inline">{order.payment_method.method}</Typography>
        {order.change > 0 && (
          <Typography
            color="textSecondary"
            display="inline"
            variant="body1"
          >{`, troco para ${order.formattedChange}`}</Typography>
        )}
        {order.picpay_payment && order.status === 'p' && (
          <div>
            <Link color="primary" variant="body1" href={order.picpay_payment.payment_url} target="blank">
              fazer pagamento
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
