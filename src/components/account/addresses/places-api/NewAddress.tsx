import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import AccountAddressesAction from '../AccountAddressesAction';
import { makeStyles } from '@material-ui/core/styles';
import { api } from 'src/services/api';
import { moneyFormat } from 'src/helpers/numberFormat';
import { useMessaging } from 'src/hooks/messaging';
import { useSelector } from 'src/store/redux/selector';
import { useAddressValidation } from '../validation/useAddressValidation';
import { Address, AreaRegion } from 'src/types/address';
import NewAddressInputSearch from './InputSearch';
import Places from './Places';
import { CustomerAddressProvider } from './hooks/useCustomerAddress';
import GoogleMap from './GoogleMap';
import CustomDialog from 'src/components/dialog/CustomDialog';

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

let timer;

const INITIAL_STATE = {
  address: '',
  number: '',
  complement: '',
  city: '',
  region: '',
  district: '',
  area_region: null,
  distance: 0,
  distance_tax: 0,
  postal_code: '',
  is_main: false,
  id: 0,
  formattedDistanceTax: '',
  area_region_id: null,
};

interface NewAddressProps {
  handleAddressSubmit(address: Address): Promise<void>;
  onExited(): void;
  saving: boolean;
}

const NewAddress: React.FC<NewAddressProps> = ({ handleAddressSubmit, onExited, saving }) => {
  const restaurant = useSelector(state => state.restaurant);
  const [regions, setRegions] = useState<AreaRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const classes = useStyles();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(INITIAL_STATE);
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState<google.maps.places.QueryAutocompletePrediction[]>([]);
  const [coordinate, setCoordinate] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    if (!searchText) setPlaces([]);
  }, [searchText]);

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

  function handleValidation() {
    validate(address, restaurant?.configs.tax_mode || 'no_tax')
      .then(handleSubmit)
      .catch(err => console.error(err));
  }

  async function handleSubmit() {
    setValidation({});
    await handleAddressSubmit(address).catch(err => {
      messaging.handleOpen(err.response.data.error);
    });
  }

  function handleGooglePlacesSearch(value: string) {
    setSearchText(value);

    const service = new google.maps.places.AutocompleteService();

    clearTimeout(timer);

    if (value.length < 10) return;

    timer = setTimeout(() => {
      service.getPlacePredictions({ input: value, componentRestrictions: { country: 'br' } }, predections => {
        if (!predections) return;

        setPlaces(predections);
      });
    }, 500);
  }

  function handleGetPlaceLatitudeLongitude(address: string) {
    api
      .get('/coordinates', { params: { address } })
      .then(response => {
        setCoordinate(response.data.location);
        handleNext();
      })
      .catch(err => console.error(err));
  }

  function handleNext() {
    setStep(step => step + 1);
  }

  function handleBack() {
    setStep(step => step - 1);
  }

  function handleRendering() {
    const components = {
      1: (
        <CustomerAddressProvider value={{ handleGetPlaceLatitudeLongitude }}>
          <NewAddressInputSearch handleSearch={handleGooglePlacesSearch} searchText={searchText} />
          <Places places={places} />
        </CustomerAddressProvider>
      ),
      2: <GoogleMap lat={coordinate?.lat} lng={coordinate?.lng} />,
    };

    return components[step as keyof typeof components];
  }

  return (
    <CustomDialog
      title="adicionar endereço"
      handleModalState={onExited}
      componentActions={<AccountAddressesAction saving={saving} />}
      maxWidth="md"
      height="80vh"
    >
      {saving && (
        <div className={classes.loading}>
          <CircularProgress color="primary" />
        </div>
      )}

      {handleRendering()}
    </CustomDialog>
  );
};

export default NewAddress;
