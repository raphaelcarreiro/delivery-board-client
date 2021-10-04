import React, { useEffect, useCallback } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { mapStyle } from './mapStyle';
import { useCustomerAddress } from '../hooks/useCustomerAddress';
import { Address } from 'src/types/address';
import GoogleMapHeader from './GoogleMapHeader';
import { infoWindowContent } from './infoWindowContent';

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
}));

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  address: Address;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ lat, lng, address }) => {
  const classes = styles();
  const { handleGetAddress, handleNext } = useCustomerAddress();

  const initMap = useCallback(() => {
    if (!lat || !lng) return;
    const position = { lat, lng };

    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 17,
      center: position,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
      styles: mapStyle,
    });

    const marker = new google.maps.Marker({
      position,
      draggable: true,
      icon: '/images/mark_map.png',
      animation: google.maps.Animation.DROP,
    });

    marker.setMap(map);

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
      const position = marker.getPosition();
      if (!position) return;

      handleGetAddress({ lat: position.toJSON().lat, lng: position.toJSON().lng });
    });
  }, [handleGetAddress, lat, lng]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  return (
    <>
      <div className={classes.map} id="map" />

      <GoogleMapHeader address={address} />

      <div className={classes.actions}>
        <Button className={classes.button} variant="contained" color="primary" size="large" onClick={handleNext}>
          Confirmar endereço
        </Button>
      </div>
    </>
  );
};

export default GoogleMap;
