import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  loading: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1400,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circularProgress: {
    top: '25%',
    position: 'absolute',
  },
  background: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  body: {
    overflowY: 'hidden',
    paddingRight: 17,
  },
});

function Loading({ background }) {
  const classes = useStyles();

  return (
    <div className={background ? `${classes.loading} ${classes.background}` : `${classes.loading}`}>
      <CircularProgress className={classes.circularProgress} color={'primary'} />
    </div>
  );
}

Loading.propTypes = {
  background: PropTypes.bool,
};

export default Loading;
