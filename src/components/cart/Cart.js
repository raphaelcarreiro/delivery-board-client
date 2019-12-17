import React from 'react';
import { useSelector } from 'react-redux';
import CartProductList from './CartProductList';
import CartTotal from './CartTotal';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  cart: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyCart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      marginRight: 10,
    },
  },
  action: {
    marginTop: 20,
  },
});

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const router = useRouter();

  function handleCheckoutClick() {
    router.push('/checkout');
  }

  return (
    <>
      {cart.products.length > 0 ? (
        <div className={classes.cart}>
          <Typography className={classes.title} variant="h6" color="textSecondary">
            Na sua cesta tem
          </Typography>
          <CartProductList products={cart.products} />
          <CartTotal />
          <div className={classes.action}>
            <Button size="large" onClick={handleCheckoutClick} variant="contained" color="primary" fullWidth>
              Fechar pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="h6" color="textSecondary">
            Cesta vazia.
          </Typography>
        </div>
      )}
    </>
  );
}
