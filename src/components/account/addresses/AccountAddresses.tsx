import React, { useState } from 'react';
import AccountAddressesEdit from './AccountAddressEdit';
import { api } from '../../../services/api';
import { useDispatch } from 'react-redux';
import {
  addCustomerAddress,
  updateCustomerAddress,
  setMainCustomerAddress,
} from '../../../store/redux/modules/user/actions';
import { useMessaging } from 'src/hooks/messaging';
import NewAddressPlacesApi from './places-api/NewAddress';
import { Address } from 'src/types/address';
import { AxiosError } from 'axios';
import AccountAddressesMenu from './AccountAddressesMenu';
import { AccountAddressesProvider } from './hooks/useAccountAddresses';
import AccountAddressList from './AccountAddressList';

interface AccountAddressProps {
  addresses: Address[];
  handleDeleteAddress(address: Address): void;
}

const AccountAddresses: React.FC<AccountAddressProps> = ({ addresses, handleDeleteAddress }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [dialogNewAddress, setDialogNewAddress] = useState(false);
  const [dialogEditAddress, setDialogEditAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const messaging = useMessaging();
  const dispatch = useDispatch();

  function handleMoreClick(event, address) {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(address);
    event.stopPropagation();
  }

  function handleDialogNewAddress() {
    setDialogNewAddress(!dialogNewAddress);
  }

  function handleDialogEditAddress(addressId: number) {
    const _address = addresses.find(address => address.id === addressId);

    if (!_address) return;

    setSelectedAddress(_address);
    setDialogEditAddress(true);
  }

  async function handleAddressSubmit(address: Address) {
    try {
      setSavingAddress(true);
      const response = await api.post('/customerAddresses', address);
      dispatch(addCustomerAddress(response.data));
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) throw new Error(error.response.data.error);
      else throw new Error('Não foi possível salvar');
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleAddressUpdateSubmit(address: Address) {
    try {
      setSavingAddress(true);
      const response = await api.put(`/customerAddresses/${selectedAddress?.id}`, address);
      dispatch(updateCustomerAddress(response.data));
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) messaging.handleOpen(error.response.data.error);
      else messaging.handleOpen('Não foi possível salvar');
    } finally {
      setSavingAddress(false);
    }
  }

  function handleUpdateIsMainAddress() {
    if (!selectedAddress) return;

    api
      .put(`customer/addresses/main/${selectedAddress.id}`)
      .then(() => dispatch(setMainCustomerAddress(selectedAddress.id)))
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      });
  }

  return (
    <AccountAddressesProvider
      value={{ selectedAddress, handleDialogEditAddress, handleDialogNewAddress, handleMoreClick }}
    >
      {dialogNewAddress && (
        <NewAddressPlacesApi
          handleAddressSubmit={handleAddressSubmit}
          onExited={handleDialogNewAddress}
          saving={savingAddress}
        />
      )}

      {dialogEditAddress && selectedAddress && (
        <AccountAddressesEdit
          handleAddressUpdateSubmit={handleAddressUpdateSubmit}
          selectedAddress={selectedAddress}
          handleModalState={() => setDialogEditAddress(false)}
          saving={savingAddress}
        />
      )}

      {selectedAddress && (
        <AccountAddressesMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleDeleteAddress={handleDeleteAddress}
          handleUpdateIsMainAddress={handleUpdateIsMainAddress}
          selectedAddress={selectedAddress}
        />
      )}

      <AccountAddressList addresses={addresses} />
    </AccountAddressesProvider>
  );
};

export default AccountAddresses;
