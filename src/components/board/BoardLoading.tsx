import { makeStyles } from '@material-ui/core';
import React from 'react';

const styles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gap: 30,
    gridTemplateColumns: '1.5fr 0.5fr',
    flex: 1,
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gridAutoRows: 'min-content',
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 30,
  },
  headerFirstLine: {
    height: 32,
    width: '20%',
  },
  headerSecondLine: {
    height: 20,
    width: 200,
  },
  button: {
    height: 37,
  },
  total: {
    height: 200,
  },
  buttonsContent: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  moduleItem: {
    height: 100,
  },
}));
const BoardLoading: React.FC = () => {
  const classes = styles();

  return (
    <>
      <div className={classes.header}>
        <div className={`animated-background ${classes.headerFirstLine}`} />
        <div className={`animated-background ${classes.headerSecondLine}`} />
      </div>

      <div className={classes.container}>
        <div className={classes.content}>
          <div className={`animated-background ${classes.moduleItem}`} />
          <div className={`animated-background ${classes.moduleItem}`} />
        </div>

        <div className={classes.buttonsContent}>
          <div className={`animated-background ${classes.button}`} />
          <div className={`animated-background ${classes.button}`} />
          <div className={`animated-background ${classes.button}`} />
          <div className={`animated-background ${classes.button}`} />
        </div>
      </div>
    </>
  );
};

export default BoardLoading;
