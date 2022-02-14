import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { useCustomerAddress } from '../hooks/useCustomerAddress';
import { Address } from 'src/types/address';
import GoogleMapHeader from './GoogleMapHeader';
import { useSelector } from 'src/store/redux/selector';
import OutOfDeliverableAreaAlert from './OutOfDeliverableAreaAlert';
import { useLocation } from 'src/providers/LocationProvider';
import { GpsFixed } from '@material-ui/icons';
import { useGoogleMaps } from 'src/providers/google-maps/GoogleMapsProvider';
import { Position } from 'src/types/position';

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
  },
}));

let timer: NodeJS.Timeout;

interface CopyGoogleMapProps {
  lat: number;
  lng: number;
  address: Address;
}

const GoogleMap: React.FC<CopyGoogleMapProps> = ({ lat, lng, address }) => {
  const classes = styles();
  const { handleNext, setCoordinate, setAddress } = useCustomerAddress();
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const [distance, setDistance] = useState(0);
  const { askPermittionForLocation, location: deviceLocation } = useLocation();
  const [locationWasRequested, setLocationWasRequested] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<Position | null>(null);
  const {
    createMap,
    createMarker,
    createCircle,
    createInfoWindow,
    getDistanceMarkerPosition,
    getAddressFromMarker,
    getAddressFromLocation,
  } = useGoogleMaps();

  const location = useMemo((): Position => ({ lat, lng }), [lat, lng]);

  const maxDistance = useMemo(() => restaurant?.delivery_max_distance || 0, [restaurant]);

  const outOfDeliverableArea = useMemo(() => (restaurant ? distance > restaurant?.delivery_max_distance : false), [
    restaurant,
    distance,
  ]);

  const circleRadius = useMemo(() => (restaurant ? restaurant.delivery_max_distance * 1000 : 0), [restaurant]);

  const restaurantAddressCoordinate = useMemo(() => {
    return {
      lat: order.restaurant_address.latitude as number,
      lng: order.restaurant_address.longitude as number,
    };
  }, [order.restaurant_address]);

  const initMap = useCallback(() => {
    const map = createMap(location);
    const marker = createMarker(map, location);
    const circle = createCircle(map, circleRadius, location);
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

    marker.addListener('position_changed', () => {
      clearTimeout(timer);

      const newDistance = getDistanceMarkerPosition(marker, restaurantAddressCoordinate);

      if (newDistance / 1000 > maxDistance) {
        circle.setVisible(true);
      } else {
        circle.setVisible(false);
      }

      setDistance(newDistance);

      timer = setTimeout(() => {
        openWindow();
        getAddressFromMarker(marker).then(address => {
          if (address) {
            setAddress(address);
          }
        });
        const position = marker.getPosition();
        if (position) {
          setMarkerPosition({ lat: position.toJSON().lat, lng: position.toJSON().lng });
        }
      }, 500);
    });
  }, [
    createMap,
    location,
    createMarker,
    createCircle,
    circleRadius,
    createInfoWindow,
    getDistanceMarkerPosition,
    restaurantAddressCoordinate,
    maxDistance,
    setAddress,
    getAddressFromMarker,
  ]);

  useEffect(() => {
    if (!deviceLocation) {
      return;
    }

    if (!locationWasRequested) {
      return;
    }

    setCoordinate({ lat: deviceLocation.latitude, lng: deviceLocation.longitude });
    setMarkerPosition({ lat: deviceLocation.latitude, lng: deviceLocation.longitude });

    getAddressFromLocation({ lat: deviceLocation.latitude, lng: deviceLocation.longitude }).then(address => {
      if (address) {
        setAddress(address);
      }
    });
  }, [deviceLocation, setCoordinate, locationWasRequested, initMap, getAddressFromLocation, setAddress]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  function handleCurrentLocationClick() {
    askPermittionForLocation();
    setLocationWasRequested(true);
  }

  function handleConfirm() {
    setCoordinate(markerPosition);
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
