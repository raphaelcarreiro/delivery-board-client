import React, { useState, useContext } from 'react';
import { TextField, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { MessagingContext } from '../../messaging/Messaging';
import DialogFullscreenForm from '../../dialog/DialogFullscreenForm';
import PostalCodeInput from '../../masked-input/PostalCodeInput';

function AccountAddressesEdit({ handleAddressUpdateSubmit, handleModalState, saving, selectedAddress }) {
  const [postalCode] = useState(selectedAddress.postal_code);
  const [address, setAddress] = useState(selectedAddress.address);
  const [number, setNumber] = useState(selectedAddress.number);
  const [complement, setComplement] = useState(
    selectedAddress.address_complement ? selectedAddress.address_complement : ''
  );
  const [district, setDistrict] = useState(selectedAddress.district);
  const [city] = useState(selectedAddress.city);
  const [region] = useState(selectedAddress.region);
  const messaging = useContext(MessagingContext);

  async function handleSubmit() {
    const data = {
      address,
      number,
      address_complement: complement,
      district,
      region,
      city,
      postal_code: postalCode,
    };

    try {
      await handleAddressUpdateSubmit(data);
    } catch (err) {
      if (err.response) {
        messaging.handleOpen(err.response.data.error);
      }
      throw new Error(err);
    }
  }

  return (
    <DialogFullscreenForm
      title="Atualizar endereço"
      handleModalState={handleModalState}
      handleSubmit={handleSubmit}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
    >
      <Grid item xs={12} xl={3} md={5} lg={4}>
        <TextField
          label="CEP"
          placeholder="Digite o CEP"
          margin="normal"
          fullWidth
          value={postalCode}
          InputProps={{
            inputComponent: PostalCodeInput,
          }}
          required
          disabled
        />
        <TextField
          label="Endereço"
          placeholder="Digite o endereço"
          margin="normal"
          fullWidth
          value={address}
          onChange={event => setAddress(event.target.value)}
          required
          autoFocus
        />
        <TextField
          label="Número"
          placeholder="Digite o número"
          margin="normal"
          fullWidth
          value={number}
          onChange={event => setNumber(event.target.value)}
          required
        />
        <TextField
          label="Bairro"
          placeholder="Digite o bairro"
          margin="normal"
          fullWidth
          value={district}
          onChange={event => setDistrict(event.target.value)}
          required
        />
        <TextField
          label="Complemento"
          placeholder="Digite o complemento"
          margin="normal"
          fullWidth
          value={complement}
          onChange={event => setComplement(event.target.value)}
        />
        <TextField
          label="Cidade"
          placeholder="Digite a cidade"
          margin="normal"
          fullWidth
          value={city}
          disabled
          required
        />
        <TextField
          label="Estado"
          placeholder="Digite o estado"
          margin="normal"
          fullWidth
          value={region}
          disabled
          required
        />
      </Grid>
    </DialogFullscreenForm>
  );
}

AccountAddressesEdit.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  selectedAddress: PropTypes.object.isRequired,
  handleAddressUpdateSubmit: PropTypes.func.isRequired,
};

export default AccountAddressesEdit;
