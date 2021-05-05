import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Cart from '../cart/Cart';
import DialogFullscreen from 'src/components/dialog/DialogFullscreen';
import { APPBAR_HEIGHT, CART_WIDTH, PAGE_MAX_WIDTH } from '../../constants/constants';
import { useApp } from 'src/hooks/app';

type StyleProps = {
  isCartVisible: boolean;
  windowHeight: number;
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 350px)',
    maxWidth: PAGE_MAX_WIDTH,
    margin: '0 auto 100px',
    padding: '15px 0 0',
    [theme.breakpoints.down('lg')]: {
      // maxWidth: 1200,
    },
    [theme.breakpoints.down('md')]: {
      padding: '15px 15px 0',
    },
  },
  mobileContainer: ({ windowHeight }: StyleProps) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: windowHeight - 56,
    paddingBottom: 20,
  }),
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
    [theme.breakpoints.down('sm')]: {
      marginTop: APPBAR_HEIGHT,
    },
  },
  cart: ({ isCartVisible }: StyleProps) => ({
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    transform: isCartVisible ? 'none' : `translateX(${CART_WIDTH + 10}px)`,
    position: 'fixed',
    top: 80,
    width: CART_WIDTH,
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
  const { isMobile, windowWidth, isCartVisible, handleCartVisibility, windowHeight } = useApp();
  const classes = useStyles({ isCartVisible, windowHeight });

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
        <Footer />
      </div>
    </div>
  );
};

export default IndexLayout;
