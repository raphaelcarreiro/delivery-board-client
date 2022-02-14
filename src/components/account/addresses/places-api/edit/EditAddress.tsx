import React, { useState, useEffect } from 'react';
import { api } from 'src/services/api';
import { useMessaging } from 'src/providers/MessageProvider';
import { Address } from 'src/types/address';
import { CustomerAddressProvider } from '../hooks/useCustomerAddress';
import GoogleMap from '../map/GoogleMap';
import Form from '../Form';
import Modal from 'src/components/modal/Modal';
import InsideSaving from 'src/components/loading/InsideSaving';
import { useAddressValidation } from '../validation/useAddressValidation';
import NewAddressActions from '../new/NewAddressAction';
import GoogleMapsProvider from 'src/providers/google-maps/MapProvider';
import { Position } from 'src/types/position';

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
  const [position, setPosition] = useState<null | Position>(null);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    if (selectedAddress.latitude && selectedAddress.longitude) {
      setPosition({
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
        setPosition(geometryLocation);
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

  function handleGetPlaceLatitudeLongitude(addressDescription: string) {
    setLoadingAddress(true);

    api
      .get('/coordinates', { params: { address: addressDescription } })
      .then(response => {
        const geometryLocation = response.data.geometry.location;
        const _address = response.data.address;
        setPosition(geometryLocation);
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
      1: <>{position && <GoogleMap position={position} address={address} />}</>,
      2: <Form handleChange={handleChange} validation={validation} address={address} />,
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
        title="editar endereço"
        onExited={onExited}
        backAction={step !== 1 ? handleBack : undefined}
        componentActions={<NewAddressActions saving={saving} handleValidation={handleValidation} />}
        maxWidth="sm"
        height="80vh"
        disablePadding={step === 1}
      >
        {(loadingAddress || saving) && <InsideSaving />}
        <GoogleMapsProvider>{handleRendering()}</GoogleMapsProvider>
      </Modal>
    </CustomerAddressProvider>
  );
};

export default EditAddress;
