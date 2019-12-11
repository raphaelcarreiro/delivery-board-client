import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, InputAdornment, IconButton, Menu, MenuItem, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingBasket';
import InputIcon from '@material-ui/icons/Input';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Link from '../../link/Link';
import LinkNext from 'next/link';
import { useRouter } from 'next/router';
import { AppContext } from '../../../App';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
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
  },
  headerCol1: {},
  headerCol2: {},
  logoContent: {
    display: 'flex',
    flex: '1',
  },
  img: {
    width: 80,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    '& svg': {
      marginRight: 10,
    },
  },
});

export default function Header() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const restaurant = useSelector(state => state.restaurant);
  const user = useSelector(state => state.user);

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleMyAccountClick() {
    handleCloseMenu();
    router.push('/account');
  }

  function handleLogoutClick() {
    handleCloseMenu();
    appContext.handleLogout();
  }

  function handleMyOrdersClick() {
    handleCloseMenu();
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <Grid container alignItems="center">
            <Grid item xs={5} container alignItems="center" className={classes.headerCol1}>
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
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  label="Busca"
                  placeholder="Faça sua busca"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={7}
              container
              alignItems="center"
              justify="flex-end"
              className={classes.headerCol2}
              spacing={3}
            >
              <Grid item>
                <Link color="primary" href="/menu" className={classes.link}>
                  <MenuBookIcon /> Cardápio
                </Link>
              </Grid>
              <Grid item>
                <Link color="primary" href="/cart" className={classes.link}>
                  <ShoppingCartIcon /> Cesta
                </Link>
              </Grid>
              <Grid item>
                {!user.id ? (
                  <Link color="primary" href="/login" className={classes.link}>
                    <InputIcon /> Entrar
                  </Link>
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
                      <MenuItem onClick={handleMyAccountClick}>Minha conta</MenuItem>
                      <MenuItem onClick={handleMyOrdersClick}>Meus pedidos</MenuItem>
                      <MenuItem onClick={handleLogoutClick}>Sair</MenuItem>
                    </Menu>
                    <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
                      {user.image ? <Avatar src={user.image.imageUrl} /> : <Avatar>{user.name[0]}</Avatar>}
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </header>
    </>
  );
}
