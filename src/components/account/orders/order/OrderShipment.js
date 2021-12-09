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

  function getformattedPostalCode() {
    return order.shipment.postal_code !== '00000000' ? `, ${order.shipment.postal_code}` : '';
  }

  function getFormattedComplement() {
    return order.shipment.complement ? `, ${order.shipment.complement}` : '';
  }

  function getFormattedAddressNumberDistrict() {
    return `${order.shipment.address}, ${order.shipment.number}, ${order.shipment.district}`;
  }

  return (
    <>
      <Typography
        gutterBottom
        variant="h6"
      >{`${getFormattedAddressNumberDistrict()}${getFormattedComplement()}${getformattedPostalCode()}`}</Typography>
      {order.shipment.scheduled_at && (
        <Typography variant="body2" className={classes.scheduleAt}>
          <WatchLaterIcon /> agendado para {order.shipment.formattedScheduledAt}
        </Typography>
      )}
    </>
  );
}
