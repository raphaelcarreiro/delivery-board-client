import React, { useState, MouseEvent } from 'react';
import { api } from '../../../../services/api';
import { useDispatch } from 'react-redux';
import {
  addCustomerAddress,
  updateCustomerAddress,
  setMainCustomerAddress,
} from '../../../../store/redux/modules/user/actions';
import { useMessaging } from 'src/providers/MessageProvider';
import { Address } from 'src/types/address';
import { AxiosError } from 'axios';
import AccountAddressesMenu from './AccountAddressesMenu';
import { AccountAddressesProvider } from '../hooks/useAccountAddresses';
import AccountAddressList from './AccountAddressList';
import NewAddressPlacesAPI from '../registration/places-api/new/NewAddress';
import EditAddress from '../registration/places-api/edit/EditAddress';
import { useSelector } from 'src/store/redux/selector';
import AccountAddressNew from '../registration/new/AccountAddressNew';
import AccountAddressEdit from '../registration/edit/AccountAddressEdit';

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
  const restaurant = useSelector(state => state.restaurant);

  function handleMoreClick(event: MouseEvent<HTMLButtonElement>, address: Address) {
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
      {dialogNewAddress && restaurant?.configs.use_google_map_addresses && (
        <NewAddressPlacesAPI
          handleAddressSubmit={handleAddressSubmit}
          onExited={handleDialogNewAddress}
          saving={savingAddress}
        />
      )}

      {dialogNewAddress && !restaurant?.configs.use_google_map_addresses && (
        <AccountAddressNew
          handleAddressSubmit={handleAddressSubmit}
          onExited={handleDialogNewAddress}
          saving={savingAddress}
        />
      )}

      {dialogEditAddress && selectedAddress && restaurant?.configs.use_google_map_addresses && (
        <EditAddress
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
