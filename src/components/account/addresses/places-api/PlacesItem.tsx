import React from 'react';
import { ListItem, Typography } from '@material-ui/core';
import { PlaceOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useCustomerAddress } from './hooks/useCustomerAddress';

const styles = makeStyles({
  place: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#717171',
    marginRight: 20,
  },
  streetText: {
    fontWeight: 400,
  },
});

interface PlaceProps {
  place: google.maps.places.AutocompletePrediction;
}

const Place: React.FC<PlaceProps> = ({ place }) => {
  const classes = styles();
  const { handleGetPlaceLatitudeLongitude } = useCustomerAddress();

  function handlePlaceClick(place: google.maps.places.AutocompletePrediction) {
    handleGetPlaceLatitudeLongitude(place);
  }

  return (
    <ListItem button className={classes.place} onClick={() => handlePlaceClick(place)}>
      <PlaceOutlined className={classes.icon} />
      <div>
        <Typography className={classes.streetText} variant="body1">
          {place.terms[0].value}
        </Typography>
        <Typography variant="body2">{`${place.structured_formatting.main_text}, ${place.structured_formatting.secondary_text}`}</Typography>
      </div>
    </ListItem>
  );
};

export default Place;
