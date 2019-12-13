import React, { useState, Fragment, useContext } from 'react';
import { TextField, Grid } from '@material-ui/core';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import Loading from '../../loading/Loading';
import DialogFullscreenForm from '../../dialog/DialogFullscreenForm';
import { MessagingContext } from '../../messaging/Messaging';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { postalCodeSearch } from '../../../services/PostalCodeSearch';

const interval = 500;
let timer = null;

function AccountAddressesNew({ handleAddressSubmit, handleModalState, saving }) {
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [cepValidation, setCepValidation] = useState(false);
  const [cepValidationText, setCepValidationText] = useState('');
  const messaging = useContext(MessagingContext);

  function handleChangeCep(value) {
    setPostalCode(value);
    setCepValidation(false);
    setCepValidationText('');

    const newPostalCode = value.replace(/\D/g, '');

    clearTimeout(timer);

    if (newPostalCode.length === 0) return false;

    if (newPostalCode.length < 8) {
      setCepValidation(false);
      setCepValidationText('CEP inválido');
    }

    if (newPostalCode.length === 8)
      timer = setTimeout(() => {
        setLoading(true);
        postalCodeSearch(newPostalCode)
          .then(response => {
            if (response.data.erro) {
              setCepValidationText('CEP inexistente');
              setCepValidation(false);
            } else {
              const { data } = response;
              setAddress(data.logradouro);
              setDistrict(data.bairro);
              setRegion(data.uf);
              setCity(data.localidade);
              setComplement(data.complemento);
              setCepValidation(true);
              setCepValidationText('');
            }
          })
          .catch(err => {
            setCepValidation(false);
            if (err.response) {
              alert(err.response.data.erro);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }, interval);
  }

  async function handleSubmit() {
    if (!cepValidation) {
      throw new Error('CEP inválido');
    }

    const data = {
      address,
      number,
      complement,
      district,
      region,
      city,
      postal_code: postalCode,
    };

    try {
      await handleAddressSubmit(data);
    } catch (err) {
      if (err.response) {
        messaging.handleOpen(err.response.data.error);
      }
      throw new Error(err);
    }
  }

  return (
    <DialogFullscreenForm
      title="Adicionar endereço"
      handleModalState={handleModalState}
      handleSubmit={handleSubmit}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
    >
      <Grid item xs={12} xl={3} md={5} lg={4}>
        {loading && <Loading />}
        <TextField
          label="CEP"
          placeholder="Digite o CEP"
          margin="normal"
          fullWidth
          value={postalCode}
          onChange={event => handleChangeCep(event.target.value)}
          helperText={cepValidationText}
          error={!cepValidation && cepValidationText !== ''}
          InputProps={{
            inputComponent: PostalCodeInput,
          }}
          required
          autoFocus
        />
        {cepValidation && (
          <Fragment>
            <TextField
              label="Endereço"
              placeholder="Digite o endereço"
              margin="normal"
              fullWidth
              value={address}
              onChange={event => setAddress(event.target.value)}
              required
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
          </Fragment>
        )}
      </Grid>
    </DialogFullscreenForm>
  );
}

AccountAddressesNew.propTypes = {
  handleAddressSubmit: PropTypes.func.isRequired,
  handleModalState: PropTypes.func.isRequired,
  customerId: PropTypes.number.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default AccountAddressesNew;
