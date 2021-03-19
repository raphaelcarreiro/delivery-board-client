import { Button, makeStyles, Typography } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    height: 200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  message: {
    fontSize: 24,
  },
  icon: {
    fontSize: 52,
  },
});

interface CheckoutErrorProps {
  errorMessage: string;
  handleReset(): void;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ errorMessage, handleReset }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <HighlightOff className={classes.icon} color="error" />
        <Typography align="center" className={classes.message}>
          {errorMessage}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReset}>
          tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default CheckoutError;
