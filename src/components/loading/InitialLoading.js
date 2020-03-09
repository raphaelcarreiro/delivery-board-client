import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fafafa',
    zIndex: 1500,
    flexDirection: 'column',
  },
  progress: {
    width: 250,
    textAlign: 'center',
  },
  text: {
    position: 'absolute',
    bottom: 25,
  },
});

export default function InitialLoading() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.progress}>
        <LinearProgress />
      </div>
      <Typography className={classes.text} variant="body1" color="textSecondary">
        Delivery
      </Typography>
    </div>
  );
}
