import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fafafa',
    zIndex: 1500,
    flexDirection: 'column',
  },
  progress: {
    marginTop: 30,
    width: 200,
    textAlign: 'center',
  },
  text: {
    position: 'absolute',
    bottom: 60,
    fontWeight: 300,
  },
  content: {
    top: '30%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& .logo': {
      width: 100,
    },
  },
});

export default function InitialLoading() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <img className="logo" src="/images/logo192.png" alt="Logo Sgrande Delivery" />
        <div className={classes.progress}>
          <LinearProgress />
        </div>
      </div>
      <Typography className={classes.text} variant="h6" color="textSecondary">
        sgrande.delivery
      </Typography>
    </div>
  );
}
