import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 15px',
  },
  btnFacebookLogin: {
    backgroundColor: '#4065b4',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4065b4',
    },
  },
  buttonContent: {
    marginTop: 20,
    width: '100%',
  },
  btnCreateAccount: {
    marginTop: 20,
    width: '100%',
    borderTop: '1px solid #ddd',
    paddingTop: 20,
  },
});

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [facebookUser, setFacebookUser] = useState(null);

  useEffect(() => {
    window.fbAsyncInit = () => {
      FB.init({
        appId: '588242751734818',
        cookie: true,
        xfbml: true,
        version: 'v5.0',
      });

      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          FB.api('/me?locale=pt_BR&fields=name,email', response => {
            setFacebookUser(response);
          });
        }
      });
    };
  }, []);

  function handleEmailPasswordClick() {
    router.push('/login/email');
  }

  function handleCreateAccountClick() {
    router.push('/register');
  }

  function handleFacebookLogin() {
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login(
          function(response) {
            console.log(response);
          },
          { scope: 'public_profile,email' }
        );
      }
    });
  }

  function handleLogin() {}

  return (
    <div className={classes.container}>
      <Grid item xl={2} xs={12} md={4} lg={3} sm={5} container alignItems="center" direction="column">
        <Typography>Como deseja continuar?</Typography>
        <div className={classes.buttonContent}>
          <Button
            className={classes.btnFacebookLogin}
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleFacebookLogin}
          >
            {facebookUser ? `Continuar como ${facebookUser.name}` : 'Entrar com Facebook'}
          </Button>
        </div>
        <div className={classes.buttonContent}>
          <Button color="primary" variant="contained" fullWidth onClick={handleEmailPasswordClick}>
            Entrar com E-mail ou Telefone
          </Button>
        </div>
        <div className={classes.btnCreateAccount}>
          <Button color="primary" variant="contained" fullWidth onClick={handleCreateAccountClick}>
            Criar conta
          </Button>
        </div>
      </Grid>
    </div>
  );
}
