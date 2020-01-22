import React, { Fragment, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, List, Typography, Menu, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import PropTypes from 'prop-types';
import AccountAddressesNew from './AccountAddressesNew';
import AccountAddressesEdit from './AccountAddressesEdit';
import { api } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingContext } from '../../messaging/Messaging';
import {
  addCustomerAddress,
  updateCustomerAddress,
  setMainCustomerAddress,
} from '../../../store/redux/modules/user/actions';
import Loading from 'src/components/loading/Loading';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'block',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
  },
  listItemNewAddress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
    border: `2px dashed ${theme.palette.primary.main}`,
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  address: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: 260,
    },
  },
}));

function AccountAddresses({ addresses, handleDeleteAddress }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const messaging = useContext(MessagingContext);
  const classes = useStyles();
  const dispatch = useDispatch();

  function handleMoreClick(event, address) {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(address);
    event.stopPropagation();
  }

  function handleDialogNewAddress() {
    setDialogNewAddress(!dialogNewAddress);
  }

  function handleDialogEditAddress(addressId) {
    setSelectedAddress(addresses.find(address => address.id === addressId));
    setDialogEditAddress(true);
  }

  async function handleAddressSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api().post('/customerAddresses', address);
      dispatch(addCustomerAddress(response.data));
      messaging.handleOpen('Endereço incluído');
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleAddressUpdateSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api().put(`/customerAddresses/${selectedAddress.id}`, address);
      dispatch(updateCustomerAddress(response.data));
      messaging.handleOpen('Endereço incluído');
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
    } finally {
      setSavingAddress(false);
    }
  }

  function handleUpdateIsMainAddress() {
    setSaving(true);

    api()
      .put(`customer/addresses/main/${selectedAddress.id}`)
      .then(() => {
        dispatch(setMainCustomerAddress(selectedAddress.id));
        messaging.handleOpen('Atualizado');
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <Fragment>
      {saving && <Loading background="rgba(255, 255, 255, 0.5)" />}
      {dialogNewAddress && (
        <AccountAddressesNew
          handleAddressSubmit={handleAddressSubmit}
          handleModalState={handleDialogNewAddress}
          saving={savingAddress}
        />
      )}
      {dialogEditAddress && (
        <AccountAddressesEdit
          handleAddressUpdateSubmit={handleAddressUpdateSubmit}
          selectedAddress={selectedAddress}
          handleModalState={() => setDialogEditAddress(false)}
          saving={savingAddress}
        />
      )}
      <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} open={Boolean(anchorEl)}>
        {!selectedAddress.is_main && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleUpdateIsMainAddress(selectedAddress.id);
            }}
          >
            Marcar como principal
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDeleteAddress(selectedAddress);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
      <List className={classes.list} disablePadding>
        {addresses.map(address => (
          <ListItem
            button
            onClick={() => handleDialogEditAddress(address.id)}
            className={classes.listItem}
            key={address.id}
          >
            <Typography variant="h6" className={classes.address}>
              {address.address}, {address.number}
            </Typography>
            <Typography color="textSecondary">{address.district}</Typography>
            <Typography color="textSecondary">
              {address.city}, {address.region}
            </Typography>
            <Typography color="textSecondary">{address.postal_code}</Typography>
            <IconButton className={classes.iconButton} onClick={event => handleMoreClick(event, address)}>
              <MoreVertIcon />
            </IconButton>
            {address.is_main && (
              <div className={classes.starIcon}>
                <Tooltip title="Endereço principal">
                  <StarIcon color="primary" />
                </Tooltip>
              </div>
            )}
          </ListItem>
        ))}
        <ListItem button className={classes.listItemNewAddress} onClick={handleDialogNewAddress}>
          <Typography variant="h6" color="primary">
            Adicionar endereço
          </Typography>
        </ListItem>
      </List>
    </Fragment>
  );
}

AccountAddresses.propTypes = {
  handleDeleteAddress: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
};

export default AccountAddresses;
