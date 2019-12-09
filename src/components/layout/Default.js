import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    maxWidth: 1366,
    margin: '0 auto',
    paddingTop: 15,
    minHeight: 'calc(100vh - 150px)',
    position: 'relative',
  },
  mobileContainer: {
    margin: '80px 0 0',
    padding: '0 20px',
    minHeight: 'calc(100vh - 150px)',
    position: 'relative',
    display: 'flex',
  },
});

export default function Default({ pageProps, component: Component, isMobile, windowWidth }) {
  const classes = useStyles();

  return (
    <>
      <Header />
      <div className={isMobile || windowWidth < 1280 ? classes.mobileContainer : classes.container}>
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  );
}

Default.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  isMobile: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired,
};
