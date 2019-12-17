import React from 'react';
import ShipmentAddressesList from './ShipmentAddressesList';
import PropTypes from 'prop-types';

Shipment.propTypes = {
  addresses: PropTypes.array.isRequired,
};

export default function Shipment({ addresses }) {
  return <ShipmentAddressesList addresses={addresses} />;
}
