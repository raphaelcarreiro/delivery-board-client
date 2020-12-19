import React, { useState, useEffect, FormEvent } from 'react';
import LoginEmailStep from './LoginEmailStep';
import LoginPasswordStep from './LoginPasswordStep';
import NextLink from 'next/link';
import NavigateBoforeIcon from '@material-ui/icons/ArrowBack';
import { Grid, Button, Typography, LinearProgress, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../loading/Loading';
import { useMessaging } from 'src/hooks/messaging';
import { useAuth } from 'src/hooks/auth';
import { useSelector } from 'src/store/redux/selector';
import CustomLink from '../link/CustomLink';
import { User } from 'src/types/user';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid #ddd`,
    height: 475,
    padding: '35px',
    margin: '0 15px',
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    backgroundColor: '#fff',
    [theme.breakpoints.down('md')]: {
      padding: 15,
      backgroundColor: 'transparent',
      border: 'none',
    },
  },
  action: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  actionPassword: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 100,
    alignItems: 'center',
    flexDirection: 'column',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 20,
    height: 160,
    justifyContent: 'space-around',
  },
  loading: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  linearProgress: {
    width: '99%',
    marginTop: '-3px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between',
  },
  btnBack: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logoContainer: {
    textAlign: 'center',
  },
  logo: {
    width: 70,
  },
  forgot: {
    fontSize: 16,
  },
}));

type LoginEmailProps = {
  emailParam?: string;
  phoneParam?: string;
};

const LoginEmail: React.FC<LoginEmailProps> = ({ emailParam, phoneParam }) => {
  const classes = useStyles();
  const [email, setEmail] = useState(phoneParam || emailParam || '');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const router = useRouter();
  const restaurant = useSelector(state => state.restaurant);
  const { redirect, setRedirect, isMobile, windowWidth } = useApp();
  const { checkAuth, checkEmail, login } = useAuth();
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (checkAuth()) router.push('account');
  }, [router, checkAuth]);

  useEffect(() => {
    setError({
      email: '',
      password: '',
    });
  }, [email, password]);

  useEffect(() => {
    if (email) handleSubmit();
  }, []); // eslint-disable-line

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!email) return;

    if (step === 'email') {
      setLoading(true);

      checkEmail(email)
        .then(user => {
          setUser(user);
          setStep('password');
        })
        .catch(err => {
          messaging.handleOpen(err.message);
          setError(error => ({ ...error, email: err.message }));
          // const type = /^\d+$/.test(email) ? 'phone' : email.includes('@') ? 'email' : null;
          // if (type) router.push(`/register?${type}=${email}`);
          // else router.push('/register');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);

      login(email, password)
        .then(() => {
          if (redirect) {
            router.push(redirect);
            setRedirect(null);
          } else router.push('/');
        })
        .catch(err => {
          messaging.handleOpen(err.message);
          setError(error => ({ ...error, password: err.message }));
          setLoading(false);
        });
    }
  }

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} lg={4} xl={3} md={6}>
        <form onSubmit={handleSubmit}>
          <div className={classes.container}>
            {step === 'password' && (
              <IconButton onClick={() => setStep('email')} className={classes.btnBack}>
                <NavigateBoforeIcon />
              </IconButton>
            )}
            {loading && (
              <>
                {isMobile || windowWidth < 960 ? (
                  <Loading background="rgba(250,250,250,0.5)" />
                ) : (
                  <div className={classes.loading}>
                    <LinearProgress className={classes.linearProgress} color="primary" />
                  </div>
                )}
              </>
            )}
            <div className={classes.content}>
              {restaurant && (
                <div className={classes.logoContainer}>
                  <NextLink href="/">
                    <a>
                      <img className={classes.logo} src={restaurant.image.imageUrl} alt="Logo" />
                    </a>
                  </NextLink>
                </div>
              )}
              <Typography align="center" variant="h6">
                Login
              </Typography>
              {step === 'email' ? (
                <LoginEmailStep email={email} setEmail={setEmail} emailError={error.email} />
              ) : (
                <LoginPasswordStep
                  name={user ? user.name : ''}
                  password={password}
                  setPassword={setPassword}
                  emailParam={emailParam}
                  phoneParam={phoneParam}
                  email={email}
                  passwordError={error.password}
                />
              )}
            </div>
            <div className={classes.actions}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {step === 'email' ? 'Próximo' : 'Entrar'}
              </Button>
              {step === 'email' && (
                <CustomLink href="/login" color="primary">
                  Voltar
                </CustomLink>
              )}
              {step === 'password' && (
                <CustomLink
                  color="primary"
                  href={{ pathname: '/password-request', query: { user: email } }}
                  className={classes.forgot}
                >
                  Esqueci minha senha
                </CustomLink>
              )}
            </div>
          </div>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginEmail;
