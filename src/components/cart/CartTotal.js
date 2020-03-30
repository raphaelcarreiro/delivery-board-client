import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  total: {
    fontWeight: 500,
  },
  cartValuesContent: {
    marginBottom: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  cartValues: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
});

export default function CartTotal() {
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={classes.cartValuesContent}>
          {cart.coupon && (
            <>
              <div className={classes.cartValues}>
                <Typography>Subtotal</Typography>
                <Typography align="right">{cart.formattedSubtotal}</Typography>
              </div>
              <div className={classes.cartValues}>
                <Typography>Desconto</Typography>
                <Typography align="right">{cart.formattedDiscount}</Typography>
              </div>
            </>
          )}
          {cart.tax > 0 && (
            <div className={classes.cartValues}>
              <div>
                <Typography>Taxa de entrega</Typography>
                {restaurant.configs.tax_mode === 'order_value' ? (
                  <Typography variant="caption" color="textSecondary" align="center">
                    {`Será cobrada para os pedidos inferiores a ${restaurant.configs.formattedOrderMinimumValue}`}
                  </Typography>
                ) : (
                  restaurant.configs.tax_mode === 'district' && (
                    <Typography variant="caption" color="textSecondary" align="center">
                      De acordo com o bairro selecionado
                    </Typography>
                  )
                )}
              </div>
              <Typography align="right">{cart.formattedTax}</Typography>
            </div>
          )}
        </div>
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
