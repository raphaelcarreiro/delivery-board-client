import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NextComponentType } from 'next';

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

interface OnlyMainProps {
  pageProps: any;
  component: NextComponentType;
}

const OnlyMain: React.FC<OnlyMainProps> = ({ pageProps, component: Component }) => {
  const classes = useStyles({});

  return (
    <div className={classes.wrapper}>
      <div className={classes.containerWrapper}>
        <div className={classes.container}>
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
};

export default OnlyMain;
