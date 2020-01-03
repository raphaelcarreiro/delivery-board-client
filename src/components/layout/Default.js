import React, { useContext } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Cart from '../cart/Cart';
import { AppContext } from 'src/App';
import DialogFullscreen from 'src/components/dialog/DialogFullscreen';

const cartWidth = 450;

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 460px)',
    maxWidth: '1366px',
    margin: '0 auto 100px',
    padding: '15px 0 0 20px',
  },
  mobileContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 86px)',
    marginBottom: 15,
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
    [theme.breakpoints.down('md')]: {
      marginTop: 71,
    },
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
    padding: '10px 20px 20px 20px',
    zIndex: 9,
    overflowY: 'auto',
  }),
}));

export default function Default({ pageProps, component: Component, isMobile, windowWidth }) {
  const app = useContext(AppContext);
  const classes = useStyles({ isCartVisible: app.isCartVisible });

  return (
    <div className={classes.wrapper}>
      {!isMobile && windowWidth >= 960 && <Header />}
      {!isMobile && windowWidth >= 960 ? (
        <div className={classes.cart}>
          <Cart />
        </div>
      ) : (
        <>
          {app.isCartVisible && (
            <DialogFullscreen title="Carrinho" handleModalState={() => app.handleCartVisibility(false)}>
              <Cart />
            </DialogFullscreen>
          )}
        </>
      )}
      <div className={classes.containerWrapper}>
        <div className={isMobile || windowWidth < 960 ? classes.mobileContainer : classes.container}>
          <Component {...pageProps} />
        </div>
        {!isMobile && windowWidth >= 960 && <Footer />}
      </div>
    </div>
  );
}

Default.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  isMobile: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired,
};
