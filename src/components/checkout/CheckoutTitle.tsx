import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useCheckout } from './steps/hooks/useCheckout';

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: 25,
  },
  stepDescription: {
    fontSize: 24,
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  step: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 10,
    border: `2px solid ${theme.palette.primary.dark}`,
  },
}));

const CheckoutTitle: React.FC = () => {
  const classes = useStyles();
  const { currentStep } = useCheckout();

  return (
    <div className={classes.title}>
      <Typography variant="h6" className={classes.stepDescription}>
        {/* <span className={classes.step}>{currentStep?.order}</span> */}
        {currentStep?.description}
      </Typography>
    </div>
  );
};

export default CheckoutTitle;
