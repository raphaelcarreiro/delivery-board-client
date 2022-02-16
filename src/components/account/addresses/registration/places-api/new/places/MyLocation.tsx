import React from 'react';
import { ListItem, makeStyles, Typography } from '@material-ui/core';
import { GpsFixed } from '@material-ui/icons';
import { useLocation } from 'src/providers/LocationProvider';
import { useMyLocation } from '../../hooks/useMyLocation';

const styles = makeStyles({
  myLocation: {
    display: 'flex',
    height: 60,
    '& .text': {
      fontWeight: 400,
    },
  },
  icon: {
    color: '#717171',
    marginRight: 20,
  },
});

const MyLocation: React.FC = () => {
  const classes = styles();
  const { askPermittionForLocation } = useLocation();
  const [, setDeviceLocationRequested] = useMyLocation();

  function handleAddressNotFoundClick() {
    setDeviceLocationRequested(true);
    askPermittionForLocation();
  }

  return (
    <ListItem button className={classes.myLocation} onClick={handleAddressNotFoundClick}>
      <GpsFixed className={classes.icon} />
      <div>
        <Typography className="text">Usar minha localização</Typography>
      </div>
    </ListItem>
  );
};

export default MyLocation;
