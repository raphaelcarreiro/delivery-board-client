import React, { useState, Fragment, useContext } from 'react';
import { TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import Loading from '../../loading/Loading';
import { MessagingContext } from '../../messaging/Messaging';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { postalCodeSearch } from 'src/services/postalCodeSearch';
import CustomDialogForm from 'src/components/dialog/CustomDialogForm';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
    padding: 15,
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      marginBottom: 72,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.6)',
  },
}));

const interval = 500;
let timer = null;

function AccountAddressesNew({ handleAddressSubmit, handleModalState, saving }) {
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant.addresses.find(address => address.is_main);

  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState(mainAddress.city);
  const [region, setRegion] = useState(mainAddress.region);
  const [cepValidation, setCepValidation] = useState(!restaurant.configs.use_postalcode);
  const [cepValidationText, setCepValidationText] = useState('');
  const messaging = useContext(MessagingContext);
  const classes = useStyles();

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
      postal_code: restaurant.configs.use_postalcode ? postalCode : '00000-000',
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
    <CustomDialogForm
      title="Adicionar endereço"
      handleModalState={handleModalState}
      handleSubmit={handleSubmit}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
    >
      {saving && (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )}
      {restaurant.configs.use_postalcode && (
        <Grid item xs={12} xl={3} md={5} lg={3}>
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
        </Grid>
      )}
      <Grid item xs={12} xl={6} lg={6} md={8}>
        {cepValidation && (
          <div className={classes.form}>
            <div>
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
            </div>
            <div className={classes.actions}>
              <Button size="large" disabled={saving} type="submit" variant="contained" color="primary">
                Confirmar endereço
              </Button>
            </div>
          </div>
        )}
      </Grid>
    </CustomDialogForm>
  );
}

AccountAddressesNew.propTypes = {
  handleAddressSubmit: PropTypes.func.isRequired,
  handleModalState: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default AccountAddressesNew;
