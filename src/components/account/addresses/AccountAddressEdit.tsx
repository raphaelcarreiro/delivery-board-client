import React, { useState } from 'react';
import { TextField, Grid } from '@material-ui/core';
import AccountAddressesAction from './AccountAddressesAction';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import { useMessaging } from 'src/hooks/messaging';
import { Address } from 'src/types/address';
import { useSelector } from 'src/store/redux/selector';
import { useAddressValidation } from './validation/useAddressValidation';
import { AxiosError } from 'axios';
import AddressForm from './AddressForm';
import InsideSaving from 'src/components/loading/InsideSaving';
import Modal from 'src/components/modal/Modal';

interface AccountAddressEditProps {
  handleAddressUpdateSubmit(address: Address): Promise<void>;
  handleModalState(): void;
  saving: boolean;
  selectedAddress: Address;
}

const AccountAddressEdit: React.FC<AccountAddressEditProps> = ({
  handleAddressUpdateSubmit,
  handleModalState,
  saving,
  selectedAddress,
}) => {
  const messaging = useMessaging();
  const restaurant = useSelector(state => state.restaurant);
  const [address, setAddress] = useState<Address>(selectedAddress);
  const [validation, setValidation, validate] = useAddressValidation();

  function handleChange(index: keyof Address, value: any) {
    setAddress(state => ({ ...state, [index]: value }));
  }

  async function handleValidation(handleModalClose: () => void) {
    setValidation({});

    validate(address)
      .then(() => handleSubmit(handleModalClose))
      .catch(err => console.error(err));
  }

  function handleSubmit(handleModalClose: () => void) {
    handleAddressUpdateSubmit(address)
      .then(handleModalClose)
      .catch(err => {
        const error = err as AxiosError;
        if (error.response) messaging.handleOpen(error.response.data.error);
      });
  }

  return (
    <Modal
      title="atualizar endereço"
      onExited={handleModalState}
      componentActions={<AccountAddressesAction handleValidation={handleValidation} saving={saving} />}
      maxWidth="sm"
      height="80vh"
    >
      {saving && <InsideSaving />}

      <AddressForm validation={validation} handleChange={handleChange} address={address} />
    </Modal>
  );
};

export default AccountAddressEdit;
