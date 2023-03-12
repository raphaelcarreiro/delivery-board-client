import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinkNext from 'next/link';
import { useSelector } from 'react-redux';
import { PAGE_MAX_WIDTH } from 'src/constants/constants';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    maxWidth: PAGE_MAX_WIDTH,
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
    backgroundColor: '#f5f5f5',
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
  cartLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    position: 'relative',
    '& svg': {
      marginRight: 10,
    },
    cursor: 'pointer',
  },
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

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logoContent}>
            {restaurant && (
              <LinkNext href="/" style={{ lineHeight: 0 }}>
                <img className={classes.img} src={restaurant.image.imageUrl} alt={restaurant.name} />
              </LinkNext>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
