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
    height: '70vh',
    width: '100%',
    borderRadius: 4,
    position: 'relative',
    '@media (max-width: 600px)': {
      height: '100vh',
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
    transform: 'translate(-50%, calc(-50% - 15px))',
  },
}));

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  address: Address;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ lat, lng, address }) => {
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

  const initMap = useCallback(() => {
    if (!lat || !lng) return;
    const position = { lat, lng };

    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 16,
      center: position,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      styles: mapStyle,
    });

    const marker = new google.maps.Marker({
      position,
      draggable: true,
      icon: '/images/mark_map.png',
      // animation: google.maps.Animation.DROP,
    });

    marker.setMap(map);

    const circle = new google.maps.Circle({
      radius: circleRadius,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      center: restaurantAddressCoordinates,
    });

    circle.setMap(map);
    circle.setVisible(false);

    const infowindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    const openWindow = () =>
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: true,
      });

    openWindow();

    marker.addListener('dragstart', () => {
      infowindow.close();
    });

    marker.addListener('dragend', () => {
      openWindow();
      const position = marker.getPosition();
      if (!position) return;

      handleGetAddress({ lat: position.toJSON().lat, lng: position.toJSON().lng });

      const restaurantAddressLatLng = new google.maps.LatLng(restaurantAddressCoordinates);
      const _distance = google.maps.geometry.spherical.computeDistanceBetween(restaurantAddressLatLng, position);

      if (restaurant && _distance / 100 > restaurant.delivery_max_distance) circle.setVisible(true);
      else circle.setVisible(false);

      setDistance(_distance / 100);
    });
  }, [lat, lng, circleRadius, restaurantAddressCoordinates, handleGetAddress, restaurant]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  return (
    <>
      <div className={classes.map} id="map" />

      {outOfDeliverableArea ? <OutOfDeliverableAreaAlert /> : <GoogleMapHeader address={address} />}

      <span className={classes.marker}>
        <img src="/mark_map.pnh" />
      </span>

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

export default GoogleMap;
