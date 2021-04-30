import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useCheckout } from './hooks/useCheckout';
import { ArrowBack } from '@material-ui/icons';

interface UseStylesProps {
  step?: number;
}

const useStyles = makeStyles(theme => ({
  actions: ({ step }: UseStylesProps) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: step && step > 1 ? 'space-between' : 'flex-end',
    marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),
}));

const CheckoutButtons: React.FC = () => {
  const { currentStep, handleStepPrior } = useCheckout();
  const classes = useStyles({ step: currentStep?.order });

  return (
    <div className={classes.actions}>
      {currentStep && currentStep?.order > 1 && currentStep.id !== 'STEP_CONFIRM' && (
        <Button startIcon={<ArrowBack />} size="large" variant="text" color="primary" onClick={handleStepPrior}>
          Voltar
        </Button>
      )}
    </div>
  );
};

export default CheckoutButtons;
