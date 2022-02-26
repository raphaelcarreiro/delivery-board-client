import React, { useState, useEffect } from 'react';
import Loading from 'src/components/loading/Loading';
import AccountAddressNew from 'src/components/account/addresses/registration/new/AccountAddressNew';
import NewAddressGoogleAPI from 'src/components/account/addresses/registration/places-api/new/NewAddress';
import EditAddressGoogleAPI from 'src/components/account/addresses/registration/places-api/edit/EditAddress';
import { useDispatch } from 'react-redux';
import { addCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from 'src/store/redux/modules/user/actions';
import { setShipmentAddress } from 'src/store/redux/modules/order/actions';
import { api } from 'src/services/api';
import DialogDelete from 'src/components/dialog/delete/DialogDelete';
import { useMessaging } from 'src/providers/MessageProvider';
import { useCheckout } from '../../hooks/useCheckout';
import { Address } from 'src/types/address';
import { useSelector } from 'src/store/redux/selector';
import { AxiosError } from 'axios';
import ShipmentAddresses from './ShipmentAddresses';
import { ShipmentProvider } from './hook/useCheckoutShipment';
import GoogleMapsProvider from 'src/providers/google-maps/MapProvider';
import AccountAddressEdit from 'src/components/account/addresses/registration/edit/AccountAddressEdit';

interface ShipmentProps {
  addresses: Address[];
}

const Shipment: React.FC<ShipmentProps> = ({ addresses }) => {
  const dispatch = useDispatch();
  const checkout = useCheckout();
  const messaging = useMessaging();
  const { customer } = useSelector(state => state.user);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);

  useEffect(() => {
    if (customer.addresses.length) {
      return;
    }

    setDialogNewAddress(true);
    dispatch(setShipmentAddress({}));
  }, [customer, dispatch]);

  async function handleAddressSubmit(address: Address) {
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
      const error = err as AxiosError;
      messaging.handleOpen(error.response ? error.response.data.error : 'Não foi possível salvar');
      setSavingAddress(false);
    }
  }

  async function handleAddressUpdateSubmit(address: Address) {
    try {
      setSavingAddress(true);
      const response = await api.put(`/customerAddresses/${selectedAddress?.id}`, address);
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
      const error = err as AxiosError;
      messaging.handleOpen(error.response ? error.response.data.error : 'Não foi possível salvar');
    }
  }

  function handleConfirmDelete() {
    setSaving(true);
    api
      .delete(`/customerAddresses/${selectedAddress?.id}`)
      .then(() => {
        dispatch(deleteCustomerAddress(selectedAddress?.id as number));
        if (order.shipment.id === selectedAddress?.id) {
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

  function handleSelectAddress(address: Address) {
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

    if ((!address.latitude || !address.longitude) && restaurant?.configs.use_google_map_addresses) {
      messaging.handleOpen('Seu endereço precisa ser atualizado');
      setSelectedAddress(address);
      setDialogEditAddress(true);
      return;
    }

    dispatch(setShipmentAddress(address));
    checkout.handleSetStepById('STEP_PAYMENT');
  }

  return (
    <GoogleMapsProvider>
      <ShipmentProvider
        value={{
          handleAddressSubmit,
          handleAddressUpdateSubmit,
          handleSelectAddress,
          selectedAddress,
          setDialogEditAddress,
          setDialogNewAddress,
          setSelectedAddress,
          setDialogDeleteAddress,
        }}
      >
        {saving && <Loading background="rgba(255, 255, 255, 0.5)" />}

        {dialogNewAddress && restaurant?.configs.use_google_map_addresses && (
          <NewAddressGoogleAPI
            handleAddressSubmit={handleAddressSubmit}
            onExited={() => setDialogNewAddress(false)}
            saving={savingAddress}
          />
        )}

        {dialogNewAddress && !restaurant?.configs.use_google_map_addresses && (
          <AccountAddressNew
            handleAddressSubmit={handleAddressSubmit}
            onExited={() => setDialogNewAddress(false)}
            saving={savingAddress}
          />
        )}

        {dialogEditAddress && selectedAddress && restaurant?.configs.use_google_map_addresses && (
          <EditAddressGoogleAPI
            handleAddressUpdateSubmit={handleAddressUpdateSubmit}
            selectedAddress={selectedAddress}
            onExited={() => setDialogEditAddress(false)}
            saving={savingAddress}
          />
        )}

        {dialogEditAddress && selectedAddress && !restaurant?.configs.use_google_map_addresses && (
          <AccountAddressEdit
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

        <ShipmentAddresses addresses={addresses} />
      </ShipmentProvider>
    </GoogleMapsProvider>
  );
};

export default Shipment;
