import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { CheckoutStep } from './steps/steps';

const useStyles = makeStyles(theme => ({
  mobileActions: {
    display: 'none',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      flexDirection: 'row',
    },
  },
  button: {
    display: 'flex',
    padding: 12,
    alignItems: 'center',
    flex: 1,
    fontSize: 14,
    cursor: 'pointer',
    backgroundColor: '#fff',
    border: 0,
    outline: 0,
  },
  buttonBack: {
    justifyContent: 'flex-start',
  },
  buttonNext: {
    justifyContent: 'flex-end',
  },
  iconRight: {
    marginLeft: 7,
  },
  iconLeft: {
    marginRight: 7,
  },
}));

interface CheckoutButtonsProps {
  handleStepPrior(): void;
  handleStepNext(): void;
  currentStep?: CheckoutStep;
  quantitySteps: number;
}

const CheckoutMobileButtons: React.FC<CheckoutButtonsProps> = ({
  handleStepPrior,
  handleStepNext,
  currentStep,
  quantitySteps,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.mobileActions}>
      {currentStep && currentStep.order > 1 && (
        <button className={`${classes.button} ${classes.buttonBack}`} onClick={handleStepPrior}>
          <ArrowBack className={classes.iconLeft} />
          <Typography>voltar</Typography>
        </button>
      )}
      {currentStep && currentStep.order < quantitySteps - 1 && (
        <button className={`${classes.button} ${classes.buttonNext}`} onClick={handleStepNext}>
          <Typography>próximo</Typography>
          <ArrowForward className={classes.iconRight} />
        </button>
      )}
    </div>
  );
};

export default CheckoutMobileButtons;
