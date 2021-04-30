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
    marginBottom: 50,
  },
  cartValues: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
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
          {cart.discount > 0 && (
            <>
              <div className={classes.cartValues}>
                <Typography>subtotal</Typography>
                <Typography align="right">{cart.formattedSubtotal}</Typography>
              </div>
              <div className={classes.cartValues}>
                <Typography>desconto</Typography>
                <Typography align="right">{cart.formattedDiscount}</Typography>
              </div>
            </>
          )}
          {cart.tax > 0 && (
            <div className={classes.cartValues}>
              <div>
                <Typography>taxa de entrega</Typography>
                {restaurant.configs.tax_mode === 'order_value' ? (
                  <Typography variant="caption" color="textSecondary" align="center">
                    {`cobrada para os pedidos inferiores a ${restaurant.configs.formattedOrderMinimumValue}`}
                  </Typography>
                ) : restaurant.configs.tax_mode === 'district' ? (
                  <>
                    <Typography variant="caption" color="textSecondary" display="block">
                      valor determinado por bairro
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      {order.shipment.district}, {order.shipment.city}
                    </Typography>
                  </>
                ) : (
                  restaurant.configs.tax_mode === 'products_amount' && (
                    <Typography variant="caption" color="textSecondary" align="center">
                      {`cobrada para pedido com quantidade de produtos inferior ou igual a ${restaurant.configs.order_minimum_products_amount}`}
                    </Typography>
                  )
                )}
              </div>
              <Typography align="right">{cart.formattedTax}</Typography>
            </div>
          )}
        </div>
        <Grid item xs={12} container justify="space-between">
          <Typography variant="h6">total</Typography>
          <Typography variant="h5" className={classes.total}>
            {cart.formattedTotal}
          </Typography>
        </Grid>
      </div>
    </>
  );
}
