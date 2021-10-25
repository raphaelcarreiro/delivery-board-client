import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useSelector } from 'src/store/redux/selector';
import { useGoogleLogin } from 'src/hooks/googleLogin';
import { useFacebookLogin } from 'src/hooks/facebookLogin';
import { useMessaging } from 'src/hooks/messaging';
import { useAuth } from 'src/hooks/auth';
import Loading from '../loading/Loading';
import { useApp } from 'src/hooks/app';
import Link from 'next/link';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: '0 15px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 370,
    flex: 1,
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
    border: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
  buttonContent: {
    marginTop: 20,
    width: '100%',
  },
  btnCreateAccount: {
    marginTop: 30,
    width: '100%',
    borderTop: '1px solid #ddd',
    paddingTop: 20,
    '& button': {
      marginBottom: 30,
    },
  },
  startIcon: {
    marginRight: 10,
  },
  logo: {
    width: 70,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
});

const Login: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant);
  const { redirect, setRedirect } = useApp();
  const { googleLogin, googleLoadProfile, googleUserProfile } = useGoogleLogin();
  const { facebookLogin, facebookUser, facebookLoadProfile } = useFacebookLogin();
  const messaging = useMessaging();
  const { isLoading } = useAuth();
  const [hasGoogleLoadedProfile, setHasGoogleLoadedProfile] = useState(false);
  const [hasFacebookLoadedProfile, setHasFacebookLoadedProfile] = useState(false);

  useEffect(() => {
    if (hasGoogleLoadedProfile)
      googleLogin()
        .then(response => {
          if (response.status === 'logged') {
            if (redirect) {
              router.push(redirect);
              setRedirect(null);
              return;
            }
            router.push('/');
          } else if (response.status === 'redirect' && response.redirectUri) {
            router.push(response.redirectUri);
          }
        })
        .catch(err => {
          messaging.handleOpen(err.message);
        });
  }, [hasGoogleLoadedProfile]); //eslint-disable-line

  useEffect(() => {
    if (hasFacebookLoadedProfile)
      facebookLogin()
        .then(response => {
          if (response.status === 'logged') {
            if (redirect) {
              router.push(redirect);
              setRedirect(null);
              return;
            }
            router.push('/');
          } else if (response.status === 'redirect' && response.redirectUri) {
            router.push(response.redirectUri);
          }
        })
        .catch(err => {
          messaging.handleOpen(err.message);
        });
  }, [hasFacebookLoadedProfile]); //eslint-disable-line

  function handleEmailPasswordClick() {
    router.push('/login/email');
  }

  function handleCreateAccountClick() {
    router.push('/register');
  }

  async function handleGoogleLogin() {
    if (!googleUserProfile) {
      try {
        const status = await googleLoadProfile();
        setHasGoogleLoadedProfile(status);
      } catch (err) {
        messaging.handleOpen(err as string);
      }
      return;
    }

    googleLogin()
      .then(response => {
        if (response.status === 'logged') {
          if (redirect) {
            router.push(redirect);
            setRedirect(null);
            return;
          }
          router.push('/');
        } else if (response.status === 'redirect' && response.redirectUri) {
          router.push(response.redirectUri);
        }
      })
      .catch(err => {
        messaging.handleOpen(err.message);
      });
  }

  async function handleFacebookLogin() {
    if (!facebookUser) {
      try {
        const status = await facebookLoadProfile();
        setHasFacebookLoadedProfile(status);
      } catch (err) {
        messaging.handleOpen(err as string);
      }
      return; // cancela a execução da function
    }

    facebookLogin()
      .then(response => {
        if (response.status === 'logged') {
          if (redirect) {
            router.push(redirect);
            setRedirect(null);
            return;
          }
          router.push('/');
        } else if (response.status === 'redirect' && response.redirectUri) {
          router.push(response.redirectUri);
        }
      })
      .catch(err => {
        messaging.handleOpen(err.message);
      });
  }

  return (
    <div className={classes.container}>
      {isLoading && <Loading background="rgba(250, 250, 250, 0.5)" />}
      <div className={classes.content}>
        {restaurant && restaurant.image && (
          <div className={classes.logoContainer}>
            <Link href="/">
              <a>
                <img src={restaurant.image.imageUrl} className={classes.logo} />
              </a>
            </Link>
          </div>
        )}
        <Typography className={classes.title} variant="h5">
          como deseja continuar?
        </Typography>
        {restaurant && (
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
        {restaurant && restaurant.configs.google_login && (
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
              {googleUserProfile ? `Continuar como ${googleUserProfile.getName()}` : 'Entrar com Google'}
            </Button>
          </div>
        )}
        <div className={classes.buttonContent}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleEmailPasswordClick}>
            Entrar com E-mail ou Telefone
          </Button>
        </div>
        <div className={classes.btnCreateAccount}>
          <Typography gutterBottom align="center" variant="body1">
            você é novo por aqui? crie uma conta
          </Typography>
          <Button size="large" color="primary" variant="text" fullWidth onClick={handleCreateAccountClick}>
            Criar conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
