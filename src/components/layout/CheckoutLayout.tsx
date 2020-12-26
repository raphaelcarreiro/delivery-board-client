import React from 'react';
import CheckoutHeader from './header/CheckoutHeader';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 250px)',
    maxWidth: '1366px',
    margin: '0 auto 100px',
    padding: '20px 20px 0 20px',
    [theme.breakpoints.down('lg')]: {
      maxWidth: 1200,
    },
  },
  mobileContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 106px)',
    padding: '20px 20px 30px',
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
    [theme.breakpoints.down('sm')]: {
      marginTop: 56,
    },
  },
}));

const CheckoutLayout: React.FC = ({ children }) => {
  const { isMobile, windowWidth } = useApp();
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {!isMobile && windowWidth >= 960 && <CheckoutHeader />}
      <div className={classes.containerWrapper}>
        <div className={isMobile || windowWidth < 960 ? classes.mobileContainer : classes.container}>{children}</div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
