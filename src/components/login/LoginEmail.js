import React, { useState, useContext, useEffect } from 'react';
import LoginEmailStep from './LoginEmailStep';
import LoginPasswordStep from './LoginPasswordStep';
import Link from '../link/Link';
import NextLink from 'next/link';
import NavigateBoforeIcon from '@material-ui/icons/ArrowBack';
import { Grid, Button, Typography, LinearProgress, IconButton } from '@material-ui/core';
import { api } from '../../services/api';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../services/auth';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/redux/modules/user/actions';
import { AppContext } from 'src/App';
import Loading from '../loading/Loading';
import PropTypes from 'prop-types';
import { useMessaging } from 'src/hooks/messaging';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid #ddd`,
    height: 475,
    padding: '35px',
    margin: '0 15px',
    justifyContent: 'space-between',
    borderRadius: 4,
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
    borderRadius: 4,
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

LoginEmail.propTypes = {
  emailParam: PropTypes.string,
  phoneParam: PropTypes.string,
};

function LoginEmail({ emailParam, phoneParam }) {
  const classes = useStyles();
  const [email, setEmail] = useState(phoneParam || emailParam);
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const messaging = useMessaging();
  const router = useRouter();
  const dispatch = useDispatch();
  const restaurant = useSelector(state => state.restaurant);
  const app = useContext(AppContext);

  useEffect(() => {
    if (isAuthenticated()) router.push('/account');
  }, [router]);

  useEffect(() => {
    if (email) handleSubmit();
  }, [email, handleSubmit]);

  function handleSubmit(event) {
    if (event) event.preventDefault();

    if (step === 'email') {
      setLoading(true);

      api()
        .get(`/user/show/${email}`)
        .then(response => {
          setName(response.data.name);
          setStep('password');
          // messaging.handleClose();
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) {
              messaging.handleOpen(`E-mail não encontrado`);
            }
          } else messaging.handleOpen(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);

      api()
        .post('/login', { email, password })
        .then(response => {
          localStorage.setItem(process.env.TOKEN_NAME, response.data.token);
          dispatch(setUser(response.data.user));
          if (app.redirect) {
            router.push(app.redirect);
            app.setRedirect(null);
          } else router.push('/');
        })
        .catch(err => {
          if (err.response)
            if (err.response.status === 401) messaging.handleOpen('Usuário ou senha incorretos');
            else messaging.handleOpen(err.message);
          setLoading(false);
        });
    }
  }

  return (
    <>
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
                  {app.isMobile || app.windowWidth < 960 ? (
                    <Loading background="rgba(250,250,250,0.5)" />
                  ) : (
                    <div className={classes.loading}>
                      <LinearProgress className={classes.linearProgress} color="primary" />
                    </div>
                  )}
                </>
              )}
              <div className={classes.content}>
                <div className={classes.logoContainer}>
                  <NextLink href="/">
                    <a>
                      <img className={classes.logo} src={restaurant && restaurant.image.imageUrl} alt="Logo" />
                    </a>
                  </NextLink>
                </div>
                <Typography align="center" variant="h6">
                  Login
                </Typography>
                {step === 'email' ? (
                  <LoginEmailStep email={email} setEmail={setEmail} />
                ) : (
                  <LoginPasswordStep
                    name={name}
                    password={password}
                    setPassword={setPassword}
                    emailParam={emailParam}
                    phoneParam={phoneParam}
                  />
                )}
              </div>
              <div className={step === 'email' ? classes.action : classes.actionPassword}>
                {step === 'email' && (
                  <Button component={Link} href="/login" color="primary" variant="text">
                    Voltar
                  </Button>
                )}
                {step === 'password' && (
                  <Link color="primary" href="/password-request" className={classes.forgot}>
                    Esqueci minha senha
                  </Link>
                )}
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {step === 'email' ? 'Próximo' : 'Entrar'}
                </Button>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default LoginEmail;
