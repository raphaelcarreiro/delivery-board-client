import React from 'react';
import CheckoutHeader from './header/CheckoutHeader';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from 'src/hooks/app';
import { PAGE_MAX_WIDTH } from 'src/constants/constants';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 110px)',
    maxWidth: PAGE_MAX_WIDTH,
    margin: '0 auto',
    padding: '20px 20px 0 20px',
    [theme.breakpoints.down('lg')]: {
      maxWidth: 1200,
    },
  },
  mobileContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 125px)',
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
    [theme.breakpoints.down('xs')]: {
      marginTop: 110,
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
