import { makeStyles } from '@material-ui/core';
import React from 'react';
import Place from './PlacesItem';

const styles = makeStyles({
  places: {
    rowGap: '20px',
    display: 'grid',
    margin: '15px 0',
  },
});

interface PlacesProps {
  places: google.maps.places.QueryAutocompletePrediction[];
}

const Places: React.FC<PlacesProps> = ({ places }) => {
  const classes = styles();
  return (
    <ul className={classes.places}>
      {places.map(place => (
        <Place place={place} key={place.place_id} />
      ))}
    </ul>
  );
};

export default Places;
