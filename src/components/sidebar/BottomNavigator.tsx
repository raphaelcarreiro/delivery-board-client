import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'src/store/redux/selector';
import Link from 'next/link';
import {
  AssignmentOutlined,
  HomeOutlined,
  LocalOfferOutlined,
  RestaurantMenuOutlined,
  ShoppingCartOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  nav: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    borderTop: '1px solid #eee',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  content: {
    display: 'flex',
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  link: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    color: '#3f3e3e',
    alignItems: 'center',
    '& > span': {
      fontSize: 12,
    },
    '& svg': {
      fontSize: 24,
    },
    '&.active': {
      color: theme.palette.primary.main,
    },
  },
  cartBadge: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 35,
    top: 1,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    height: 18,
    width: 18,
    fontSize: '10px!important',
    color: '#FFF',
    border: `2px solid ${theme.palette.primary.dark}`,
  },
}));

type Pages = 'home' | 'offers' | 'cart' | 'board' | 'menu';

const BottomNavigator: FC = () => {
  const classes = useStyles();
  const cart = useSelector(state => state.cart);
  const [activePage, setActivePage] = useState<Pages>('home');
  const router = useRouter();
  const movement = useSelector(state => state.boardMovement);

  useEffect(() => {
    const path = router.pathname.replace('/', '');

    if (!path) {
      setActivePage('home');
      return;
    }

    if (path.includes('menu')) {
      setActivePage('menu');
      return;
    }

    setActivePage(path as Pages);
  }, [router]);

  function getClassName(page: Pages) {
    return activePage === page ? `${classes.link} active` : classes.link;
  }

  return (
    <nav className={classes.nav}>
      <div className={classes.content}>
        <Link
          href={{ pathname: '/', query: movement?.id }}
          onClick={() => setActivePage('home')}
          className={getClassName('home')}
        >
          <HomeOutlined />
          <span>início</span>
        </Link>

        <Link
          href={{ pathname: '/offers', query: movement ? { session: movement?.id } : undefined }}
          onClick={() => setActivePage('offers')}
          className={getClassName('offers')}
        >
          <LocalOfferOutlined />
          <span>ofertas</span>
        </Link>

        <Link
          href={{ pathname: '/menu', query: movement ? { session: movement?.id } : undefined }}
          onClick={() => setActivePage('menu')}
          className={getClassName('menu')}
        >
          <RestaurantMenuOutlined />
          <span>cardápio</span>
        </Link>

        <Link
          href={{ pathname: '/cart', query: movement ? { session: movement?.id } : undefined }}
          onClick={() => setActivePage('cart')}
          className={getClassName('cart')}
        >
          <ShoppingCartOutlined />
          {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
          <span>carrinho</span>
        </Link>

        <Link
          href={{ pathname: '/board', query: movement ? { session: movement?.id } : undefined }}
          onClick={() => setActivePage('board')}
          className={getClassName('board')}
        >
          <AssignmentOutlined />
          <span>mesa</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigator;
