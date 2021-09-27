import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
  map: {
    height: 600,
    width: '100%',
    borderRadius: 4,
    '@media (max-width: 600px)': {
      height: 300,
    },
  },
});

interface Coordinate {
  lat: number;
  lng: number;
}

const GoogleMap: React.FC<Coordinate> = ({ lat, lng }) => {
  const classes = styles();

  const initMap = useCallback(() => {
    const position = { lat, lng };

    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 18,
      center: position,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true,
    });

    const marker = new google.maps.Marker({
      position,
      draggable: true,
      title: 'Drag me!',
    });

    marker.setMap(map);
  }, [lat, lng]);

  useEffect(() => {
    if (typeof google === 'undefined') return;
    initMap();
  }, [initMap]);

  return <div className={classes.map} id="map"></div>;
};

export default GoogleMap;
