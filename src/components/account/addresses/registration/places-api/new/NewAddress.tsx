import React, { useState, useEffect, useCallback } from 'react';
import { api } from 'src/services/api';
import { useMessaging } from 'src/providers/MessageProvider';
import { Address } from 'src/types/address';
import NewAddressInputSearch from './InputSearch';
import Places from './places/Places';
import { CustomerAddressProvider } from '../hooks/useCustomerAddress';
import Form from '../Form';
import Modal from 'src/components/modal/Modal';
import InsideSaving from 'src/components/loading/InsideSaving';
import { useAddressValidation } from '../validation/useAddressValidation';
import NewAddressActions from './NewAddressAction';
import { useSelector } from 'src/store/redux/selector';
import GoogleMap from '../map/GoogleMap';
import GoogleMapsProvider from 'src/providers/google-maps/MapProvider';
import PlacesLoading from './places/PlacesLoading';
import MyLocation from './places/MyLocation';

let timer: NodeJS.Timeout;

const INITIAL_STATE: Address = {
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

interface NewAddressProps {
  handleAddressSubmit(address: Address): Promise<void>;
  onExited(): void;
  saving: boolean;
}

const NewAddress: React.FC<NewAddressProps> = ({ handleAddressSubmit, onExited, saving }) => {
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { handleOpen } = useMessaging();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(INITIAL_STATE);
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [position, setPosition] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);
  const [showNotFound, setShowNotFound] = useState(false);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);

  const handleNext = useCallback(() => {
    setStep(step => step + 1);
  }, []);

  const handleBack = useCallback(() => {
    setStep(step => step - 1);
  }, []);

  useEffect(() => {
    if (!searchText) setPlaces([]);
  }, [searchText]);

  function handleValidation(handleModalClose: () => void) {
    validate(address)
      .then(() => handleSubmit(handleModalClose))
      .catch(err => console.error(err));
  }

  function handleSubmit(handleModalClose: () => void) {
    setValidation({});
    handleAddressSubmit(address)
      .then(handleModalClose)
      .catch(err => {
        handleOpen(err.response.data.error);
      });
  }

  function handleGooglePlacesSearch(value: string) {
    const restaurantAddress = order.restaurant_address;

    setSearchText(value);

    const service = new google.maps.places.AutocompleteService();

    clearTimeout(timer);

    if (value.length < 10) {
      setShowNotFound(false);
      return;
    }

    timer = setTimeout(() => {
      setLoadingAddresses(true);
      service.getPlacePredictions(
        {
          input: value,
          location: new google.maps.LatLng({ lat: restaurantAddress.latitude, lng: restaurantAddress.longitude }),
          radius: (restaurant?.delivery_max_distance || 0) * 1000,
          componentRestrictions: { country: 'br' },
        },
        predections => {
          setShowNotFound(true);
          setLoadingAddresses(false);

          if (predections) {
            setPlaces(predections);
          }
        }
      );
    }, 500);
  }

  function handleChange(index: keyof Address, value: any) {
    setAddress(state => ({
      ...state,
      [index]: value,
    }));
  }

  function handleGetPlaceLatitudeLongitude(addressDescription: string) {
    setLoadingAddress(true);

    api
      .get('/coordinates', { params: { address: addressDescription } })
      .then(response => {
        const geometryLocation = response.data.geometry.location;
        const _address = response.data.address;
        setPosition(geometryLocation);
        setAddress({
          ...INITIAL_STATE,
          address: _address.street,
          number: _address.street_number,
          district: _address.neighborhood,
          region: _address.state,
          city: _address.city,
          latitude: geometryLocation.lat,
          longitude: geometryLocation.lng,
        });
        handleNext();
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAddress(false));
  }

  function handleRendering() {
    const components = {
      1: (
        <>
          <NewAddressInputSearch handleSearch={handleGooglePlacesSearch} searchText={searchText} />
          {!showNotFound && <MyLocation />}
          {loadingAddresses ? <PlacesLoading /> : <Places places={places} showNotFound={showNotFound} />}
        </>
      ),
      2: <>{position && <GoogleMap position={position} address={address} />}</>,
      3: <Form handleChange={handleChange} validation={validation} address={address} />,
    };

    return components[step as keyof typeof components];
  }

  return (
    <CustomerAddressProvider
      value={{
        handleGetPlaceLatitudeLongitude,
        handleChange,
        handleNext,
        handleBack,
        handleValidation,
        setPosition,
        setAddress,
        setStep,
        step,
      }}
    >
      <Modal
        title="adicionar endereço"
        onExited={onExited}
        backAction={step !== 1 ? handleBack : undefined}
        componentActions={<NewAddressActions saving={saving} handleValidation={handleValidation} />}
        maxWidth="sm"
        height="80vh"
        disablePadding={step === 2}
      >
        {(loadingAddress || saving) && <InsideSaving />}
        <GoogleMapsProvider>{handleRendering()}</GoogleMapsProvider>
      </Modal>
    </CustomerAddressProvider>
  );
};

export default NewAddress;
