import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'src/store/redux/selector';

const ConfirmShipmentAddressText: React.FC = () => {
  const order = useSelector(state => state.order);

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
    <Typography>{`${getFormattedAddressNumberDistrict()}${getFormattedComplement()}${getformattedPostalCode()}`}</Typography>
  );
};

export default ConfirmShipmentAddressText;
