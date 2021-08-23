import React, { FormEvent, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/hooks/app';
import * as yup from 'yup';
import { useForgot } from './hook/useForgot';

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
    flexDirection: 'column',
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
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

export type PinStep = 'phone' | 'pin' | 'resetForm';

const ForgotPin: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const app = useApp();
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const input = useRef<HTMLInputElement>(null);
  const { pin, setPin, phone, setStep } = useForgot();

  function handleValidation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const schema = yup.string().min(4, 'Código inválido');

    schema
      .validate(pin)
      .then(handleSubmit)
      .catch(err => {
        setError(err.message);
        input.current?.focus();
      });
  }

  const handleSubmit = () => {
    setLoading(true);

    api
      .post('password/pin-validation', { pin, phone })
      .then(() => {
        setStep('reset');
      })
      .catch(err => {
        setError(err.response ? err.response.data.error : 'Não foi possível validar o PIN');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          <Typography align="center" variant="h6" gutterBottom>
            Esqueci minha senha
          </Typography>
          <Typography align="center" color="textSecondary">
            Informe o número que enviamos para você
          </Typography>
          <div>
            <TextField
              inputRef={input}
              error={!!error}
              helperText={error}
              variant="outlined"
              label="Código de 4 digitos"
              placeholder="Informe o código que enviamos"
              autoFocus
              fullWidth
              value={pin}
              onChange={event => setPin(event.target.value)}
              margin="normal"
              inputMode="tel"
              inputProps={{
                maxLength: 4,
                inputMode: 'numeric',
              }}
            />
          </div>
        </div>
        <div className={classes.action}>
          <Button disabled={pin.length < 4 || loading} type="submit" variant="contained" color="primary">
            Prosseguir
          </Button>
          <Button variant="text" onClick={() => setStep('phone')}>
            voltar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPin;
