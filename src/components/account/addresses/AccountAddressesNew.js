import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button, CircularProgress, MenuItem } from '@material-ui/core';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import PropTypes from 'prop-types';
import AccountAddressesAction from './AccountAddressesAction';
import { postalCodeSearch } from 'src/services/postalCodeSearch';
import CustomDialogForm from 'src/components/dialog/CustomDialogForm';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { api } from 'src/services/api';
import { moneyFormat } from 'src/helpers/numberFormat';
import * as yup from 'yup';
import { useMessaging } from 'src/hooks/messaging';

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
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState(mainAddress.city);
  const [region, setRegion] = useState(mainAddress.region);
  const [areaRegionId, setAreaRegionId] = useState('');
  const [cepValidation, setCepValidation] = useState(!restaurant.configs.use_postalcode);
  const [cepValidationText, setCepValidationText] = useState('');
  const [validation, setValidation] = useState({});
  const messaging = useMessaging();
  const classes = useStyles();

  useEffect(() => {
    if (restaurant.configs.tax_mode === 'district') {
      setLoading(true);
      api
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
      area_region_id: areaRegionId,
      postal_code: restaurant.configs.use_postalcode ? postalCode : '00000000',
    };

    try {
      setValidation({});
      await handleAddressSubmit(data);
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
      title="Adicionar endereço"
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
      <Grid item xs={12} xl={7} lg={7} md={9}>
        {cepValidation && (
          <div className={classes.form}>
            <div>
              <TextField
                error={!!validation.address}
                helperText={!!validation.address && validation.address}
                label="Endereço"
                placeholder="Digite o endereço"
                margin="normal"
                fullWidth
                value={address}
                onChange={event => setAddress(event.target.value)}
              />
              <TextField
                error={!!validation.number}
                helperText={!!validation.number && validation.number}
                label="Número"
                placeholder="Digite o número"
                margin="normal"
                fullWidth
                value={number}
                onChange={event => setNumber(event.target.value)}
              />
              {restaurant.configs.tax_mode === 'district' ? (
                <TextField
                  error={!!validation.areaRegionId}
                  helperText={!!validation.areaRegionId && validation.areaRegionId}
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
                error={!!validation.complement}
                helperText={!!validation.complement && validation.complement}
                label="Complemento"
                placeholder="Digite o complemento"
                margin="normal"
                fullWidth
                value={complement}
                onChange={event => setComplement(event.target.value)}
              />
              <TextField label="Cidade" placeholder="Digite a cidade" margin="normal" fullWidth value={city} disabled />
              <TextField
                label="Estado"
                placeholder="Digite o estado"
                margin="normal"
                fullWidth
                value={region}
                disabled
              />
            </div>
            <div className={classes.actions}>
              <Button disabled={saving} type="submit" variant="contained" color="primary">
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
