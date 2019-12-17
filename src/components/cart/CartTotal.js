import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  total: {
    fontWeight: 500,
  },
});

export default function CartTotal() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Grid item xs={12} container justify="space-between">
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary" className={classes.total}>
            {cart.formattedTotal}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
