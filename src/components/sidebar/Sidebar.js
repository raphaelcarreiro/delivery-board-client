import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Link from '../link/Link';
import ChatIcon from '@material-ui/icons/Chat';
import LocalOfferIcons from '@material-ui/icons/LocalOffer';
import { FiLogIn } from 'react-icons/fi';
import { MENU_WIDTH } from 'src/constants/constants';
import { useApp } from 'src/hooks/app';
import SidebarItem from './SidebarItem';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: MENU_WIDTH,
    backgroundColor: theme.palette.secondary.main,
    '& a': {
      color: theme.palette.secondary.contrastText,
    },
    '@media print': {
      display: 'none',
    },
  },
  sidebarItem: {
    color: theme.palette.secondary.contrastText,
  },
  drawerHeader: {
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 20px',
    position: 'relative',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  drawerHeaderTitle: {
    color: theme.palette.primary.contrastText,
  },
  cartBadge: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    height: 23,
    width: 23,
    fontSize: 12,
    color: '#FFF',
    border: `2px solid ${theme.palette.primary.dark}`,
  },
  avatar: {
    width: 44,
    height: 44,
    border: `2px solid ${theme.palette.primary.dark}`,
  },
  restaurantName: {
    fontSize: 20,
  },
  headerTitle: {
    whiteSpace: 'wrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 150,
  },
  developer: {
    padding: 25,
    color: '#fff',
  },
}));

function Sidebar() {
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant);
  const cart = useSelector(state => state.cart);
  const { readyToInstall, handleOpenMenu, isOpenMenu } = useApp();

  const classes = useStyles({
    cartItems: cart.products.length > 0,
    restaurantIsOpen: restaurant && restaurant.is_open,
    readyToInstall: readyToInstall,
  });

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      classes={{ paper: classes.drawerPaper }}
      open={isOpenMenu}
      onClose={handleOpenMenu}
    >
      <div className={classes.drawerHeader}>
        <Typography color="inherit" noWrap className={classes.restaurantName}>
          {restaurant?.name}
        </Typography>
      </div>
      <SidebarItem icon={<HomeIcon />} href="/" label="início" />
      <SidebarItem icon={<LocalOfferIcons />} href="/offers" label="ofertas" />
      <SidebarItem icon={<MenuBookIcon />} href="/menu" label="cardápio" />

      <ListItem component={Link} href="/cart" onClick={handleOpenMenu} button>
        {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
        <ListItemIcon className={classes.sidebarItem}>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.sidebarItem }} primary="carrinho" />
      </ListItem>

      <SidebarItem icon={<ChatIcon />} href="/contact" label="contato" />

      {user.id ? (
        <>
          <SidebarItem icon={<AssignmentIcon />} href="/account/orders" label="meus pedidos" />

          <SidebarItem
            icon={user.image ? <Avatar src={user.image.imageUrl} className={classes.avatar} /> : <PersonIcon />}
            href="/account"
            label={user.name}
          />
        </>
      ) : (
        <SidebarItem icon={<FiLogIn size={20} />} href="/login" label="entrar" />
      )}
      <div className={classes.developer}>
        <Typography color="inherit" variant="body2">
          Quer ter um app como esse?
        </Typography>
        <a href="https://www.sgrande.delivery" target="blank">
          ir para sgrande.delivery
        </a>
      </div>
    </Drawer>
  );
}

export default Sidebar;
