import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  containerWrapper: {
    overflowY: 'auto',
    position: 'relative',
  },
}));

export default function OnlyMain({ pageProps, component: Component }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.containerWrapper}>
        <div className={classes.container}>
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}

OnlyMain.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
};
