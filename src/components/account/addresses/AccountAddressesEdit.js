import React, { useState, useContext, useEffect } from 'react';
import { TextField, Grid, Button, CircularProgress, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { MessagingContext } from '../../messaging/Messaging';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import CustomDialogForm from 'src/components/dialog/CustomDialogForm';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { api } from 'src/services/api';
import { moneyFormat } from 'src/helpers/numberFormat';
import { makeStyles } from '@material-ui/core/styles';

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
  const [validation, setValidation] = useState({});
  const [regions, setRegions] = useState([]);
  const [areaRegionId, setAreaRegionId] = useState(
    selectedAddress.area_region ? selectedAddress.area_region.area_region_id : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurant.configs.tax_mode === 'district') {
      setLoading(true);
      api()
        .get('/areas')
        .then(response => {
          setRegions(
            response.data.regions.map(r => {
              r.formattedTax = moneyFormat(r.tax);
              return r;
            })
          );
        })
        .catch(() => {
          console.log('Não foi possível carregar os bairros');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [restaurant]);

  async function handleValidation() {
    const schema = yup.object().shape({
      complement: yup.string().nullable(),
      district: yup.string().test('check_config', 'Bairro é obrigatório', value => {
        if (restaurant.configs.tax_mode !== 'district') {
          return !!value;
        } else return true;
      }),
      areaRegionId: yup.mixed().test('check_area', 'Bairro é obrigatório', value => {
        if (restaurant.configs.tax_mode === 'district') {
          return !!value;
        } else return true;
      }),
      number: yup.string().required('O número é obrigatório'),
      address: yup.string().required('O endereço é obrigatório'),
    });

    const data = {
      address,
      number,
      complement,
      district,
      region,
      city,
      areaRegionId,
      postal_code: restaurant.configs.use_postalcode ? postalCode : '00000000',
    };

    try {
      await schema.validate(data);
      await handleSubmit();
    } catch (err) {
      setValidation({
        [err.path]: err.message,
      });
      throw new Error('validation fails');
    }
  }

  async function handleSubmit() {
    const data = {
      address,
      number,
      address_complement: complement,
      district,
      region,
      city,
      area_region_id: areaRegionId,
      postal_code: postalCode,
    };

    try {
      setValidation({});
      await handleAddressUpdateSubmit(data);
    } catch (err) {
      if (err.response) {
        messaging.handleOpen(err.response.data.error);
      }
      throw new Error(err);
    }
  }

  function handleDistrictSelectChange(e) {
    setAreaRegionId(e.target.value);
    setDistrict(regions.find(r => r.id === e.target.value).name);
  }

  return (
    <CustomDialogForm
      title="Atualizar endereço"
      handleModalState={handleModalState}
      handleSubmit={handleValidation}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
      displayBottomActions
      maxWidth="sm"
      height="70vh"
    >
      {(saving || loading) && (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )}
      {restaurant.configs.use_postalcode && (
        <Grid item xs={12} xl={4} md={6} lg={4} style={{ flexBasis: 0 }}>
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
      <Grid item xs={12} xl={7} lg={7} md={9}>
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
        {restaurant.configs.tax_mode === 'district' ? (
          <TextField
            error={!!validation.areaRegionId}
            helperText={
              validation.areaRegionId
                ? validation.areaRegionId
                : 'Se o bairro não estiver na lista, é porque não entregamos na região'
            }
            select
            label="Selecione um bairro"
            fullWidth
            value={areaRegionId}
            onChange={event => handleDistrictSelectChange(event)}
            margin="normal"
          >
            {regions.map(region => (
              <MenuItem key={region.id} value={region.id}>
                {region.name} - {region.formattedTax} (taxa de entrega)
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            error={!!validation.district}
            helperText={!!validation.district && validation.district}
            label="Bairro"
            placeholder="Digite o bairro"
            margin="normal"
            fullWidth
            value={district}
            onChange={event => setDistrict(event.target.value)}
          />
        )}
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
