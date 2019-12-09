import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, InputAdornment, IconButton, Button, Menu, MenuItem } from '@material-ui/core';
import { AppContext } from '../../../pages/_app';
import CustomAppbar from '../appbar/CustomAppbar';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingBasket';
import PersonIcon from '@material-ui/icons/Person';
import InputIcon from '@material-ui/icons/Input';
import Link from '../link/Link';
import LinkNext from 'next/link';
import { useRouter } from 'next/router';

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
});

export default function Header() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleLoginClick() {
    handleCloseMenu();
    router.push('/login');
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
      {appContext.isMobile || appContext.windowWidth <= 1280 ? (
        <CustomAppbar title="Caramba" appContext={appContext} />
      ) : (
        <header className={classes.header}>
          <div className={classes.container}>
            <Grid container alignItems="center">
              <Grid item xs={5} container alignItems="center" className={classes.headerCol1}>
                <div className={classes.logoContent}>
                  <LinkNext href="/">
                    <a style={{ display: 'flex' }}>
                      <img
                        className={classes.img}
                        src="http://api.topnfe.com.br/storage/uploaded/images/161113201912085ded3cc187f51.png"
                        alt="test"
                      />
                    </a>
                  </LinkNext>
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
                  {!appContext.user ? (
                    <Button startIcon={<InputIcon />} variant="text" color="primary" onClick={handleLoginClick}>
                      Entrar
                    </Button>
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
                      <Button
                        startIcon={<PersonIcon />}
                        variant="text"
                        color="primary"
                        onClick={event => setAnchorEl(event.currentTarget)}
                      >
                        {appContext.user.name}
                      </Button>
                    </>
                  )}
                </Grid>
                <Grid item>
                  <Button component={Link} href="/cart" startIcon={<ShoppingCartIcon />} variant="text" color="primary">
                    Cestinha
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </header>
      )}
    </>
  );
}
