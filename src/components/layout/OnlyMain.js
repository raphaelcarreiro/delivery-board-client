import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
}));

export default function OnlyMain({ pageProps, component: Component }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Component {...pageProps} />
    </div>
  );
}

OnlyMain.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
};
