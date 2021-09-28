import React, { useEffect, useCallback, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { mapStyle } from './mapStyle';
import { useCustomerAddress } from '../hooks/useCustomerAddress';

const styles = makeStyles({
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
  button: {},
});

interface Coordinate {
  lat?: number;
  lng?: number;
}

const GoogleMap: React.FC<Coordinate> = ({ lat, lng }) => {
  const classes = styles();
  const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult | null>(null);
  const { handleSetAddress } = useCustomerAddress();

  const handleGetAddress = useCallback(latlng => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }).then(response => {
      if (response.results[0]) setSelectedAddress(response.results[0]);
    });
  }, []);

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

      <div className={classes.actions}>
        <Button variant="contained" color="primary" size="large" onClick={() => handleSetAddress(selectedAddress)}>
          Confirmar endereço
        </Button>
      </div>
    </>
  );
};

export default GoogleMap;
