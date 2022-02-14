import React, { useState } from 'react';
import { List, ListItem, Typography, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Address } from 'src/types/address';
import { useShipment } from './hook/useCheckoutShipment';
import ShipmentAddressItem from './ShipmentAddressItem';

const useStyles = makeStyles(theme => ({
  listItemNewAddress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 165,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.primary.main}`,
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridGap: 10,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface ShipmentAddressListProps {
  addresses: Address[];
}

const ShipmentAddressList: React.FC<ShipmentAddressListProps> = ({ addresses }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { setDialogDeleteAddress, setDialogEditAddress, setDialogNewAddress } = useShipment();

  function handleEditClick() {
    setAnchorEl(null);
    setDialogEditAddress(true);
  }

  function handleDeleteClick() {
    setAnchorEl(null);
    setDialogDeleteAddress(true);
  }

  function handleAddAddressClick() {
    setAnchorEl(null);
    setDialogNewAddress(true);
  }

  return (
    <div className={classes.container}>
      <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
        <MenuItem onClick={handleEditClick}>editar</MenuItem>
        <MenuItem onClick={handleDeleteClick}>excluir</MenuItem>
      </Menu>

      <List className={classes.list}>
        {addresses.map(address => (
          <ShipmentAddressItem setAnchorEl={setAnchorEl} address={address} key={address.id} />
        ))}

        <ListItem button className={classes.listItemNewAddress} onClick={handleAddAddressClick}>
          <Typography variant="h6" color="primary">
            adicionar endereço
          </Typography>
        </ListItem>
      </List>
    </div>
  );
};

export default ShipmentAddressList;
