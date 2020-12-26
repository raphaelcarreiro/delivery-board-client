import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles({
  container: (props: { windowHeight: number }) => ({
    display: 'flex',
    position: 'relative',
    minHeight: `${props.windowHeight}px`,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

const AuthLayout: React.FC = ({ children }) => {
  const { windowHeight } = useApp();
  const classes = useStyles({ windowHeight });

  return (
    <div className={classes.wrapper}>
      <div className={classes.containerWrapper}>
        <div className={classes.container}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
