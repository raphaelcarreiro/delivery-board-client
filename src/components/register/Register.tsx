import React, { useState, useEffect, FormEvent } from 'react';
import { Grid, Button, LinearProgress, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../link/Link';
import { api } from '../../services/api';
import RegisterForm from './RegisterForm';
import { userChange } from '../../store/context-api/modules/user/actions';
import RegisterSucess from './RegisterSuccess';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/redux/modules/user/actions';
import { useMessaging } from 'src/hooks/messaging';
import { useApp } from 'src/hooks/app';
import { useUserRegisterReducer } from 'src/store/context-api/modules/user/reducer';
import { useUserRegisterValidation } from './validation/registerValidation';
import { UserRegister } from 'src/types/userRegister';
import { useAuth } from 'src/hooks/auth';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '35px',
    borderRadius: theme.shape.borderRadius,
    minHeight: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '0 15px',
    border: '2px solid #ddd',
    position: 'relative',
    backgroundColor: '#fff',
    [theme.breakpoints.down('md')]: {
      padding: 15,
      backgroundColor: 'transparent',
      border: 'none',
    },
  },
  actions: {
    display: 'flex',
    marginTop: 20,
    justifyContent: 'space-evenly',
  },
  loading: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
    },
  },
  linearProgress: {
    width: '99%',
    marginTop: '-3px',
    borderRadius: theme.shape.borderRadius,
  },
}));

type RegisterProps = {
  name: string;
  email: string;
  phone: string;
};

const Register: React.FC<RegisterProps> = ({ name, email, phone }) => {
  const messaging = useMessaging();
  const [user, dispatch] = useUserRegisterReducer();
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation, validate] = useUserRegisterValidation();
  const router = useRouter();
  const app = useApp();
  const reduxDispatch = useDispatch();
  const classes = useStyles();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (name) dispatch(userChange('name', name));
    if (email) dispatch(userChange('email', email));
    if (phone) dispatch(userChange('phone', phone));
  }, [email, name, phone, dispatch]);

  function handleChange(index: keyof UserRegister, value: string) {
    dispatch(userChange(index, value));
  }

  function handleValidation(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setValidation({});

    validate(user)
      .then(() => {
        handleSubmit();
      })
      .catch(err => console.error(err));
  }

  function handleSubmit() {
    setLoading(true);
    api
      .post('/users', user)
      .then(response => {
        setLoading(false);
        if (process.env.NEXT_PUBLIC_TOKEN_NAME)
          localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_NAME, response.data.token);
        reduxDispatch(setUser(response.data.user));
        setIsAuthenticated(true);
        if (app.redirect) {
          router.push(app.redirect);
          app.setRedirect(null);
        } else setCreated(true);
      })
      .catch(err => {
        if (err.response) {
          messaging.handleOpen(err.response.data.error);
          if (err.response.data.code === 'duplicated-phone')
            router.push(`/login/email?phone=${user.phone.replace(/\D/g, '')}`);
          if (err.response.data.code === 'duplicated-email') router.push(`/login/email?email=${user.email}`);
        }
        setLoading(false);
      });
  }

  return (
    <Grid container alignItems="center" justify="center">
      <Grid item xl={3} lg={4} md={6} xs={12}>
        <form onSubmit={handleValidation}>
          <div className={classes.paper}>
            {loading && (
              <div className={classes.loading}>
                {!app.isMobile || app.windowWidth >= 960 ? (
                  <LinearProgress className={classes.linearProgress} color="primary" />
                ) : (
                  <CircularProgress color="primary" />
                )}
              </div>
            )}
            {!created ? (
              <RegisterForm user={user} handleChange={handleChange} validation={validation} />
            ) : (
              <RegisterSucess />
            )}
            {!created && (
              <div className={classes.actions}>
                <Button href="/login" component={Link} variant="text" color="primary">
                  Voltar
                </Button>
                <Button type="submit" disabled={loading} variant="contained" color="primary">
                  Pronto!
                </Button>
              </div>
            )}
          </div>
        </form>
      </Grid>
    </Grid>
  );
};

export default Register;
