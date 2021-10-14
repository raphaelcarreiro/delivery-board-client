import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { mapStyle } from './mapStyle';
import { useCustomerAddress } from '../hooks/useCustomerAddress';
import { Address } from 'src/types/address';
import GoogleMapHeader from './GoogleMapHeader';
import { infoWindowContent } from './infoWindowContent';
import { useSelector } from 'src/store/redux/selector';
import OutOfDeliverableAreaAlert from './OutOfDeliverableAreaAlert';

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
}));

let timer;

interface CopyGoogleMapProps {
  lat: number;
  lng: number;
  address: Address;
}

const CopyGoogleMap: React.FC<CopyGoogleMapProps> = ({ lat, lng, address }) => {
  const classes = styles();
  const { handleGetAddress, handleNext } = useCustomerAddress();
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const [distance, setDistance] = useState(0);

  const outOfDeliverableArea = useMemo(() => (restaurant ? distance > restaurant?.delivery_max_distance : false), [
    restaurant,
    distance,
  ]);

  const circleRadius = useMemo(() => (restaurant ? restaurant.delivery_max_distance * 100 : 0), [restaurant]);

  const restaurantAddressCoordinates = useMemo(() => {
    return {
      lat: order.restaurant_address.latitude as number,
      lng: order.restaurant_address.longitude as number,
    };
  }, [order.restaurant_address]);

  const createMap = useCallback((): google.maps.Map => {
    const position = { lat, lng };

    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 16,
      center: position,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      styles: mapStyle,
    });

    return map;
  }, [lat, lng]);

  const createMarker = useCallback(
    (map: google.maps.Map): google.maps.Marker => {
      const position = { lat, lng };

      const marker = new google.maps.Marker({
        position,
        icon: '/images/mark_map.png',
      });

      marker.setMap(map);

      return marker;
    },
    [lat, lng]
  );

  const createCircle = useCallback(
    (map: google.maps.Map): google.maps.Circle => {
      const circle = new google.maps.Circle({
        radius: circleRadius,
        strokeColor: '#FF0000',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        center: restaurantAddressCoordinates,
      });

      circle.setMap(map);
      circle.setVisible(false);

      return circle;
    },
    [circleRadius, restaurantAddressCoordinates]
  );

  const createInfoWindow = useCallback((): google.maps.InfoWindow => {
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    return infoWindow;
  }, []);

  const calculateDistance = useCallback(
    (marker: google.maps.Marker, circle: google.maps.Circle) => {
      const position = marker.getPosition();
      if (!position) return;

      const restaurantAddressLatLng = new google.maps.LatLng(restaurantAddressCoordinates);
      const newDistance = google.maps.geometry.spherical.computeDistanceBetween(restaurantAddressLatLng, position);

      if (restaurant && newDistance / 100 > restaurant.delivery_max_distance) circle.setVisible(true);
      else circle.setVisible(false);

      setDistance(newDistance / 100);
    },
    [restaurant, restaurantAddressCoordinates]
  );

  const initMap = useCallback(() => {
    const map = createMap();
    const marker = createMarker(map);
    const circle = createCircle(map);
    const infowindow = createInfoWindow();

    map.addListener('center_changed', () => {
      infowindow.close();
      marker.setPosition(map.getCenter());
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

      calculateDistance(marker, circle);

      timer = setTimeout(() => {
        openWindow();
        const position = marker.getPosition();
        if (!position) return;

        handleGetAddress({ lat: position.toJSON().lat, lng: position.toJSON().lng });
      }, 500);
    });

    calculateDistance(marker, circle);
  }, [createMap, createMarker, createCircle, createInfoWindow, calculateDistance, handleGetAddress]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  return (
    <>
      <div className={classes.map} id="map" />

      {outOfDeliverableArea ? <OutOfDeliverableAreaAlert /> : <GoogleMapHeader address={address} />}

      <div className={classes.actions}>
        <Button
          disabled={outOfDeliverableArea}
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleNext}
        >
          Confirmar endereço
        </Button>
      </div>
    </>
  );
};

export default CopyGoogleMap;
