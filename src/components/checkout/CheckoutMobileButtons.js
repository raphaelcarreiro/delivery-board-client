import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Typography } from '@material-ui/core';

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
}));

CheckoutMobileButtons.propTypes = {
  handleStepPrior: PropTypes.func.isRequired,
  handleStepNext: PropTypes.func.isRequired,
  currentStep: PropTypes.object.isRequired,
  quantitySteps: PropTypes.number.isRequired,
};

export default function CheckoutMobileButtons({ handleStepPrior, handleStepNext, currentStep, quantitySteps }) {
  const classes = useStyles();

  return (
    <div className={classes.mobileActions}>
      {currentStep.order > 1 && (
        <button className={`${classes.button} ${classes.buttonBack}`} onClick={handleStepPrior}>
          <FiChevronLeft />
          <Typography>voltar</Typography>
        </button>
      )}
      {currentStep.order < quantitySteps - 1 && (
        <button className={`${classes.button} ${classes.buttonNext}`} onClick={handleStepNext}>
          <Typography>próximo</Typography>
          <FiChevronRight />
        </button>
      )}
    </div>
  );
}
