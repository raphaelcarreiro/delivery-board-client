import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, CircularProgress, MenuItem } from '@material-ui/core';
import PostalCodeInput from '../../masked-input/PostalCodeInput';
import AccountAddressesAction from './AccountAddressesAction';
import { postalCodeSearch } from 'src/services/postalCodeSearch';
import { makeStyles } from '@material-ui/core/styles';
import { api } from 'src/services/api';
import { moneyFormat } from 'src/helpers/numberFormat';
import { useMessaging } from 'src/hooks/messaging';
import { useSelector } from 'src/store/redux/selector';
import { useAddressValidation } from './validation/useAddressValidation';
import { AreaRegion, NewAddress } from 'src/types/address';
import CustomDialogForm from 'src/components/dialog/CustomDialogForm';

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
let timer;

interface NewAddressPlacesApiProps {
  handleAddressSubmit(address: NewAddress): Promise<void>;
  onExited(): void;
  saving: boolean;
}

const NewAddressPlacesApi: React.FC<NewAddressPlacesApiProps> = ({ handleAddressSubmit, onExited, saving }) => {
  const restaurant = useSelector(state => state.restaurant);
  const mainAddress = restaurant?.addresses.find(address => address.is_main);
  const [regions, setRegions] = useState<AreaRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState(mainAddress?.city || '');
  const [region, setRegion] = useState(mainAddress?.region || '');
  const [areaRegionId, setAreaRegionId] = useState<null | number>(null);
  const messaging = useMessaging();
  const classes = useStyles();
  const [postalCodeValidation, setPostalCodeValidation] = useState({
    error: false,
    message: '',
    hasData: false,
  });
  const inputRefNumber = useRef<HTMLInputElement>(null);
  const [validation, setValidation, validate] = useAddressValidation();

  useEffect(() => {
    if (restaurant?.configs.tax_mode !== 'district') return;

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
  }, [restaurant]);

  useEffect(() => {
    if (!postalCodeValidation.error && postalCodeValidation.hasData) inputRefNumber.current?.focus();
  }, [postalCodeValidation]); //eslint-disable-line

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
              setAddress(data.logradouro);
              setDistrict(data.bairro);
              setRegion(data.uf);
              setCity(data.localidade);
              setComplement(data.complemento);
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
      }, interval);
  }

  function handleValidation() {
    const data = {
      address,
      number,
      complement,
      district,
      region,
      city,
      area_region_id: areaRegionId,
      postal_code: restaurant?.configs.use_postalcode ? postalCode : '00000000',
    };

    validate(data, restaurant?.configs.tax_mode || 'no_tax')
      .then(handleSubmit)
      .catch(err => console.error(err));
  }

  async function handleSubmit() {
    if (postalCodeValidation.error) {
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
      postal_code: restaurant?.configs.use_postalcode ? postalCode : '00000000',
    };

    setValidation({});
    await handleAddressSubmit(data).catch(err => {
      messaging.handleOpen(err.response.data.error);
    });
  }

  function handleDistrictSelectChange(value: string) {
    setAreaRegionId(parseInt(value));

    const region = regions.find(r => r.id === parseInt(value));

    if (!region) return;

    setDistrict(region.name);
  }

  return (
    <CustomDialogForm
      title="adicionar endereço"
      handleModalState={onExited}
      handleSubmit={handleValidation}
      closeOnSubmit
      async
      componentActions={<AccountAddressesAction saving={saving} />}
      maxWidth="sm"
      height="80vh"
    >
      {saving && (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )}
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
      <Grid item xs={12}>
        {!postalCodeValidation.error && postalCodeValidation.hasData && (
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
                inputRef={inputRefNumber}
                error={!!validation.number}
                helperText={!!validation.number && validation.number}
                label="Número"
                placeholder="Digite o número"
                margin="normal"
                fullWidth
                value={number}
                onChange={event => setNumber(event.target.value)}
              />
              {restaurant?.configs.tax_mode === 'district' ? (
                <TextField
                  error={!!validation.areaRegionId}
                  helperText={!!validation.areaRegionId && validation.areaRegionId}
                  select
                  label="Selecione um bairro"
                  fullWidth
                  value={areaRegionId}
                  onChange={event => handleDistrictSelectChange(event.target.value)}
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
              <TextField label="Cidade" placeholder="Digite a cidade" margin="normal" fullWidth value={city} disabled />
              <TextField
                label="Estado"
                placeholder="Digite o estado"
                margin="normal"
                fullWidth
                value={region}
                disabled
              />
              <button type="submit" style={{ display: 'none' }} />
            </div>
          </div>
        )}
      </Grid>
    </CustomDialogForm>
  );
};

export default NewAddressPlacesApi;
