import React, { useState, useContext, useEffect } from 'react';
import ShipmentAddressesList from './ShipmentAddressesList';
import PropTypes from 'prop-types';
import Loading from 'src/components/loading/Loading';
import AccountAddressesNew from 'src/components/account/addresses/AccountAddressesNew';
import AccountAddressesEdit from 'src/components/account/addresses/AccountAddressesEdit';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from 'src/store/redux/modules/user/actions';
import { setShipmentAddress } from 'src/store/redux/modules/order/actions';
import { MessagingContext } from 'src/components/messaging/Messaging';
import { api } from 'src/services/api';
import DialogDelete from 'src/components/dialog/delete/DialogDelete';
import { Grid } from '@material-ui/core';
import { CheckoutContext } from '../../Checkout';
import { AppContext } from 'src/App';

Shipment.propTypes = {
  addresses: PropTypes.array.isRequired,
};

export default function Shipment({ addresses }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const messaging = useContext(MessagingContext);
  const checkout = useContext(CheckoutContext);
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);
  const app = useContext(AppContext);
  const user = useSelector(state => state.user);

  useEffect(() => {
    app.handleCartVisibility(false);
  }, []);

  async function handleAddressSubmit(address) {
    try {
      setSaving(true);
      // é necessário enviar o customer_id caso o usuário seja do tipo guest
      const data = {
        customer_id: user.customer.id,
        ...address,
      };

      const response = await api().post('/customerAddresses', data);
      dispatch(setShipmentAddress(response.data));
      dispatch(addCustomerAddress(response.data));
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
      dispatch(setShipmentAddress(response.data));
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

  function handleDialogEditAddress(address) {
    setSelectedAddress(address);
    setDialogEditAddress(true);
  }

  function handleSelectAddress(address) {
    dispatch(setShipmentAddress(address));
    checkout.handleStepNext();
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
      <Grid container>
        <Grid item xs={12}>
          <ShipmentAddressesList
            addresses={addresses}
            handleDialogEditAddress={handleDialogEditAddress}
            handleDialogNewAddress={handleDialogNewAddress}
            handleDeleteAddress={handleDeleteAddress}
            handleSelectAddress={handleSelectAddress}
          />
        </Grid>
      </Grid>
    </>
  );
}
