import React, { useState, useEffect } from 'react';
import AccountAddressesAction from '../AccountAddressesAction';
import { api } from 'src/services/api';
import { useMessaging } from 'src/hooks/messaging';
import { Address } from 'src/types/address';
import NewAddressInputSearch from './InputSearch';
import Places from './Places';
import { CustomerAddressProvider } from './hooks/useCustomerAddress';
import GoogleMap from './map/GoogleMap';
import { useLocation } from 'src/providers/location';
import PlacesLoading from './PlacesLoading';
import Form from './Form';
import Modal from 'src/components/modal/Modal';
import InsideSaving from 'src/components/loading/InsideSaving';
import { useAddressValidation } from './validation/useAddressValidation';

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
}

const NewAddress: React.FC<NewAddressProps> = ({ handleAddressSubmit, onExited }) => {
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(INITIAL_STATE);
  const [searchText, setSearchText] = useState('');
  const [places, setPlaces] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [coordinate, setCoordinate] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);
  const { location } = useLocation();
  const [showNotFound, setShowNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log(places);
  }, [places]);

  useEffect(() => {
    if (!searchText) setPlaces([]);
  }, [searchText]);

  function handleValidation() {
    validate(address)
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

  function handleSetAddressGeoCodeResult(payload: google.maps.GeocoderResult | null) {
    console.log(address);

    if (!payload) return;

    handleNext();
    setAddress(state => ({
      ...state,
      number: payload.address_components[0].long_name,
      address: payload.address_components[1].long_name,
      city: payload.address_components[2].long_name,
      region: payload.address_components[3].short_name,
    }));
  }

  function handleGetPlaceLatitudeLongitude(place: google.maps.places.AutocompletePrediction) {
    setSaving(true);

    api
      .get('/coordinates', { params: { address: place.description } })
      .then(response => {
        setCoordinate(response.data.location);
        handleSetAddressAutocompletePrediction(place);
        // handleNext();
      })
      .catch(err => console.error(err))
      .finally(() => setSaving(false));
  }

  function handleSetAddressAutocompletePrediction(place: google.maps.places.AutocompletePrediction) {
    handleNext();
    setAddress(state => ({
      ...state,
      address: place.terms[0].value,
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

  return (
    <Modal
      title="adicionar endereço"
      onExited={onExited}
      backAction={step !== 1 ? handleBack : undefined}
      componentActions={<AccountAddressesAction saving={saving} />}
      maxWidth="md"
      height="80vh"
    >
      {saving && <InsideSaving />}
      <CustomerAddressProvider
        value={{
          handleGetPlaceLatitudeLongitude,
          setBrowserLocation,
          handleChange,
          handleSetAddressGeoCodeResult,
          handleNext,
          handleBack,
          handleValidation,
        }}
      >
        {handleRendering()}
      </CustomerAddressProvider>
    </Modal>
  );
};

export default NewAddress;
