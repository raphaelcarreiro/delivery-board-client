import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid } from '@material-ui/core';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import AccountAddressesAction from './AccountAddressesAction';
import { postalCodeSearch } from 'src/services/postalCodeSearch';
import { makeStyles } from '@material-ui/core/styles';
import { useMessaging } from 'src/providers/MessageProvider';
import { useAddressValidation } from './validation/useAddressValidation';
import { useSelector } from 'src/store/redux/selector';
import { Address } from 'src/types/address';
import { AxiosError } from 'axios';
import AddressForm from './AddressForm';
import InsideSaving from 'src/components/loading/InsideSaving';
import Modal from 'src/components/modal/Modal';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      marginBottom: 72,
    },
  },
}));

let timer;

interface AccountAddressNewProps {
  handleAddressSubmit(address: Address): Promise<void>;
  onExited(): void;
  saving: boolean;
}

const initialAddressValue: Address = {
  address: '',
  number: '',
  complement: null,
  city: '',
  region: '',
  district: '',
  distance: 0,
  distance_tax: 0,
  postal_code: '',
  is_main: false,
  id: 0,
  formattedDistanceTax: '',
  reference_point: null,
  latitude: null,
  longitude: null,
};

const AccountAddressNew: React.FC<AccountAddressNewProps> = ({ handleAddressSubmit, onExited, saving }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation, validate] = useAddressValidation();
  const restaurant = useSelector(state => state.restaurant);
  const messaging = useMessaging();
  const [postalCodeValidation, setPostalCodeValidation] = useState({
    error: false,
    message: '',
    hasData: false,
  });
  const inputRefNumber = useRef<HTMLInputElement>(null);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState<Address>(initialAddressValue);

  useEffect(() => {
    if (!postalCodeValidation.error && postalCodeValidation.hasData) inputRefNumber.current?.focus();
  }, [postalCodeValidation]); //eslint-disable-line

  function handleChange(index: keyof Address, value: any) {
    setAddress(state => ({
      ...state,
      [index]: value,
    }));
  }

  function handleChangeCep(value) {
    setPostalCode(value);
    setPostalCodeValidation({ error: false, message: '', hasData: false });

    const newPostalCode = value.replace(/\D/g, '');

    clearTimeout(timer);

    if (newPostalCode.length === 0) return false;

    if (newPostalCode.length < 8) {
      setPostalCodeValidation({
        error: true,
        message: 'CEP inválido',
        hasData: false,
      });
    }

    if (newPostalCode.length === 8)
      timer = setTimeout(() => {
        setLoading(true);
        postalCodeSearch(newPostalCode)
          .then(response => {
            if (response.data.erro) {
              setPostalCodeValidation({
                error: true,
                message: 'CEP inexistente',
                hasData: false,
              });
            } else {
              const { data } = response;
              setAddress(state => ({
                ...state,
                postal_code: value,
                address: data.logradouro,
                district: data.bairro,
                region: data.uf,
                city: data.localidade,
                complement: data.complemento,
              }));
              setPostalCodeValidation({ error: false, message: '', hasData: true });
            }
          })
          .catch(err => {
            setPostalCodeValidation({
              error: true,
              message: err.message,
              hasData: false,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
  }

  function handleValidation(handleModalClose: () => void) {
    if (postalCodeValidation.error) {
      throw new Error('CEP inválido');
    }

    setValidation({});

    validate(address)
      .then(() => handleSubmit(handleModalClose))
      .catch(err => console.error(err));
  }

  function handleSubmit(handleModalClose: () => void) {
    handleAddressSubmit(address)
      .then(handleModalClose)
      .catch(err => {
        const error = err as AxiosError;
        if (error.response) messaging.handleOpen(error.response.data.error);
      });
  }

  return (
    <Modal
      title="adicionar endereço"
      onExited={onExited}
      componentActions={<AccountAddressesAction handleValidation={handleValidation} saving={saving} />}
      maxWidth="sm"
      height="80vh"
    >
      {saving && <InsideSaving />}
      {restaurant?.configs.use_postalcode && (
        <Grid item xs={12} xl={4} md={6} lg={4} style={{ flexBasis: 0 }}>
          <TextField
            label="CEP"
            placeholder="Digite o CEP"
            margin="normal"
            fullWidth
            value={postalCode}
            onChange={event => handleChangeCep(event.target.value)}
            error={postalCodeValidation.error}
            helperText={loading ? 'Pesquisando...' : postalCodeValidation.message && postalCodeValidation.message}
            disabled={loading}
            InputProps={{
              inputComponent: PostalCodeInput as any,
            }}
            required
            autoFocus
            inputProps={{
              inputMode: 'numeric',
            }}
          />
        </Grid>
      )}
      {!postalCodeValidation.error && postalCodeValidation.hasData && (
        <div className={classes.form}>
          <AddressForm handleChange={handleChange} address={address} validation={validation} />
        </div>
      )}
    </Modal>
  );
};

export default AccountAddressNew;
