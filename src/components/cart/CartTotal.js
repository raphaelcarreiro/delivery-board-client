import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  total: {
    fontWeight: 500,
  },
  discount: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default function CartTotal() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        {cart.coupon && (
          <>
            <div className={classes.discount}>
              <Typography>Subtotal</Typography>
              <Typography>{cart.formattedSubtotal}</Typography>
            </div>
            <div className={classes.discount}>
              <Typography>Desconto</Typography>
              <Typography>{cart.formattedDiscount}</Typography>
            </div>
          </>
        )}
        <Grid item xs={12} container justify="space-between">
          <Typography variant="h6">Total</Typography>
          <Typography variant="h5" className={classes.total}>
            {cart.formattedTotal}
          </Typography>
        </Grid>
      </div>
    </>
  );
}
