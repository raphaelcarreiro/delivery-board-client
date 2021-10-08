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

const OutOfDeliverableAreaAlert: React.FC = () => {
  const classes = styles();

  return (
    <div className={classes.mapHeader}>
      <Typography color="error">Fora da área de entrega do restaurante</Typography>
    </div>
  );
};

export default OutOfDeliverableAreaAlert;
