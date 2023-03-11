import React, { useState, FormEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMessaging } from 'src/providers/MessageProvider';
import { useSelector } from 'src/store/redux/selector';
import { usePasswordResetValidation } from './validation/passwordResetValidation';
import { useApp } from 'src/providers/AppProvider';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.down('md')]: {
      backgroundColor: 'transparent',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    height: 550,
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
    marginBottom: 30,
  },
  logo: {
    width: 70,
  },
}));

type PasswordResetProps = {
  token: string;
};

const PasswordReset: React.FC<PasswordResetProps> = ({ token }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation, validate] = usePasswordResetValidation();
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const app = useApp();
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();
  const router = useRouter();

  function handleValidation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setValidation({});

    validate({
      email,
      password,
      password_confirmation: passwordConfirm,
    })
      .then(handleSubmit)
      .catch(err => console.error(err));
  }

  function handleSubmit() {
    setLoading(true);

    const data = {
      email,
      password,
      password_confirmation: passwordConfirm,
      token,
    };

    api
      .post('/password/reset/' + token, data)
      .then(response => {
        return response.data;
      })
      .then(() => {
        messaging.handleOpen('Senha atualizada');
        router.push('/login');
      })
      .catch(err => {
        if (err.response && err.response.data.error) messaging.handleOpen(err.response.data.error);
        else messaging.handleOpen('Não foi possível atualizar a senha');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={classes.container}>
      <Grid item xs={12} lg={4} xl={3} md={6}>
        <form onSubmit={handleValidation}>
          <div className={classes.paper}>
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
              {restaurant && (
                <div className={classes.logoContainer}>
                  <NextLink href="/">
                    <img className={classes.logo} src={restaurant.image.imageUrl} alt="Logo" />
                  </NextLink>
                </div>
              )}
              <Typography align="center" variant="h5">
                Nova senha
              </Typography>
              <div>
                <TextField
                  error={!!validation.email}
                  helperText={validation.email}
                  variant="standard"
                  label="E-mail"
                  placeholder="Seu email"
                  autoFocus
                  fullWidth
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  margin="normal"
                  autoComplete="username"
                />
                <TextField
                  error={!!validation.password}
                  helperText={validation.password}
                  variant="standard"
                  label="Nova senha"
                  placeholder="Sua nova senha"
                  autoFocus
                  fullWidth
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  margin="normal"
                  type="password"
                  autoComplete="new-password"
                />
                <TextField
                  error={!!validation.password_confirmation}
                  helperText={validation.password_confirmation}
                  variant="standard"
                  label="Repita nova senha"
                  placeholder="Repita sua nova senha"
                  autoFocus
                  fullWidth
                  value={passwordConfirm}
                  onChange={event => setPasswordConfirm(event.target.value)}
                  margin="normal"
                  type="password"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className={classes.action}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                Confirmar
              </Button>
            </div>
          </div>
        </form>
      </Grid>
    </div>
  );
};

export default PasswordReset;
