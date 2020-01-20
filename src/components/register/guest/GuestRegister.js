import React, { useState, useContext, useReducer } from 'react';
import { Grid, LinearProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GuestRegisterForm from './GuestRegisterForm';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { AppContext } from 'src/App';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/redux/modules/user/actions';
import PropTypes from 'prop-types';
import { api } from 'src/services/api';
import userReducer, { INITIAL_STATE as userInitiaState } from 'src/store/context-api/modules/user/reducer';
import { MessagingContext } from 'src/components/messaging/Messaging';
import Link from 'src/components/link/Link';
import { userChange } from 'src/store/context-api/modules/user/actions';

GuestRegister.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '35px',
    borderRadius: 4,
    height: 600,
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
  },
  linearProgress: {
    width: '99%',
    marginTop: '-3px',
    borderRadius: 4,
  },
}));

export default function GuestRegister() {
  const messaging = useContext(MessagingContext);
  const [user, dispatch] = useReducer(userReducer, userInitiaState);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({});
  const router = useRouter();
  const app = useContext(AppContext);
  const reduxDispatch = useDispatch();
  const classes = useStyles();

  function handleChange(index, value) {
    dispatch(userChange(index, value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setValidation({});

    const schema = yup.object().shape({
      email: yup.string().email('Você deve informar um email válido'),
      phone: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(10, 'Telefone inválido')
        .required('O telefone é obrigatório'),
      name: yup.string().required('O nome é obrigatório'),
    });

    schema
      .validate(user)
      .then(() => {
        setLoading(true);

        api()
          .post('/guestUsers', user)
          .then(response => {
            setLoading(false);
            const _user = {
              ...response.data,
              customer: {
                ...response.data,
                addresses: [],
              },
            };
            reduxDispatch(setUser(_user));
            if (app.redirect) {
              router.push(app.redirect);
              app.setRedirect(null);
            }
          })
          .catch(err => {
            if (err.response) messaging.handleOpen(err.response.data.error);
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
            <GuestRegisterForm user={user} handleChange={handleChange} validation={validation} />
            <div className={classes.actions}>
              <Button href="/menu" component={Link} variant="text" color="primary">
                Voltar
              </Button>
              <Button type="submit" disabled={loading} variant="contained" color="primary">
                Pronto!
              </Button>
            </div>
          </div>
        </form>
      </Grid>
    </Grid>
  );
}
