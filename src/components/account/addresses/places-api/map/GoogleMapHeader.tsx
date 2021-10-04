import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Address } from 'src/types/address';

const styles = makeStyles({
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
});

interface GoogleMapHeaderProps {
  address: Address;
}

const GoogleMap: React.FC<GoogleMapHeaderProps> = ({ address }) => {
  const classes = styles();

  return (
    <>
      {address.address ? (
        <div className={classes.mapHeader}>
          {address.number ? (
            <Typography>{`${address.address}, ${address.number}`}</Typography>
          ) : (
            <Typography>{address.address}</Typography>
          )}
          {address.district ? (
            <Typography color="textSecondary">{`${address.district}, ${address.city}, ${address.region}`}</Typography>
          ) : (
            <Typography color="textSecondary">{`${address.city}, ${address.region}`}</Typography>
          )}
        </div>
      ) : (
        <div className={classes.mapHeader}>
          <Typography>Não foi possível encontrar a localização</Typography>
        </div>
      )}
    </>
  );
};

export default GoogleMap;
