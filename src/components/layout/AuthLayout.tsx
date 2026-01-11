import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from 'src/providers/AppProvider';

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

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
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
