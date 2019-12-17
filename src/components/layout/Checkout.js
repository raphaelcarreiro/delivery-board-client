import React, { useContext } from 'react';
import CheckoutHeader from './header/CheckoutHeader';
import Footer from './footer/Footer';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Cart from '../cart/Cart';
import { AppContext } from 'src/App';

const cartWidth = 450;

const useStyles = makeStyles({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 250px)',
    maxWidth: '1366px',
    margin: '0 auto 100px',
    padding: '15px 0 0 20px',
  },
  mobileContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 235px)',
    marginBottom: 100,
    padding: '0 20px',
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
    marginTop: 80,
  },
  cart: ({ isCartVisible }) => ({
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    transform: isCartVisible ? 'none' : `translateX(${cartWidth}px)`,
    position: 'fixed',
    top: 80,
    minWidth: cartWidth,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 0 6px 4px #ddd',
    padding: 20,
    zIndex: 9,
  }),
});

export default function Checkout({ pageProps, component: Component, isMobile, windowWidth }) {
  const app = useContext(AppContext);
  const classes = useStyles({ isCartVisible: app.isCartVisible });

  return (
    <div className={classes.wrapper}>
      {!isMobile && windowWidth >= 960 && <CheckoutHeader />}
      <div className={classes.containerWrapper}>
        <div className={isMobile || windowWidth < 960 ? classes.mobileContainer : classes.container}>
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </div>
  );
}

Checkout.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  isMobile: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired,
};
