import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ShipmentAddressList from './ShipmentAddressList';
import { Address } from 'src/types/address';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
});

interface ShipmentAddressesProps {
  addresses: Address[];
}

const ShipmentAddresses: React.FC<ShipmentAddressesProps> = ({ addresses }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ShipmentAddressList addresses={addresses} />
    </div>
  );
};

export default ShipmentAddresses;
