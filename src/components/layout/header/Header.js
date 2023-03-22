import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalOfferIcons from '@material-ui/icons/LocalOffer';
import Link from '../../link/Link';
import { useSelector } from 'react-redux';
import { useApp } from 'src/providers/AppProvider';
import { PAGE_MAX_WIDTH } from 'src/constants/constants';
import { AssignmentOutlined, RestaurantMenuOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    maxWidth: PAGE_MAX_WIDTH,
    flex: 1,
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
  logo: {
    display: 'flex',
  },
  img: {
    width: 70,
    height: 70,
    objectFit: 'cover',
  },
  cartBadge: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -15,
    left: 15,
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '50%',
    height: 20,
    width: 20,
    fontSize: 12,
    color: '#FFF',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 17,
    position: 'relative',
    fontWeight: 300,
    '& svg': {
      marginRight: 10,
    },
  },
  cartLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 17,
    position: 'relative',
    fontWeight: 300,
    '& svg': {
      marginRight: 10,
    },
    cursor: 'pointer',
  },
  status: ({ restaurantIsOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& svg': {
      marginRight: 10,
      color: restaurantIsOpen ? '#28a745' : '#dc3545',
    },
  }),
  btnAvatar: {
    padding: 0,
  },
  headerLinks: {
    display: 'flex',
    alignItems: 'center',
    '&>div': {
      padding: 7,
    },
  },
  statusIcon: {
    fontSize: 30,
  },
  linkHome: {
    lineHeight: 0,
  },
  avatar: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

export default function Header() {
  const { handleCartVisibility } = useApp();
  const restaurant = useSelector(state => state.restaurant) || {};
  const cart = useSelector(state => state.cart);
  const classes = useStyles({
    cartItems: cart.products.length > 0,
    restaurantIsOpen: restaurant && restaurant.is_open,
  });
  const movement = useSelector(state => state.boardMovement);

  function handleCartClick() {
    handleCartVisibility();
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logo}>
            {restaurant.id ? (
              <Link
                href={{ pathname: '/', query: movement ? { session: movement.id } : undefined }}
                className={classes.linkHome}
              >
                <img className={classes.img} src={restaurant.image.imageUrl} alt={restaurant.name} />
              </Link>
            ) : (
              <span>Carregando...</span>
            )}
          </div>
          <div className={classes.headerLinks}>
            <div>
              <Link
                href={{ pathname: '/offers', query: movement ? { session: movement.id } : undefined }}
                className={classes.link}
              >
                <LocalOfferIcons color="primary" /> ofertas
              </Link>
            </div>
            <div>
              <Link
                href={{ pathname: '/menu', query: movement ? { session: movement.id } : undefined }}
                className={classes.link}
              >
                <RestaurantMenuOutlined color="primary" /> cardápio
              </Link>
            </div>
            <div>
              <Typography onClick={handleCartClick} className={classes.cartLink}>
                {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
                <ShoppingCartIcon color="primary" /> carrinho
              </Typography>
            </div>
            <div>
              <Link
                href={{ pathname: '/board', query: movement ? { session: movement.id } : undefined }}
                className={classes.link}
              >
                <AssignmentOutlined color="primary" /> mesa
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
