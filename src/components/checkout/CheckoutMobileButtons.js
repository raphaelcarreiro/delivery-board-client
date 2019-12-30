import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  mobileActions: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      flexDirection: 'row',
    },
  },
  mobileButtonNext: {
    display: 'flex',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  mobileButtonPrior: {
    display: 'flex',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
  },
  mobileButtonMore: {
    display: 'flex',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    borderRight: '2px solid #fafafa',
    borderLeft: '2px solid #fafafa',
  },
}));

CheckoutMobileButtons.propTypes = {
  handleStepPrior: PropTypes.func.isRequired,
  handleStepNext: PropTypes.func.isRequired,
  currentStep: PropTypes.object.isRequired,
};

export default function CheckoutMobileButtons({ handleStepPrior, handleStepNext, currentStep }) {
  const classes = useStyles();

  return (
    <div className={classes.mobileActions}>
      {currentStep.order > 1 && (
        <div className={classes.mobileButtonPrior} onClick={handleStepPrior}>
          <span>VOLTAR</span>
        </div>
      )}
      {currentStep.order < 3 && (
        <div className={classes.mobileButtonNext} onClick={handleStepNext}>
          <span>PRÓXIMO</span>
        </div>
      )}
    </div>
  );
}
