import React, { useState, useContext } from 'react';
import { TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { MessagingContext } from '../../messaging/Messaging';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
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

function AccountAddressesEdit({ handleAddressUpdateSubmit, handleModalState, saving, selectedAddress }) {
  const [postalCode] = useState(selectedAddress.postal_code || '');
  const [address, setAddress] = useState(selectedAddress.address);
  const [number, setNumber] = useState(selectedAddress.number);
  const [complement, setComplement] = useState(
    selectedAddress.address_complement ? selectedAddress.address_complement : ''
  );
  const [district, setDistrict] = useState(selectedAddress.district);
  const [city] = useState(selectedAddress.city);
  const [region] = useState(selectedAddress.region);
  const messaging = useContext(MessagingContext);
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

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
    <CustomDialogForm
      title="Atualizar endereço"
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
        <Grid item xs={12} xl={3} md={5} lg={3} style={{ flexBasis: 0 }}>
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
        </Grid>
      )}
      <Grid item xs={12} xl={6} lg={6} md={8}>
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
        <div className={classes.actions}>
          <Button disabled={saving} type="submit" variant="contained" color="primary">
            Confirmar endereço
          </Button>
        </div>
      </Grid>
    </CustomDialogForm>
  );
}

AccountAddressesEdit.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  selectedAddress: PropTypes.object.isRequired,
  handleAddressUpdateSubmit: PropTypes.func.isRequired,
};

export default AccountAddressesEdit;
