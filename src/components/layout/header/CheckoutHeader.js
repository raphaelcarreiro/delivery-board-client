import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinkNext from 'next/link';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Typography } from '@material-ui/core';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    maxWidth: 1366,
    flex: '1 1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      maxWidth: 1200,
    },
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderBottom: '1px solid #eee',
    padding: '0 15px',
    backgroundColor: '#fff',
    position: 'fixed',
    width: '100%',
    zIndex: 10,
  },
  logoContent: {
    display: 'flex',
  },
  img: {
    width: 70,
  },
  cartLink: ({ cartItems }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    position: 'relative',
    '& svg': {
      marginRight: 10,
    },
    cursor: 'pointer',
  }),
  cartBadge: ({ cartItems }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -15,
    left: 15,
    backgroundColor: cartItems ? theme.palette.primary.dark : theme.palette.primary.dark,
    borderRadius: '50%',
    height: 20,
    width: 20,
    fontSize: 12,
    color: '#FFF',
  }),
}));

export default function CheckoutHeader() {
  const restaurant = useSelector(state => state.restaurant);
  const cart = useSelector(state => state.cart);
  const classes = useStyles({ cartItems: cart.products.length > 0 });
  const user = useSelector(state => state.user);
  const app = useApp();

  function handleCartClick() {
    app.handleCartVisibility();
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logoContent}>
            {restaurant && (
              <LinkNext href="/">
                <a style={{ lineHeight: 0 }}>
                  <img className={classes.img} src={restaurant.image.imageUrl} alt={restaurant.name} />
                </a>
              </LinkNext>
            )}
          </div>
          <Typography variant="h6">
            {user && cart.products.length > 0 && `${user.name}, finalize seu pedido.`}
          </Typography>
          <div>
            <Typography color="primary" onClick={handleCartClick} className={classes.cartLink}>
              {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
              <ShoppingCartIcon color="primary" /> carrinho
            </Typography>
          </div>
        </div>
      </header>
    </>
  );
}
