import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography, InputAdornment, IconButton, Button } from '@material-ui/core';
import { AppContext } from '../../../pages/_app';
import CustomAppbar from '../appbar/CustomAppbar';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingBasket';
import InputIcon from '@material-ui/icons/Input';
import Link from '../link/Link';
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
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    boxShadow: '1px 1px 7px 1px #d4d4d4',
    padding: '0 15px',
  },
  headerCol1: {},
  headerCol2: {},
  logoContent: {
    textAlign: 'center',
  },
});

export default function Header() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const router = useRouter();

  function handleLoginClick() {
    router.push('/login');
  }

  return (
    <>
      {appContext.isMobile || appContext.windowWidth <= 1280 ? (
        <CustomAppbar title="Caramba" appContext={appContext} />
      ) : (
        <header className={classes.header}>
          <div className={classes.container}>
            <Grid container alignItems="center">
              <Grid item xs={6} spacing={2} container alignItems="center" className={classes.headerCol1}>
                <Grid item xs={4} className={classes.logoContent}>
                  <Typography>LOGO</Typography>
                </Grid>
                <Grid item xs={8}>
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
              <Grid item xs={6} container justify="flex-end" className={classes.headerCol2} spacing={3}>
                <Grid item>
                  <Button startIcon={<InputIcon />} variant="text" color="primary" onClick={handleLoginClick}>
                    Entrar
                  </Button>
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
