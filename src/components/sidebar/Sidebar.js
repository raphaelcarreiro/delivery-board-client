import React, { useContext, useEffect, useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Avatar, Button } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import InputIcon from '@material-ui/icons/Input';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, fade } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { menuWidth, AppContext } from '../../App';
import Link from '../link/Link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import StatusIcon from '@material-ui/icons/FiberManualRecord';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import GetAppIcon from '@material-ui/icons/GetApp';
import { firebaseMessagingIsSupported } from 'src/config/FirebaseConfig';
import ChatIcon from '@material-ui/icons/Chat';
import LocalOfferIcons from '@material-ui/icons/LocalOffer';

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
    justifyContent: 'space-between',
    padding: '0 0 0 16px',
    position: 'relative',
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
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '50%',
    height: 23,
    width: 23,
    fontSize: 12,
    color: '#FFF',
    border: `2px solid ${theme.palette.secondary.contrastText}`,
  }),
  avatar: {
    width: 30,
    height: 30,
  },
  restaurantName: ({ restaurantIsOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: 20,
  }),
  installApp: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
    padding: '10px 15px',
    width: 'calc(100% - 20px)',
    display: 'flex',
    alignItems: 'center',
    margin: 10,
    flexDirection: 'column',
    color: theme.palette.secondary.contrastText,
    backgroundColor: fade(theme.palette.primary.main, 0.5),
    border: `1px dashed ${theme.palette.primary.dark}`,
    '& button': {
      marginTop: 10,
    },
  },
  activeNotifications: ({ readyToInstall }) => ({
    position: 'absolute',
    bottom: readyToInstall ? 100 : 10,
    borderRadius: 4,
    padding: '10px 15px',
    width: 'calc(100% - 20px)',
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px',
    flexDirection: 'column',
    color: theme.palette.secondary.contrastText,
    backgroundColor: fade(theme.palette.primary.main, 0.5),
    border: `1px dashed ${theme.palette.primary.dark}`,
    '& button': {
      marginTop: 10,
    },
  }),
  restaurantStatus: ({ restaurantIsOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 4,
    margin: 10,
    '& svg': {
      color: restaurantIsOpen ? '#28a745' : '#dc3545',
    },
  }),
  headerTitle: {
    whiteSpace: 'wrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 150,
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
  const app = useContext(AppContext);
  const [isSupported, setIsSupported] = useState(false);
  const classes = useStyles({
    cartItems: cart.products.length > 0,
    restaurantIsOpen: restaurant && restaurant.is_open,
    readyToInstall: app.readyToInstall,
  });

  useEffect(() => {
    setIsSupported(firebaseMessagingIsSupported());
  }, []);

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
          <>
            <Typography color="inherit" variant="body2" className={classes.restaurantName}>
              {restaurant.name}
            </Typography>
            <div className={classes.restaurantStatus}>
              <StatusIcon />
            </div>
          </>
        )}
      </div>
      <ListItem component={Link} href="/" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Início" />
      </ListItem>
      <ListItem component={Link} href="/offers" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <LocalOfferIcons />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Ofertas" />
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
      <ListItem component={Link} href="/contact" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Contato" />
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
      {app.readyToInstall && (
        <div className={classes.installApp}>
          <Typography variant="caption">Que tal instalar esse aplicativo?</Typography>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={app.handleInstallApp}
            startIcon={<GetAppIcon />}
          >
            Instalar
          </Button>
        </div>
      )}
      {!app.fmHasToken && isSupported && user.id && (
        <div className={classes.activeNotifications}>
          <Typography variant="caption" align="center">
            Ativar notificações do seus pedidos
          </Typography>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={app.handleRequestPermissionMessaging}
            startIcon={<NotificationsActiveIcon />}
          >
            Ativar
          </Button>
        </div>
      )}
    </Drawer>
  );
}

export default Sidebar;
