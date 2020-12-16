import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Cart from '../cart/Cart';
import { useApp } from 'src/App';
import DialogFullscreen from 'src/components/dialog/DialogFullscreen';

const cartWidth = 450;

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 350px)',
    maxWidth: '1366px',
    margin: '0 auto 100px',
    padding: '15px 0 0',
    '@media (max-width:1366px)': {
      '&': {
        padding: '15px 15px 0',
      },
    },
  },
  mobileContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 56px)',
    paddingBottom: 20,
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
      marginTop: 56,
    },
  },
  cart: ({ isCartVisible }: { isCartVisible: boolean }) => ({
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    transform: isCartVisible ? 'none' : `translateX(${cartWidth + 10}px)`,
    position: 'fixed',
    top: 80,
    width: cartWidth,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 0 6px 4px #ddd',
    padding: '10px 20px 20px 20px',
    zIndex: 9,
    overflowY: 'auto',
  }),
  cartContent: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const IndexLayout: React.FC = ({ children }) => {
  const { isMobile, windowWidth, isCartVisible, handleCartVisibility } = useApp();
  const classes = useStyles({ isCartVisible });

  return (
    <div className={classes.wrapper}>
      {!isMobile && windowWidth >= 960 && <Header />}
      {!isMobile && windowWidth >= 960 ? (
        <div className={classes.cart}>
          <Cart />
        </div>
      ) : (
        <>
          {isCartVisible && (
            <DialogFullscreen title="carrinho" handleModalState={() => handleCartVisibility(false)}>
              <div className={classes.cartContent}>
                <Cart />
              </div>
            </DialogFullscreen>
          )}
        </>
      )}
      <div className={classes.containerWrapper}>
        <div className={isMobile || windowWidth < 960 ? classes.mobileContainer : classes.container}>{children}</div>
        {!isMobile && windowWidth >= 960 && <Footer />}
      </div>
    </div>
  );
};

export default IndexLayout;