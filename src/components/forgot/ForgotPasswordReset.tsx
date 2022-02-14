import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMessaging } from 'src/providers/MessageProvider';
import { useSelector } from 'src/store/redux/selector';
import { usePasswordResetValidation } from './validation/passwordResetValidation';
import { useApp } from 'src/providers/AppProvider';
import { useForgot } from './hook/useForgot';

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
    flexDirection: 'column',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
  },
  btnBack: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
  },
}));

const ForgotPasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation, validate] = usePasswordResetValidation();
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const app = useApp();
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles();
  const router = useRouter();
  const { setStep, phone, formattedPin } = useForgot();

  const inputs = {
    password: useRef<HTMLInputElement>(null),
    password_confirmation: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key) return;

    inputs[key].current?.focus();
  }, [validation]); // eslint-disable-line

  function handleValidation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setValidation({});

    validate({
      password,
      password_confirmation: passwordConfirm,
    })
      .then(handleSubmit)
      .catch(err => console.error(err));
  }

  function handleSubmit() {
    setLoading(true);

    const data = {
      password,
      password_confirmation: passwordConfirm,
      pin: formattedPin,
      phone,
    };

    api
      .post('/password-reset', data)
      .then(response => {
        return response.data;
      })
      .then(() => {
        messaging.handleOpen('Senha atualizada', { variant: 'default' });
        router.push('/login');
      })
      .catch(err => {
        if (err.response && err.response.data.error) messaging.handleOpen(err.response.data.error);
        else messaging.handleOpen('Não foi possível atualizar a senha', { variant: 'default' });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form onSubmit={handleValidation}>
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
            nova senha
          </Typography>
          <div>
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
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Confirmar
          </Button>
          <Button onClick={() => setStep('phone')} variant="text" color="primary">
            voltar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordReset;
