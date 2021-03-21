import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

const useStyles = makeStyles({
  scheduleAt: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    '& svg': {
      marginRight: 6,
    },
  },
});

OrderShipment.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function OrderShipment({ order }) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {order.shipment.shipment_method === 'delivery' ? 'endereço de entrega' : 'endereço para retirada'}
      </Typography>
      <Typography>
        {order.shipment.address}, {order.shipment.number}
      </Typography>
      <Typography>{order.shipment.district}</Typography>
      <Typography color="textSecondary">{order.shipment.complement}</Typography>
      <Typography color="textSecondary">
        {order.shipment.city} - {order.shipment.region}
      </Typography>
      {order.shipment.postal_code !== '00000000' && (
        <Typography color="textSecondary">{order.shipment.postal_code}</Typography>
      )}
      {order.shipment.scheduled_at && (
        <Typography variant="body2" className={classes.scheduleAt}>
          <WatchLaterIcon /> agendado para as {order.shipment.formattedScheduledAt}
        </Typography>
      )}
    </>
  );
}
