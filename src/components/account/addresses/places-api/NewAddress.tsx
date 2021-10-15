import React, { useState, useEffect, useCallback } from 'react';
import { api } from 'src/services/api';
import { useMessaging } from 'src/hooks/messaging';
import { Address } from 'src/types/address';
import NewAddressInputSearch from './new/InputSearch';
import Places from './Places';
import { CustomerAddressProvider } from './hooks/useCustomerAddress';
import { useLocation } from 'src/providers/location';
import PlacesLoading from './PlacesLoading';
import Form from './Form';
import Modal from 'src/components/modal/Modal';
import InsideSaving from 'src/components/loading/InsideSaving';
import { useAddressValidation } from './validation/useAddressValidation';
import { useAddressComponents } from './hooks/useAddressComponents';
import NewAddressActions from './NewAddressAction';
import { useSelector } from 'src/store/redux/selector';
import CopyGoogleMap from './map/CopyGoogleMap';

let timer;

const INITIAL_STATE: Address = {
  address: '',
  number: '',
  complement: null,
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
  const messaging = useMessaging();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(INITIAL_STATE);
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [coordinate, setCoordinate] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);
  const { location } = useLocation();
  const [showNotFound, setShowNotFound] = useState(false);
  const { getAddressComponent } = useAddressComponents();
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    if (!searchText) setPlaces([]);
  }, [searchText]);

  const handleSetAddressGeoCodeResult = useCallback(
    (payload: google.maps.GeocoderResult | null) => {
      if (!payload) {
        return;
      }

      const number = getAddressComponent(payload.address_components, 'street_number', 'long_name');
      const address = getAddressComponent(payload.address_components, 'route', 'long_name');
      const district = getAddressComponent(payload.address_components, 'sublocality', 'long_name');
      const city = getAddressComponent(payload.address_components, 'administrative_area_level_2', 'long_name');
      const region = getAddressComponent(payload.address_components, 'administrative_area_level_1', 'short_name');

      setAddress({
        ...INITIAL_STATE,
        number,
        address,
        district,
        city,
        region,
        latitude: payload.geometry.location.lat(),
        longitude: payload.geometry.location.lng(),
      });
    },
    [getAddressComponent]
  );

  const handleGetAddress = useCallback(
    latlng => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }).then(response => {
        console.log(response.results);
        if (response.results[0]) handleSetAddressGeoCodeResult(response.results[0]);
      });
    },
    [handleSetAddressGeoCodeResult]
  );

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
        messaging.handleOpen(err.response.data.error);
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
          if (!predections) return;

          setPlaces(predections);
          setShowNotFound(true);
          setLoadingAddresses(false);
        }
      );
    }, 500);
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

  function setBrowserLocation() {
    setCoordinate({ lat: location.latitude, lng: location.longitude });
    handleNext();
  }

  function handleGetPlaceLatitudeLongitude(addressDescription: string) {
    setLoadingAddress(true);

    api
      .get('/coordinates', { params: { address: addressDescription } })
      .then(response => {
        const geometryLocation = response.data.geometry.location;
        const _address = response.data.address;
        setCoordinate(geometryLocation);
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
          {loadingAddresses ? <PlacesLoading /> : <Places places={places} showNotFound={showNotFound} />}
        </>
      ),
      2: <>{coordinate && <CopyGoogleMap lat={coordinate.lat} lng={coordinate.lng} address={address} />}</>,
      3: <Form handleChange={handleChange} validation={validation} address={address} />,
    };

    return components[step as keyof typeof components];
  }

  return (
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
      <CustomerAddressProvider
        value={{
          handleGetPlaceLatitudeLongitude,
          setBrowserLocation,
          handleChange,
          handleSetAddressGeoCodeResult,
          handleNext,
          handleBack,
          handleValidation,
          handleGetAddress,
        }}
      >
        {handleRendering()}
      </CustomerAddressProvider>
    </Modal>
  );
};

export default NewAddress;
