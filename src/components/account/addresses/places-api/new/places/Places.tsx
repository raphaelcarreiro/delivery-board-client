import React from 'react';
import { ListItem, makeStyles, Typography } from '@material-ui/core';
import { LocationSearching } from '@material-ui/icons';
import { useLocation } from 'src/providers/LocationProvider';
import { useMyLocation } from '../../hooks/useMyLocation';
import Place from './PlacesItem';

const styles = makeStyles({
  places: {
    rowGap: '20px',
    display: 'grid',
    margin: '15px 0',
  },
  notfoundItem: {
    display: 'flex',
    '& .text': {
      fontWeight: 400,
    },
  },
  icon: {
    color: '#717171',
    marginRight: 20,
  },
});

interface PlacesProps {
  places: google.maps.places.AutocompletePrediction[];
  showNotFound: boolean;
}

const Places: React.FC<PlacesProps> = ({ places, showNotFound }) => {
  const classes = styles();
  const { askPermittionForLocation } = useLocation();
  const [, setDeviceLocationRequested] = useMyLocation();

  function handleAddressNotFoundClick() {
    setDeviceLocationRequested(true);
    askPermittionForLocation();
  }

  return (
    <ul className={classes.places}>
      {places.map(place => (
        <Place place={place} key={place.place_id} />
      ))}
      {showNotFound && (
        <ListItem button className={classes.notfoundItem} onClick={handleAddressNotFoundClick}>
          <LocationSearching className={classes.icon} />
          <div>
            <Typography className="text" color="error">
              Não encontrei meu endereço
            </Typography>
            <Typography color="textSecondary">buscar pelo mapa</Typography>
          </div>
        </ListItem>
      )}
    </ul>
  );
};

export default Places;
