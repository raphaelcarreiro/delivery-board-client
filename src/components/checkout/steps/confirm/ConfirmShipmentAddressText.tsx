import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'src/store/redux/selector';

const ConfirmShipmentAddressText: React.FC = () => {
  const order = useSelector(state => state.order);

  return (
    <Typography>
      {`${order.shipment.address}, ${order.shipment.number}, ${order.shipment.district}${
        order.shipment.complement ? `, ${order.shipment.complement}` : ''
      }${order.shipment.postal_code !== '00000000' && `, ${order.shipment.postal_code}`}`}
    </Typography>
  );
};

export default ConfirmShipmentAddressText;
