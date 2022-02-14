import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { useCustomerAddress } from '../hooks/useCustomerAddress';
import { Address } from 'src/types/address';
import GoogleMapHeader from './GoogleMapHeader';
import { useSelector } from 'src/store/redux/selector';
import OutOfDeliverableAreaAlert from './OutOfDeliverableAreaAlert';
import { GpsFixed } from '@material-ui/icons';
import { useMap } from 'src/providers/google-maps/MapProvider';
import { Position } from 'src/types/position';
import { useMaxDistance } from 'src/hooks/useMaxDistance';
import { useRestaurantAddressPosition } from 'src/hooks/useRestaurantAddressPosition';
import { useLocation } from 'src/providers/LocationProvider';

const styles = makeStyles(theme => ({
  map: {
    height: '80vh',
    width: '100%',
    borderRadius: 4,
    position: 'relative',
    '@media (max-width: 600px)': {
      height: '100vh',
    },
    '& .gm-style-iw-a button': {
      visibility: 'hidden',
    },
    '& .gm-style-iw-c': {
      padding: 0,
    },
    '& .gm-style-iw-d': {
      overflow: 'hidden !important',
    },
  },
  actions: {
    background: 'transparent',
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 60,
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
  },
  marker: {
    position: 'absolute',
    top: 'calc(50% + 2px)',
    left: 'calc(50% - 15px)',
  },
  currentPosition: {
    position: 'absolute',
    bottom: '20%',
    right: '5%',
    zIndex: 1,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
}));

let timer: NodeJS.Timeout;

interface CopyGoogleMapProps {
  position: Position;
  address: Address;
}

let marker: google.maps.Marker;
let map: google.maps.Map;

const GoogleMap: React.FC<CopyGoogleMapProps> = ({ position, address }) => {
  const classes = styles();
  const { handleNext, setPosition, setAddress } = useCustomerAddress();
  const restaurant = useSelector(state => state.restaurant);
  const [distance, setDistance] = useState(0);
  const [markerPosition, setMarkerPosition] = useState<Position | null>(null);
  const maxDistance = useMaxDistance();
  const { location: deviceLocation, askPermittionForLocation } = useLocation();
  const restaurantAddressPosition = useRestaurantAddressPosition();
  const [devicePositionRequested, setDeviceLocationRequested] = useState(false);
  const {
    createMap,
    createMarker,
    createCircle,
    createInfoWindow,
    getDistanceMarkerPosition,
    getAddressFromMarker,
  } = useMap();

  const outOfDeliverableArea = useMemo(() => (restaurant ? distance > restaurant?.delivery_max_distance : false), [
    restaurant,
    distance,
  ]);

  const circleRadius = useMemo(() => (restaurant ? restaurant.delivery_max_distance * 1000 : 0), [restaurant]);

  const setPositionFromDevice = useCallback(async () => {
    if (!deviceLocation) return;

    map.panTo({ lat: deviceLocation.latitude, lng: deviceLocation.longitude });
    marker.setPosition({ lat: deviceLocation.latitude, lng: deviceLocation.longitude });
  }, [deviceLocation]);

  const initMap = useCallback(() => {
    map = createMap(position);
    marker = createMarker(map, position);
    const circle = createCircle(map, circleRadius, position);
    const infowindow = createInfoWindow();

    map.addListener('drag', () => {
      infowindow.close();
      marker.setPosition(map.getCenter());
    });

    map.addListener('zoom_changed', () => {
      const position = marker.getPosition();

      if (position) map.panTo(position);
    });

    const openWindow = () =>
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: true,
      });

    openWindow();

    const calculateDistance = () => {
      const newDistance = getDistanceMarkerPosition(marker, restaurantAddressPosition);
      setDistance(newDistance);

      if (newDistance / 1000 > maxDistance) {
        circle.setVisible(true);
        return;
      }

      circle.setVisible(false);
    };

    calculateDistance();

    marker.addListener('position_changed', () => {
      clearTimeout(timer);

      calculateDistance();

      timer = setTimeout(() => {
        openWindow();
        getAddressFromMarker(marker).then(address => {
          if (!address) return;
          setAddress(address);
        });
        const position = marker.getPosition();
        if (!position) return;
        setMarkerPosition({ lat: position.toJSON().lat, lng: position.toJSON().lng });
      }, 500);
    });
  }, [
    createMap,
    position,
    createMarker,
    createCircle,
    circleRadius,
    createInfoWindow,
    getDistanceMarkerPosition,
    restaurantAddressPosition,
    maxDistance,
    getAddressFromMarker,
    setAddress,
  ]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  useEffect(() => {
    if (!devicePositionRequested) return;

    setPositionFromDevice();
  }, [devicePositionRequested, setPositionFromDevice]);

  function handleCurrentLocationClick() {
    askPermittionForLocation();
    setDeviceLocationRequested(true);
  }

  function handleConfirm() {
    setPosition(markerPosition);
    handleNext();
  }

  return (
    <>
      <div className={classes.map} id="map" />

      {outOfDeliverableArea ? <OutOfDeliverableAreaAlert /> : <GoogleMapHeader address={address} />}

      <span className={classes.marker}>
        <img src="/images/mark_map.png" />
      </span>

      <IconButton className={classes.currentPosition} onClick={handleCurrentLocationClick}>
        <GpsFixed color="primary" />
      </IconButton>

      <div className={classes.actions}>
        <Button
          disabled={outOfDeliverableArea}
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleConfirm}
        >
          Confirmar endereço
        </Button>
      </div>
    </>
  );
};

export default GoogleMap;
