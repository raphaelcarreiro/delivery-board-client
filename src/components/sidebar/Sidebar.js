import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import InputIcon from '@material-ui/icons/Input';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { menuWidth } from '../../App';
import Link from '../link/Link';
import { useRouter } from 'next/router';

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
}));

function Sidebar({ handleOpenMenu, isOpenMenu, handleLogout }) {
  const classes = useStyles();
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant);
  const router = useRouter();

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
      <ListItem component={Link} href="/menu" onClick={handleClick} button>
        <ListItemIcon className={classes.listItemIcon}>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.listItemText }} primary="Cardápio" />
      </ListItem>
      {user.id ? (
        <ListItem button onClick={handleAccountClick}>
          <ListItemIcon className={classes.listItemIcon}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.listItemText }} primary={user.name} />
        </ListItem>
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
