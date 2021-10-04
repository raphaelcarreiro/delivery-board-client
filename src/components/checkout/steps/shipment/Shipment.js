import React, { useState, useEffect } from 'react';
import ShipmentAddressesList from './ShipmentAddressesList';
import PropTypes from 'prop-types';
import Loading from 'src/components/loading/Loading';
import AccountAddressesNew from 'src/components/account/addresses/AccountAddressNew';
import AccountAddressesEdit from 'src/components/account/addresses/AccountAddressEdit';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from 'src/store/redux/modules/user/actions';
import { setShipmentAddress } from 'src/store/redux/modules/order/actions';
import { api } from 'src/services/api';
import DialogDelete from 'src/components/dialog/delete/DialogDelete';
import { Grid } from '@material-ui/core';
import { useMessaging } from 'src/hooks/messaging';
import { useApp } from 'src/hooks/app';
import { useCheckout } from '../../hooks/useCheckout';

Shipment.propTypes = {
  addresses: PropTypes.array.isRequired,
};

export default function Shipment({ addresses }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const messaging = useMessaging();
  const checkout = useCheckout();
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);
  const app = useApp();
  const { customer } = useSelector(state => state.user);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (order.shipment)
      if (!order.shipment.id)
        if (customer.addresses.length > 0) {
          const shipmentAddress = customer.addresses.find(address => address.is_main);
          if (restaurant.configs.tax_mode === 'district')
            if (shipmentAddress.area_region) dispatch(setShipmentAddress(shipmentAddress));
        }
  }, [app, customer.addresses, dispatch, order, restaurant]);

  useEffect(() => {
    if (customer)
      if (customer.addresses)
        if (customer.addresses.length === 0) {
          setDialogNewAddress(true);
          dispatch(setShipmentAddress({}));
        }
  }, [customer, dispatch]);

  async function handleAddressSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api.post('/customerAddresses', address);
      setSavingAddress(false);
      const newAddress = response.data;
      dispatch(addCustomerAddress(newAddress));

      if (checkout.area && checkout.area.max_distance) {
        if (newAddress.distance === null) {
          messaging.handleOpen('Não é possível entregar nesse endereço');
          return;
        }

        if (newAddress.distance > checkout.area.max_distance) {
          messaging.handleOpen('Não entregamos nesse endereço');
          return;
        }
      }
      dispatch(setShipmentAddress(newAddress));

      checkout.handleSetStepById('STEP_PAYMENT');
    } catch (err) {
      if (err.response) messaging.handleOpen(err.response.data.error);
      setSavingAddress(false);
    }
  }

  async function handleAddressUpdateSubmit(address) {
    try {
      setSavingAddress(true);
      const response = await api.put(`/customerAddresses/${selectedAddress.id}`, address);
      setSavingAddress(false);
      const updatedAddress = response.data;
      dispatch(updateCustomerAddress(updatedAddress));

      if (checkout.area && checkout.area.max_distance) {
        if (updatedAddress.distance === null) {
          messaging.handleOpen('Não é possível entregar nesse endereço');
          return;
        }

        if (updatedAddress.distance > checkout.area.max_distance) {
          messaging.handleOpen('Não entregamos nesse endereço');
          return;
        }
      }

      dispatch(setShipmentAddress(updatedAddress));
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
    api
      .delete(`/customerAddresses/${selectedAddress.id}`)
      .then(() => {
        dispatch(deleteCustomerAddress(selectedAddress.id));
        if (order.shipment.id === selectedAddress.id) {
          dispatch(setShipmentAddress({}));
        }
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
    if (restaurant.configs.tax_mode === 'district' && !address.area_region) {
      setSelectedAddress(address);
      setDialogEditAddress(true);
      messaging.handleOpen('Por favor, atualize o bairro');
      return;
    }

    if (checkout.area && checkout.area.max_distance) {
      if (address.distance === null) {
        messaging.handleOpen('Não é possível entregar nesse endereço');
        return;
      }

      if (address.distance > checkout.area.max_distance) {
        messaging.handleOpen('Não entregamos nesse endereço');
        return;
      }
    }

    dispatch(setShipmentAddress(address));
    checkout.handleSetStepById('STEP_PAYMENT');
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
        </Grid>
      </Grid>
    </>
  );
}
