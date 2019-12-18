import React, { useState, useContext } from 'react';
import ShipmentAddressesList from './ShipmentAddressesList';
import PropTypes from 'prop-types';
import Loading from 'src/components/loading/Loading';
import AccountAddressesNew from 'src/components/account/addresses/AccountAddressesNew';
import AccountAddressesEdit from 'src/components/account/addresses/AccountAddressesEdit';
import { useDispatch } from 'react-redux';
import { addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from 'src/store/redux/modules/user/actions';
import { MessagingContext } from 'src/components/messaging/Messaging';
import { api } from 'src/services/api';
import DialogDelete from 'src/components/dialog/delete/DialogDelete';

Shipment.propTypes = {
  addresses: PropTypes.array.isRequired,
};

export default function Shipment({ addresses }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const messaging = useContext(MessagingContext);
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);

  async function handleAddressSubmit(address) {
    try {
      setSaving(true);
      const response = await api().post('/customerAddresses', address);
      dispatch(addCustomerAddress(response.data));
      messaging.handleOpen('Endereço incluído');
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddressUpdateSubmit(address) {
    try {
      setSaving(true);
      const response = await api().put(`/customerAddresses/${selectedAddress.id}`, address);
      dispatch(updateCustomerAddress(response.data));
      messaging.handleOpen('Endereço incluído');
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
    } finally {
      setSaving(false);
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

  function handleDialogEditAddress(addressId) {
    setSelectedAddress(addresses.find(address => address.id === addressId));
    setDialogEditAddress(true);
  }

  return (
    <>
      {saving && <Loading background="rgba(255, 255, 255, 0.5)" />}
      {dialogNewAddress && (
        <AccountAddressesNew
          handleAddressSubmit={handleAddressSubmit}
          handleModalState={handleDialogNewAddress}
          saving={saving}
        />
      )}
      {dialogEditAddress && (
        <AccountAddressesEdit
          handleAddressUpdateSubmit={handleAddressUpdateSubmit}
          selectedAddress={selectedAddress}
          handleModalState={() => setDialogEditAddress(false)}
          saving={saving}
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
      <ShipmentAddressesList
        addresses={addresses}
        handleDialogEditAddress={() => handleDialogEditAddress(true)}
        handleDialogNewAddress={() => handleDialogNewAddress(true)}
        handleDeleteAddress={handleDeleteAddress}
        selectAddress={() => {}}
      />
    </>
  );
}
