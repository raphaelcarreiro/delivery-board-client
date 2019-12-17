import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import LinkNext from 'next/link';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    maxWidth: 1366,
    flex: '1 1',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    boxShadow: '1px 1px 7px 1px #d4d4d4',
    padding: '0 15px',
    backgroundColor: '#fff',
    position: 'fixed',
    width: '100%',
    zIndex: 10,
  },
  logoContent: {
    display: 'flex',
    flex: '1',
  },
  img: {
    width: 80,
  },
}));

export default function CheckoutHeader() {
  const restaurant = useSelector(state => state.restaurant);
  const cart = useSelector(state => state.cart);
  const classes = useStyles({ cartItems: cart.products.length > 0 });

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <Grid container alignItems="center">
            <div className={classes.logoContent}>
              {restaurant ? (
                <LinkNext href="/">
                  <a style={{ display: 'flex' }}>
                    <img className={classes.img} src={restaurant.image.imageUrl} alt={restaurant.name} />
                  </a>
                </LinkNext>
              ) : (
                <span>Carregando...</span>
              )}
            </div>
          </Grid>
        </div>
      </header>
    </>
  );
}
