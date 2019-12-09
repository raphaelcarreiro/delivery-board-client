import React, { useState, useContext, useReducer } from 'react';
import { Grid, Button, LinearProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../link/Link';
import { api } from '../../services/api';
import { MessagingContext } from '../messaging/Messaging';
import RegisterForm from './RegisterForm';
import * as yup from 'yup';
import userReducer, { INITIAL_STATE as userInitiaState } from '../../store/modules/user/reducer';
import { userChange } from '../../store/modules/user/actions';
import RegisterSucess from './RegisterSuccess';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px 15px',
    borderRadius: 4,
    height: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '0 15px',
    border: '2px solid #ddd',
    position: 'relative',
    backgroundColor: '#fff',
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
  },
  linearProgress: {
    width: '99%',
    marginTop: '-3px',
    borderRadius: 4,
  },
}));

export function Register() {
  const messaging = useContext(MessagingContext);
  const [user, dispatch] = useReducer(userReducer, userInitiaState);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({});

  const classes = useStyles();

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
        .email('Você deve informar um email válido')
        .required('O e-mail é obrigatório'),
      phone: yup.string().required('O telefone é obrigatório'),
      name: yup.string().required('O nome é obrigatório'),
    });

    schema
      .validate(user)
      .then(() => {
        setLoading(true);

        api()
          .post('/users', user)
          .then(response => {
            setCreated(true);
          })
          .catch(err => {
            if (err.response) messaging.handleOpen(err.response.data.error);
          })
          .finally(() => {
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
                <LinearProgress className={classes.linearProgress} color="primary" />
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
                <Button type="submit" variant="contained" color="primary">
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
