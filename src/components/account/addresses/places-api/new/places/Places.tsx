import { ListItem, makeStyles, Typography } from '@material-ui/core';
import { LocationSearching } from '@material-ui/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useRestaurantAddress } from 'src/hooks/useRestaurantAddress';
import { useRestaurantAddressPosition } from 'src/hooks/useRestaurantAddressPosition';
import { useMap } from 'src/providers/google-maps/MapProvider';
import { useLocation } from 'src/providers/LocationProvider';
import { useCustomerAddress } from '../../hooks/useCustomerAddress';
import Place from './PlacesItem';

const styles = makeStyles({
  places: {
    rowGap: '20px',
    display: 'grid',
    margin: '15px 0',
  },
  notfoundItem: {
    display: 'flex',
    '& .text': {
      fontWeight: 400,
    },
  },
  icon: {
    color: '#717171',
    marginRight: 20,
  },
});

interface PlacesProps {
  places: google.maps.places.AutocompletePrediction[];
  showNotFound: boolean;
}

const Places: React.FC<PlacesProps> = ({ places, showNotFound }) => {
  const classes = styles();
  const { askPermittionForLocation } = useLocation();
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

  function handleAddressNotFoundClick() {
    setDeviceLocationRequested(true);
    askPermittionForLocation();
  }

  return (
    <ul className={classes.places}>
      {places.map(place => (
        <Place place={place} key={place.place_id} />
      ))}
      {showNotFound && (
        <ListItem button className={classes.notfoundItem} onClick={handleAddressNotFoundClick}>
          <LocationSearching className={classes.icon} />
          <div>
            <Typography className="text" color="error">
              Não encontrei meu endereço
            </Typography>
            <Typography color="textSecondary">buscar pelo mapa</Typography>
          </div>
        </ListItem>
      )}
    </ul>
  );
};

export default Places;
