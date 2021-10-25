import React, { useState, useEffect, useCallback } from 'react';
import { api } from 'src/services/api';
import { useMessaging } from 'src/hooks/messaging';
import { Address } from 'src/types/address';
import { CustomerAddressProvider } from '../hooks/useCustomerAddress';
import GoogleMap from '../map/CopyGoogleMap';
import { useLocation } from 'src/providers/location';
import Form from '../Form';
import Modal from 'src/components/modal/Modal';
import InsideSaving from 'src/components/loading/InsideSaving';
import { useAddressValidation } from '../validation/useAddressValidation';
import { useAddressComponents } from '../hooks/useAddressComponents';
import NewAddressActions from '../NewAddressAction';

interface EditAddressProps {
  handleAddressUpdateSubmit(address: Address): Promise<void>;
  onExited(): void;
  saving: boolean;
  selectedAddress: Address;
}

const EditAddress: React.FC<EditAddressProps> = ({ handleAddressUpdateSubmit, onExited, saving, selectedAddress }) => {
  const [loadingAddress, setLoadingAddress] = useState(true);
  const messaging = useMessaging();
  const [validation, setValidation, validate] = useAddressValidation();
  const [address, setAddress] = useState<Address>(selectedAddress);
  const [coordinate, setCoordinate] = useState<null | { lat: number; lng: number }>(null);
  const [step, setStep] = useState<number>(1);
  const { location } = useLocation();
  const { getAddressComponent } = useAddressComponents();

  useEffect(() => {
    if (selectedAddress.latitude && selectedAddress.longitude) {
      setCoordinate({
        lat: selectedAddress.latitude,
        lng: selectedAddress.longitude,
      });
      setLoadingAddress(false);
      return;
    }
    const fullAddress = `${selectedAddress.address} ${selectedAddress.number} ${selectedAddress.district} ${selectedAddress.city} ${selectedAddress.region}`;
    api
      .get('/coordinates', { params: { address: fullAddress } })
      .then(response => {
        const geometryLocation = response.data.geometry.location;
        const _address = response.data.address;
        setCoordinate(geometryLocation);
        setAddress(state => ({
          ...state,
          address: _address.street,
          number: _address.street_number,
          district: _address.neighborhood,
          region: _address.state,
          city: _address.city,
          latitude: geometryLocation.lat,
          longitude: geometryLocation.lng,
        }));
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAddress(false));
  }, [selectedAddress]);

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

      setAddress(state => ({
        ...state,
        number,
        address,
        district,
        city,
        region,
        latitude: payload.geometry.location.lat(),
        longitude: payload.geometry.location.lng(),
      }));
    },
    [getAddressComponent]
  );

  const handleGetAddress = useCallback(
    latlng => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }).then(response => {
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
    handleAddressUpdateSubmit(address)
      .then(handleModalClose)
      .catch(err => {
        messaging.handleOpen(err.response.data.error);
      });
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
    if (location) setCoordinate({ lat: location.latitude, lng: location.longitude });
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
        setAddress(state => ({
          ...state,
          address: _address.street,
          number: _address.street_number,
          district: _address.neighborhood,
          region: _address.state,
          city: _address.city,
          latitude: geometryLocation.lat,
          longitude: geometryLocation.lng,
        }));
        handleNext();
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAddress(false));
  }

  function handleRendering() {
    const components = {
      1: <>{coordinate && <GoogleMap lat={coordinate?.lat} lng={coordinate?.lng} address={address} />}</>,
      2: <Form handleChange={handleChange} validation={validation} address={address} />,
    };

    return components[step as keyof typeof components];
  }

  return (
    <Modal
      title="editar endereço"
      onExited={onExited}
      backAction={step !== 1 ? handleBack : undefined}
      componentActions={<NewAddressActions saving={saving} handleValidation={handleValidation} />}
      maxWidth="sm"
      height="80vh"
      disablePadding={step === 1}
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

export default EditAddress;
