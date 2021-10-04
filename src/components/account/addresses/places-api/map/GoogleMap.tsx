import React, { useEffect, useCallback } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { mapStyle } from './mapStyle';
import { useCustomerAddress } from '../hooks/useCustomerAddress';
import { Address } from 'src/types/address';
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
    '& .gm-style-iw-a button': {
      visibility: 'hidden',
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
  mapHeader: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 64,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.8) 25%, white 100%)',
    padding: 30,
    '& > p': {
      fontWeight: 500,
      fontSize: 18,
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
      openWindow();
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

      <div className={classes.mapHeader}>
        <Typography>{`${address.address}, ${address.number}`}</Typography>
        {address.district ? (
          <Typography color="textSecondary">{`${address.district}, ${address.city}, ${address.region}`}</Typography>
        ) : (
          <Typography color="textSecondary">{`${address.city}, ${address.region}`}</Typography>
        )}
      </div>

      <div className={classes.actions}>
        <Button className={classes.button} variant="contained" color="primary" size="large" onClick={handleNext}>
          Confirmar endereço
        </Button>
      </div>
    </>
  );
};

export default GoogleMap;
