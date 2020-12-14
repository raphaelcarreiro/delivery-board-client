import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
});

const AuthLayout: React.FC = ({ children }) => {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      <div className={classes.containerWrapper}>
        <div className={classes.container}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
