import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

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
    padding: 30,
    [theme.breakpoints.down('md')]: {
      top: 56,
      padding: '15px 15px 20px',
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      top: 50,
    },
  },
  alertContainer: {
    display: 'flex',
    padding: '10px 15px',
    borderRadius: 4,
    background: theme.palette.error.light,
    width: '80%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  alertText: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.error.contrastText,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
}));

const OutOfDeliverableAreaAlert: React.FC = () => {
  const classes = styles();

  return (
    <div className={classes.mapHeader}>
      <div className={classes.alertContainer}>
        <Typography className={classes.alertText}>
          <Warning className={classes.icon} /> Não entregamos nessa localidade
        </Typography>
      </div>
    </div>
  );
};

export default OutOfDeliverableAreaAlert;
