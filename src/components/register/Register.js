import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Grid, Button, LinearProgress, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../link/Link';
import { api } from '../../services/api';
import RegisterForm from './RegisterForm';
import * as yup from 'yup';
import userReducer, { INITIAL_STATE as userInitiaState } from '../../store/context-api/modules/user/reducer';
import { userChange } from '../../store/context-api/modules/user/actions';
import RegisterSucess from './RegisterSuccess';
import { useRouter } from 'next/router';
import { AppContext } from 'src/App';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/redux/modules/user/actions';
import PropTypes from 'prop-types';
import { useMessaging } from 'src/hooks/messaging';

Register.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

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

export function Register({ name, email }) {
  const messaging = useMessaging();
  const [user, dispatch] = useReducer(userReducer, userInitiaState);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({});
  const router = useRouter();
  const app = useContext(AppContext);
  const reduxDispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (name) dispatch(userChange('name', name));
    if (email) dispatch(userChange('email', email));
  }, [email, name]);

  function handleChange(index, value) {
    dispatch(userChange(index, value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setValidation({});

    const schema = yup.object().shape({
      passwordConfirm: yup
        .string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
        .required('A confirmação da senha é obrigatória'),
      password: yup
        .string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .required('Senha é obrigatória'),
      email: yup
        .string()
        .transform(value => {
          return value.replace(' ', '');
        })
        .email('Você deve informar um email válido')
        .required('O e-mail é obrigatório'),
      phone: yup
        .string()
        .transform(value => {
          return value ? value.replace(/\D/g, '') : '';
        })
        .min(10, 'Telefone inválido')
        .required('O telefone é obrigatório'),
      name: yup.string().required('O nome é obrigatório'),
    });

    schema
      .validate(user)
      .then(() => {
        setLoading(true);

        api
          .post('/users', user)
          .then(response => {
            setLoading(false);
            localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_NAME, response.data.token);
            reduxDispatch(setUser(response.data.user));
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
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  return (
    <Grid container alignItems="center" justify="center">
      <Grid item xl={3} lg={4} md={6} xs={12}>
        <form onSubmit={handleSubmit}>
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
}
