import React, { FC } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';

const styles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    textAlign: 'center',
    '& svg': {
      color: theme.palette.error.main,
      fontSize: 52,
    },
  },
}));

interface CartErrorProps {
  handleReset(): void;
  textError: string;
}

const CartError: FC<CartErrorProps> = ({ handleReset, textError }) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <Error />
      <div>
        <Typography variant="h6">{textError}</Typography>
      </div>
      <Button variant="text" color="primary" onClick={handleReset}>
        voltar
      </Button>
    </div>
  );
};

export default CartError;
