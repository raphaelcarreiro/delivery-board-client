import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  actions: ({ step }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: step > 1 ? 'space-between' : 'flex-end',
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }),
}));

CheckoutButtons.propTypes = {
  handleStepPrior: PropTypes.func.isRequired,
  handleStepNext: PropTypes.func.isRequired,
  currentStep: PropTypes.object.isRequired,
};

export default function CheckoutButtons({ handleStepPrior, handleStepNext, currentStep }) {
  const classes = useStyles({ step: currentStep.order });

  return (
    <div className={classes.actions}>
      {currentStep.order > 1 && (
        <Button size="large" variant="text" color="primary" onClick={handleStepPrior}>
          Voltar
        </Button>
      )}
      {currentStep.order < 3 && (
        <Button size="large" color="primary" variant="contained" onClick={handleStepNext}>
          Próximo
        </Button>
      )}
    </div>
  );
}
