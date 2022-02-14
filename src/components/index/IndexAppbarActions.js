import React from 'react';
import { IconButton } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useApp } from 'src/providers/AppProvider';

const useStyles = makeStyles(theme => ({
  cartBadge: ({ cartItems }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 3,
    left: 25,
    backgroundColor: cartItems ? theme.palette.primary.dark : theme.palette.primary.dark,
    borderRadius: '50%',
    height: 20,
    width: 20,
    fontSize: 12,
    color: '#FFF',
  }),
}));

export default function IndexAppbarActions() {
  const cart = useSelector(state => state.cart);
  const classes = useStyles({ cartItems: cart.products.length > 0 });
  const app = useApp();

  return (
    <>
      <IconButton onClick={() => app.handleCartVisibility()} color="inherit">
        {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
        <ShoppingCartIcon />
      </IconButton>
    </>
  );
}
