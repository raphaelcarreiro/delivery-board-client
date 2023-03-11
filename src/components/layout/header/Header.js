import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem, Avatar, Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import InputIcon from '@material-ui/icons/Input';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LocalOfferIcons from '@material-ui/icons/LocalOffer';
import Link from '../../link/Link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useAuth } from 'src/providers/AuthProvider';
import { useApp } from 'src/providers/AppProvider';
import { PAGE_MAX_WIDTH } from 'src/constants/constants';

const useStyles = makeStyles((theme) => ({
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
  cartLink: ({ cartItems }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: 17,
    position: 'relative',
    fontWeight: 300,
    '& svg': {
      marginRight: 10,
    },
    cursor: 'pointer',
  }),
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
  const { logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const restaurant = useSelector((state) => state.restaurant) || {};
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const classes = useStyles({
    cartItems: cart.products.length > 0,
    restaurantIsOpen: restaurant && restaurant.is_open,
  });

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleMyAccountClick() {
    handleCloseMenu();
    router.push('/account');
  }

  function handleLogoutClick() {
    handleCloseMenu();
    logout();
  }

  function handleMyOrdersClick() {
    handleCloseMenu();
    router.push('/account/orders');
  }

  function handleCartClick() {
    handleCartVisibility();
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logo}>
            {restaurant.id ? (
              <Link href="/" className={classes.linkHome}>
                <img className={classes.img} src={restaurant.image.imageUrl} alt={restaurant.name} />
              </Link>
            ) : (
              <span>Carregando...</span>
            )}
          </div>
          <div className={classes.headerLinks}>
            <div>
              <Link href="/offers" className={classes.link}>
                <LocalOfferIcons color="primary" /> ofertas
              </Link>
            </div>
            <div>
              <Link href="/menu" className={classes.link}>
                <MenuBookIcon color="primary" /> cardápio
              </Link>
            </div>
            <div>
              <Typography onClick={handleCartClick} className={classes.cartLink}>
                {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
                <ShoppingCartIcon color="primary" /> carrinho
              </Typography>
            </div>
            <div>
              {!user.id ? (
                <>
                  {restaurant.configs && (
                    <Link
                      href={restaurant.configs.require_login ? '/login' : '/guest-register'}
                      className={classes.link}
                    >
                      <InputIcon color="primary" /> entrar
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Menu
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={handleMyAccountClick}>minha conta</MenuItem>
                    <MenuItem onClick={handleMyOrdersClick}>meus pedidos</MenuItem>
                    <MenuItem onClick={handleLogoutClick}>sair</MenuItem>
                  </Menu>
                  <IconButton className={classes.btnAvatar} onClick={(event) => setAnchorEl(event.currentTarget)}>
                    {user.image ? (
                      <Avatar src={user.image.imageUrl} className={classes.avatar} />
                    ) : (
                      <Avatar>{user.name[0]}</Avatar>
                    )}
                  </IconButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
