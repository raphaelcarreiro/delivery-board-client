import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRestaurantAddress } from 'src/hooks/useRestaurantAddress';
import { useRestaurantAddressPosition } from 'src/hooks/useRestaurantAddressPosition';
import { useMap } from 'src/providers/google-maps/MapProvider';
import { useLocation } from 'src/providers/LocationProvider';
import { useCustomerAddress } from './useCustomerAddress';

type UseMyLocation = [boolean, Dispatch<SetStateAction<boolean>>];

export function useMyLocation(): UseMyLocation {
  const { setStep, setPosition, setAddress } = useCustomerAddress();
  const [devicePositionRequested, setDeviceLocationRequested] = useState(false);
  const { getAddressFromLocation } = useMap();
  const { location, isPermittionDenied } = useLocation();
  const restaurantAddressPosition = useRestaurantAddressPosition();
  const restaurantAddress = useRestaurantAddress();

  const setPositionFromDevice = useCallback(async () => {
    if (!location) {
      throw new Error('Não há coordenadas');
    }

    setPosition({ lat: location.latitude, lng: location.longitude });
    const response = await getAddressFromLocation({ lat: location.latitude, lng: location.longitude });

    if (!response) {
      throw new Error('Não foi encontrado endereço para a coordenada');
    }

    setAddress(response);
  }, [getAddressFromLocation, location, setAddress, setPosition]);

  useEffect(() => {
    if (!devicePositionRequested) return;

    if (isPermittionDenied) {
      setAddress(restaurantAddress);
      setPosition(restaurantAddressPosition);
      setStep(2);
      return;
    }

    setPositionFromDevice()
      .then(() => setStep(2))
      .catch(err => console.error(err));
  }, [
    devicePositionRequested,
    isPermittionDenied,
    restaurantAddress,
    restaurantAddressPosition,
    setAddress,
    setPosition,
    setPositionFromDevice,
    setStep,
  ]);

  return [devicePositionRequested, setDeviceLocationRequested];
}
