import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { AppContext } from 'src/App';
import { api } from 'src/services/api';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from 'src/store/redux/modules/user/actions';
import Loading from '../loading/Loading';

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
  btnGoogleLogin: {
    backgroundColor: '#fff',
    color: '#333',
    '&:hover': {
      backgroundColor: '#fff',
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
    '& button': {
      marginBottom: 20,
    },
  },
});

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant || {});
  const [facebookUser, setFacebookUser] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const app = useContext(AppContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let googleAuth2;

  useEffect(() => {
    if (restaurant.id)
      if (restaurant.configs.facebook_login) {
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
      }
  }, [restaurant]);

  useEffect(() => {
    if (restaurant)
      if (restaurant.configs.google_login) {
        gapi.load('auth2', async () => {
          await gapi.auth2.init({
            client_id: '372525900715-741lc2vnsuj2gs2o2i063eri0ioaeoov.apps.googleusercontent.com',
            scope: 'profile',
          });

          googleAuth2 = gapi.auth2.getAuthInstance();
          if (googleAuth2.isSignedIn.get()) {
            const _googleUser = googleAuth2.currentUser.get();
            setGoogleUser(_googleUser);
          }
        });
      }
  }, [restaurant]);

  function handleFacebookLogin() {
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login(
          function(response) {
            if (response.status === 'connected') {
              FB.api('/me?locale=pt_BR&fields=name,email', response => {
                setFacebookUser(response);
                handleAppLoginWithFacebook(response);
              });
            }
          },
          { scope: 'public_profile,email' }
        );
      } else {
        handleAppLoginWithFacebook();
      }
    });
  }

  function handleAppLoginWithFacebook(response) {
    setLoading(true);
    api()
      .post('login/facebook', response || facebookUser)
      .then(response => {
        localStorage.setItem(process.env.TOKEN_NAME, response.data.token);
        dispatch(setUser(response.data.user));
        setLoading(false);
        if (app.redirect) {
          router.push(app.redirect);
          app.setRedirect(null);
        } else router.push('/');
      })
      .catch(() => {
        setLoading(false);
      });
  }

  async function handleAppLoginWithGoogle(data) {
    setLoading(true);

    const user = data || googleUser;

    try {
      await api().get(`user/show/${user.w3.U3}`);
      api()
        .post('login/google', user)
        .then(response => {
          localStorage.setItem(process.env.TOKEN_NAME, response.data.token);
          dispatch(setUser(response.data.user));
          setLoading(false);
          if (app.redirect) {
            router.push(app.redirect);
            app.setRedirect(null);
          } else router.push('/');
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (err) {
      router.push(`/register?email=${user.w3.U3}&name=${user.w3.ig}`);
    }
  }

  function handleGoogleLogin() {
    if (!googleUser)
      googleAuth2.signIn({ scope: 'profile email' }).then(googleUser => {
        handleAppLoginWithGoogle(googleUser);
      });
    else handleAppLoginWithGoogle();
  }

  function handleEmailPasswordClick() {
    router.push('/login/email');
  }

  function handleCreateAccountClick() {
    router.push('/register');
  }

  function handleBack() {
    router.push('/menu');
  }

  return (
    <div className={classes.container}>
      {loading && <Loading background="rgba(250,250,250,0.5)" />}
      <Grid item xl={2} xs={12} md={4} lg={3} sm={5} container alignItems="center" direction="column">
        <Typography variant="h6">Como deseja continuar?</Typography>
        {restaurant.configs.facebook_login && (
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
        )}
        {restaurant.configs.google_login && (
          <div className={classes.buttonContent}>
            <Button
              className={classes.btnGoogleLogin}
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleGoogleLogin}
            >
              {googleUser ? `Continuar como ${googleUser.w3.ig}` : 'Entrar com Google'}
            </Button>
          </div>
        )}
        <div className={classes.buttonContent}>
          <Button color="primary" variant="contained" fullWidth onClick={handleEmailPasswordClick}>
            Entrar com E-mail ou Telefone
          </Button>
        </div>
        <div className={classes.btnCreateAccount}>
          <Button color="primary" variant="contained" fullWidth onClick={handleCreateAccountClick}>
            Criar conta
          </Button>
          <Button color="primary" variant="text" size="large" fullWidth onClick={handleBack}>
            Voltar
          </Button>
        </div>
      </Grid>
    </div>
  );
}
