import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    maxWidth: 1396,
    margin: '0 auto 100px',
    padding: '15px 15px 0',
    minHeight: 'calc(100vh - 250px)',
    position: 'relative',
    alignItems: 'flex-start',
  },
  mobileContainer: {
    marginTop: 65,
    marginBottom: 100,
    padding: '0 20px',
    minHeight: 'calc(100vh - 235px)',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default function Default({ pageProps, component: Component, isMobile, windowWidth }) {
  const classes = useStyles();

  return (
    <>
      {!isMobile && windowWidth >= 960 && <Header />}
      <div className={isMobile || windowWidth < 960 ? classes.mobileContainer : classes.container}>
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
