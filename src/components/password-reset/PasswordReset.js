import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { MessagingContext } from '../messaging/Messaging';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { AppContext } from 'src/App';
import { useSelector } from 'react-redux';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid #ddd`,
    height: 550,
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
    borderRadius: 4,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 320,
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
}));

PasswordReset.propTypes = {
  token: PropTypes.string.isRequired,
};

export default function PasswordReset({ token }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation] = useState({ email: [], password: [] });
  const [loading, setLoading] = useState(false);
  const messaging = useContext(MessagingContext);
  const app = useContext(AppContext);
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    const data = {
      email,
      password,
      password_confirmation: passwordConfirm,
      token,
    };

    api()
      .post('/password/reset/' + token, data)
      .then(response => {
        return response.data;
      })
      .then(() => {
        messaging.handleOpen('Senha atualizada');
        router.push('/login');
      })
      .catch(err => {
        let _validation = { ...validation };
        if (err.response)
          if (err.response.data.errors) {
            _validation = { ...validation, ...err.response.data.errors };
            setValidation(_validation);
          } else if (err.response.data.error) {
            messaging.handleOpen(err.response.data.error);
          } else messaging.handleOpen('Não foi possível atualizar a senha');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={4} xl={3} md={6}>
          <form onSubmit={handleSubmit}>
            <div className={classes.container}>
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
                  Nova senha
                </Typography>
                <div>
                  <TextField
                    error={validation.email.length > 0}
                    helperText={validation.email.length > 0 && validation.email[0]}
                    variant="standard"
                    label="E-mail"
                    placeholder="Seu email"
                    autoFocus
                    fullWidth
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                    margin="normal"
                  />
                  <TextField
                    error={validation.password.length > 0}
                    helperText={validation.password.length > 0 && validation.password[0]}
                    variant="standard"
                    label="Nova senha"
                    placeholder="Sua nova senha"
                    autoFocus
                    fullWidth
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                    margin="normal"
                    type="password"
                  />
                  <TextField
                    variant="standard"
                    label="Repita nova senha"
                    placeholder="Repita sua nova senha"
                    autoFocus
                    fullWidth
                    value={passwordConfirm}
                    onChange={event => setPasswordConfirm(event.target.value)}
                    required
                    margin="normal"
                    type="password"
                  />
                </div>
              </div>
              <div className={classes.action}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  Confirmar
                </Button>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
