import React, { useContext } from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import InputIcon from '@material-ui/icons/Input';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { menuWidth, AppContext } from '../../App';
import Link from '../link/Link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: menuWidth,
    backgroundColor: theme.palette.secondary.main,
    '@media print': {
      display: 'none',
    },
  },
  listItemIcon: {
    color: theme.palette.primary.contrastText,
  },
  listItemText: {
    color: '#fff',
  },
  drawerHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 16px',
  },
  drawerHeaderTitle: {
    color: theme.palette.primary.contrastText,
  },
  expandColor: {
    color: '#fff',
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    '& svg': {
      marginRight: 10,
    },
  },
  cartBadge: ({ cartItems }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    backgroundColor: cartItems ? '#dc640f' : '#dc640f',
    borderRadius: '50%',
    height: 20,
    width: 20,
    fontSize: 12,
    color: '#FFF',
  }),
  avatar: {
    width: 30,
    height: 30,
  },
}));

Sidebar.propTypes = {
  handleOpenMenu: PropTypes.func.isRequired,
  isOpenMenu: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

function Sidebar({ handleOpenMenu, isOpenMenu, handleLogout }) {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant);
  const cart = useSelector(state => state.cart);
  const classes = useStyles({ cartItems: cart.products.length > 0 });
  const app = useContext(AppContext);

  function handleClick() {
    handleOpenMenu();
  }

  function handleLoginClick() {
    router.push('/login');
    handleOpenMenu();
  }

  function handleAccountClick() {
    router.push('/account');
    handleOpenMenu();
  }

  function handleOrdersClick() {
    router.push('/account/orders');
    handleOpenMenu();
  }

  function handleLogoutClick() {
    app.handleLogout();
    handleOpenMenu();
  }

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      classes={{ paper: classes.drawerPaper }}
      open={isOpenMenu}
      onClose={handleOpenMenu}
    >
      <div className={classes.drawerHeader}>
        {restaurant && (
          <Typography color="inherit" variant="body2">
            {restaurant.name}
          </Typography>
        )}
      </div>
      <ListItem component={Link} href="/" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Início" />
      </ListItem>
      <ListItem component={Link} href="/menu" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Cardápio" />
      </ListItem>
      <ListItem component={Link} href="/cart" onClick={handleClick} button>
        {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
        <ListItemIcon className={classes.listItemIcon}>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Carrinho" />
      </ListItem>
      {user.id ? (
        <>
          <ListItem button onClick={handleOrdersClick}>
            <ListItemIcon className={classes.listItemIcon}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.listItemText }} primary="Meus pedidos" />
          </ListItem>
          <ListItem button onClick={handleAccountClick}>
            <ListItemIcon className={classes.listItemIcon}>
              {user.image ? <Avatar src={user.image.imageUrl} className={classes.avatar} /> : <PersonIcon />}
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.listItemText }} primary={user.name} />
          </ListItem>
          <ListItem button onClick={handleLogoutClick}>
            <ListItemIcon className={classes.listItemIcon}>
              <InputIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.listItemText }} primary="Sair" />
          </ListItem>
        </>
      ) : (
        <ListItem onClick={handleLoginClick} button>
          <ListItemIcon className={classes.listItemIcon}>
            <InputIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.listItemText }} primary="Entrar" />
        </ListItem>
      )}
    </Drawer>
  );
}

export default Sidebar;
