import React, { useState, useContext, useEffect } from 'react';
import ShipmentAddressesList from './ShipmentAddressesList';
import PropTypes from 'prop-types';
import Loading from 'src/components/loading/Loading';
import AccountAddressesNew from 'src/components/account/addresses/AccountAddressesNew';
import AccountAddressesEdit from 'src/components/account/addresses/AccountAddressesEdit';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from 'src/store/redux/modules/user/actions';
import { setShipmentAddress, setCustomerCollect } from 'src/store/redux/modules/order/actions';
import { MessagingContext } from 'src/components/messaging/Messaging';
import { api } from 'src/services/api';
import DialogDelete from 'src/components/dialog/delete/DialogDelete';
import { Grid, Button } from '@material-ui/core';
import { CheckoutContext } from '../../Checkout';
import { AppContext } from 'src/App';

Shipment.propTypes = {
  addresses: PropTypes.array.isRequired,
};

export default function Shipment({ addresses }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const messaging = useContext(MessagingContext);
  const checkout = useContext(CheckoutContext);
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);
  const app = useContext(AppContext);
  const { customer } = useSelector(state => state.user);
  const order = useSelector(state => state.order);

  useEffect(() => {
    app.handleCartVisibility(false);
  }, []);

  useEffect(() => {
    if (customer) {
      if (customer.addresses.length === 0) setDialogNewAddress(true);
      if (customer.addresses.length === 0) dispatch(setShipmentAddress({}));
    }
  }, [customer.addresses]);

  async function handleAddressSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api().post('/customerAddresses', address);
      setSavingAddress(false);
      dispatch(setShipmentAddress(response.data));
      dispatch(addCustomerAddress(response.data));
      checkout.handleSetStep(2);
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
      setSavingAddress(false);
    }
  }

  async function handleAddressUpdateSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api().put(`/customerAddresses/${selectedAddress.id}`, address);
      setSavingAddress(false);
      dispatch(updateCustomerAddress(response.data));
      dispatch(setShipmentAddress(response.data));
    } catch (err) {
      setSavingAddress(false);
      if (err.response) messaging.handleOpen(err.response.data.error);
    }
  }

  function handleDeleteAddress(address) {
    setDialogDeleteAddress(true);
    setSelectedAddress(address);
  }

  function handleConfirmDelete(addressId) {
    setSaving(true);
    api()
      .delete(`/customerAddresses/${selectedAddress.id}`)
      .then(() => {
        messaging.handleOpen('Excluído');
        dispatch(deleteCustomerAddress(selectedAddress.id));
        if (order.shipmentAddress.id === selectedAddress.id) dispatch(setShipmentAddress({}));
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleDialogNewAddress() {
    setDialogNewAddress(!dialogNewAddress);
  }

  function handleDialogEditAddress(address) {
    setSelectedAddress(address);
    setDialogEditAddress(true);
  }

  function handleSelectAddress(address) {
    dispatch(setShipmentAddress(address));
    checkout.handleStepNext();
  }

  function handleSetCustomerCollect() {
    dispatch(setCustomerCollect());
    checkout.handleSetStep(2);
  }

  return (
    <>
      {saving && <Loading background="rgba(255, 255, 255, 0.5)" />}
      {dialogNewAddress && (
        <AccountAddressesNew
          handleAddressSubmit={handleAddressSubmit}
          handleModalState={savingAddress ? () => {} : handleDialogNewAddress}
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
      {dialogDeleteAddress && (
        <DialogDelete
          title="Excluir endereço"
          message="Deseja realmente excluir esse endereço?"
          onExited={() => setDialogDeleteAddress(false)}
          handleDelete={handleConfirmDelete}
          buttonText="Sim, excluir"
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <ShipmentAddressesList
            addresses={addresses}
            handleDialogEditAddress={handleDialogEditAddress}
            handleDialogNewAddress={handleDialogNewAddress}
            handleDeleteAddress={handleDeleteAddress}
            handleSelectAddress={handleSelectAddress}
          />
          <Button variant="contained" color="primary" onClick={handleSetCustomerCollect}>
            Quero Retirar
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
