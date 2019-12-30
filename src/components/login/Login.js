import React, { useEffect } from 'react';
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
    marginTop: 20,
  },
  btnEmail: {
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
  useEffect(() => {
    //
  }, []);

  function handleCheckLoginState() {
    FB.getLoginStatus(function(response) {
      console.log(response);
    });
  }

  function handleEmailPasswordClick() {
    router.push('/login/email');
  }

  function handleCreateAccountClick() {
    router.push('/register');
  }

  return (
    <div className={classes.container}>
      <Grid item xl={2} xs={12} md={4} lg={3} sm={5} container alignItems="center" direction="column">
        <Typography>Como deseja continuar?</Typography>
        <div className={classes.btnFacebookLogin}>
          <div
            className="fb-login-button"
            data-width="100%"
            data-size="large"
            data-button-type="login_with"
            data-auto-logout-link="false"
            data-use-continue-as="false"
            data-onlogin="handleCheckLoginState();"
          />
        </div>
        <div className={classes.btnEmail}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleEmailPasswordClick}>
            Entrar com E-mail ou Telefone
          </Button>
        </div>
        <div className={classes.btnCreateAccount}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleCreateAccountClick}>
            Criar conta
          </Button>
        </div>
      </Grid>
    </div>
  );
}
