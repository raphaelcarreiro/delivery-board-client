import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { AppContext } from 'src/App';
import { api } from 'src/services/api';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from 'src/store/redux/modules/user/actions';
import Loading from '../loading/Loading';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 15px',
  },
  btnFacebookLogin: {
    backgroundColor: '#3a559f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#3a559f',
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
  startIcon: {
    marginRight: 10,
  },
});

let googleAuth2;

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant || {});
  const [facebookUser, setFacebookUser] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const app = useContext(AppContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
    if (restaurant.id)
      if (restaurant.configs.google_login) {
        gapi.load('auth2', async () => {
          await gapi.auth2.init({
            client_id: '372525900715-741lc2vnsuj2gs2o2i063eri0ioaeoov.apps.googleusercontent.com',
            scope: 'profile',
          });

          googleAuth2 = gapi.auth2.getAuthInstance();
          if (googleAuth2.isSignedIn.get()) {
            const _googleUser = googleAuth2.currentUser.get().getBasicProfile();
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

  async function handleAppLoginWithFacebook(response) {
    setLoading(true);

    const userData = response || facebookUser;

    try {
      await api().get(`user/show/${userData.email}`);
      api()
        .post('login/facebook', userData)
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
      router.push(`/register?email=${userData.email}&name=${userData.name}`);
    }
  }

  async function handleAppLoginWithGoogle(data) {
    setLoading(true);

    const user = data ? data.getBasicProfile() : googleUser;

    const userData = {
      name: user.getName(),
      email: user.getEmail(),
    };

    try {
      await api().get(`user/show/${userData.email}`);
      api()
        .post('login/google', userData)
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
      router.push(`/register?email=${user.getEmail()}&name=${user.getName()}`);
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
        <Typography variant="h5">Como deseja continuar?</Typography>
        {restaurant.id && (
          <>
            {restaurant.configs.facebook_login && (
              <div className={classes.buttonContent}>
                <Button
                  classes={{
                    startIcon: classes.startIcon,
                  }}
                  className={classes.btnFacebookLogin}
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleFacebookLogin}
                  size="large"
                  startIcon={<FaFacebookF />}
                >
                  {facebookUser ? `Continuar como ${facebookUser.name}` : 'Entrar com Facebook'}
                </Button>
              </div>
            )}
          </>
        )}
        {restaurant.id && (
          <>
            {restaurant.configs.google_login && (
              <div className={classes.buttonContent}>
                <Button
                  classes={{
                    startIcon: classes.startIcon,
                  }}
                  className={classes.btnGoogleLogin}
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleGoogleLogin}
                  size="large"
                  startIcon={<FaGoogle />}
                >
                  {googleUser ? `Continuar como ${googleUser.getName()}` : 'Entrar com Google'}
                </Button>
              </div>
            )}
          </>
        )}
        <div className={classes.buttonContent}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleEmailPasswordClick}>
            Entrar com E-mail ou Telefone
          </Button>
        </div>
        <div className={classes.btnCreateAccount}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleCreateAccountClick}>
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
