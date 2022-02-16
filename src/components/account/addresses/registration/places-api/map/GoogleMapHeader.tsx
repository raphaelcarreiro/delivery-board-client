import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Address } from 'src/types/address';

const styles = makeStyles(theme => ({
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
    padding: '20px 30px',
    textAlign: 'center',
    '& > p': {
      fontWeight: 500,
    },
    [theme.breakpoints.down('md')]: {
      top: 56,
      padding: '15px 15px 20px',
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      top: 50,
    },
  },
}));

interface GoogleMapHeaderProps {
  address: Address;
}

const GoogleMapHeader: React.FC<GoogleMapHeaderProps> = ({ address }) => {
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

export default GoogleMapHeader;
