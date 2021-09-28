import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import AccountAddressesAction from '../AccountAddressesAction';
import { makeStyles } from '@material-ui/core/styles';
import { api } from 'src/services/api';
import { useMessaging } from 'src/hooks/messaging';
import { useSelector } from 'src/store/redux/selector';
import { useAddressValidation } from '../validation/useAddressValidation';
import { Address } from 'src/types/address';
import NewAddressInputSearch from './InputSearch';
import Places from './Places';
import { CustomerAddressProvider } from './hooks/useCustomerAddress';
import GoogleMap from './map/GoogleMap';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useLocation } from 'src/providers/location';
import PlacesLoading from './PlacesLoading';
import Form from './Form';

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
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const classes = useStyles();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(INITIAL_STATE);
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [coordinate, setCoordinate] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);
  const { location } = useLocation();
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    if (!searchText) setPlaces([]);
  }, [searchText]);

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

    if (value.length < 10) {
      setShowNotFound(false);
      return;
    }

    timer = setTimeout(() => {
      setLoading(true);
      service.getPlacePredictions({ input: value, componentRestrictions: { country: 'br' } }, predections => {
        if (!predections) return;

        setPlaces(predections);
        setShowNotFound(true);
        setLoading(false);
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

  function handleChange(index: keyof Address, value: any) {
    setAddress(state => ({
      ...state,
      [index]: value,
    }));
  }

  function handleRendering() {
    const components = {
      1: (
        <>
          <NewAddressInputSearch handleSearch={handleGooglePlacesSearch} searchText={searchText} />
          {loading ? <PlacesLoading /> : <Places places={places} showNotFound={showNotFound} />}
        </>
      ),
      2: <GoogleMap lat={coordinate?.lat} lng={coordinate?.lng} />,
      3: <Form handleChange={handleChange} validation={validation} address={address} />,
    };

    return components[step as keyof typeof components];
  }

  function setBrowserLocation() {
    setCoordinate({ lat: location.latitude, lng: location.longitude });
    handleNext();
  }

  function handleSetAddress(payload: google.maps.GeocoderResult | null) {
    if (!payload) return;

    console.log(address);
    handleNext();
    setAddress(state => ({
      ...state,
      address: payload.address_components[0].long_name,
    }));
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
      <CustomerAddressProvider
        value={{
          handleGetPlaceLatitudeLongitude,
          setBrowserLocation,
          handleChange,
          handleSetAddress,
          handleNext,
          handleBack,
          handleValidation,
        }}
      >
        {handleRendering()}
      </CustomerAddressProvider>
    </CustomDialog>
  );
};

export default NewAddress;
