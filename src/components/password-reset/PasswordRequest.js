import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import { AppContext } from 'src/App';
import { useSelector } from 'react-redux';
import Link from '../link/Link';
import NextLink from 'next/link';
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
}));

function PasswordRequest() {
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState({ email: [] });
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const app = useContext(AppContext);
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();

  const handleSubmit = event => {
    event.preventDefault();
    setValidation({ email: [] });

    setLoading(true);

    api()
      .post('password/email', { email })
      .then(response => {
        return response.data;
      })
      .then(() => {
        messaging.handleOpen('Um link foi enviado para o e-mail informado');
      })
      .catch(err => {
        if (err.response) {
          if (err.response.data.errors) {
            const _validation = { ...validation, ...err.response.data.errors };
            setValidation(_validation);
          } else if (err.response.data.error) messaging.handleOpen(err.response.data.error);
        } else messaging.handleOpen('Aconteceu um erro');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                  Esqueci minha senha
                </Typography>
                <Typography variant="body2" align="center">
                  Você receberá informações de como criar uma nova senha no e-mail informado.
                </Typography>
                <div>
                  <TextField
                    variant="outlined"
                    label="E-mail"
                    placeholder="Informe seu email"
                    autoFocus
                    fullWidth
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                    margin="normal"
                  />
                </div>
              </div>
              <div className={classes.action}>
                <Button variant="text" color="primary" component={Link} href="/login/email">
                  Voltar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  Enviar
                </Button>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default PasswordRequest;
