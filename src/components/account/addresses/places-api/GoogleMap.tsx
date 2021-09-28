import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { mapStyle } from './mapStyle';

const styles = makeStyles({
  map: {
    height: '70vh',
    width: '100%',
    borderRadius: 4,
    '@media (max-width: 600px)': {
      height: 300,
    },
  },
});

interface Coordinate {
  lat?: number;
  lng?: number;
}

const GoogleMap: React.FC<Coordinate> = ({ lat, lng }) => {
  const classes = styles();
  const [selectedAddress, setSelectedAddress] = useState<google.maps.GeocoderResult | null>(null);

  useEffect(() => {
    console.log(selectedAddress);
  }, [selectedAddress]);

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

  return <div className={classes.map} id="map"></div>;
};

export default GoogleMap;
