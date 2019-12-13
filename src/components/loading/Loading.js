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
    overflow: 'none',
  },
  circularProgress: {
    top: '25%',
    position: 'absolute',
  },
  background: ({ background }) => ({
    backgroundColor: background || '#fafafa',
  }),
  body: {
    overflowY: 'hidden',
    paddingRight: 17,
  },
});

function Loading({ background }) {
  const classes = useStyles({ background });

  return (
    <div className={background ? `${classes.loading} ${classes.background}` : `${classes.loading}`}>
      <CircularProgress color={'primary'} />
    </div>
  );
}

Loading.propTypes = {
  background: PropTypes.string,
};

export default Loading;
