import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import { useSelector } from 'src/store/redux/selector';
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
    height: 300,
    justifyContent: 'space-between',
  },
  btnBack: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 70,
  },
  inputPin: {
    border: '2px solid #eee',
    borderRadius: 4,
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    height: 50,
    width: 50,
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '30px 0 10px',
  },
}));

export type PinStep = 'phone' | 'pin' | 'resetForm';

const ForgotPin: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const app = useApp();
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const { pin, setPin, phone, setStep, formattedPin } = useForgot();
  const inputs = {
    firstDigit: useRef<HTMLInputElement>(null),
    secondDigit: useRef<HTMLInputElement>(null),
    thirthDigit: useRef<HTMLInputElement>(null),
    fourthDigit: useRef<HTMLInputElement>(null),
  };
  const [isFocused, setIsFocused] = useState(false);

  const isPinValid = useMemo(() => !!pin.firstDigit && !!pin.secondDigit && !!pin.thirthDigit && !!pin.fourthDigit, [
    pin,
  ]);

  const handleSubmit = useCallback(() => {
    setError('');
    setLoading(true);

    api
      .post('password/pin-validation', { pin: formattedPin, phone })
      .then(() => {
        setStep('reset');
      })
      .catch(err => {
        setError(err.response ? err.response.data.error : 'Não foi possível validar o PIN');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formattedPin, phone, setStep]);

  useEffect(() => {
    if (isPinValid && isFocused) handleSubmit();
  }, [isPinValid, handleSubmit, isFocused]);

  useEffect(() => console.log(isFocused), [isFocused]);

  return (
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
          esqueci minha senha
        </Typography>
        <Typography align="center" color="textSecondary">
          informe o número que enviamos para você por SMS
        </Typography>
        <div className={classes.inputContainer}>
          <input
            value={pin.firstDigit}
            onChange={e => {
              setPin(state => ({ ...state, firstDigit: e.target.value }));
              if (e.target.value.length === 1) inputs.secondDigit.current?.focus();
            }}
            ref={inputs.firstDigit}
            type="text"
            className={classes.inputPin}
            maxLength={1}
            inputMode="numeric"
            autoFocus
          />
          <input
            ref={inputs.secondDigit}
            value={pin.secondDigit}
            onChange={e => {
              setPin(state => ({ ...state, secondDigit: e.target.value }));
              if (e.target.value.length === 1) inputs.thirthDigit.current?.focus();
            }}
            type="text"
            className={classes.inputPin}
            maxLength={1}
            inputMode="numeric"
          />
          <input
            ref={inputs.thirthDigit}
            value={pin.thirthDigit}
            onChange={e => {
              setPin(state => ({ ...state, thirthDigit: e.target.value }));
              if (e.target.value.length === 1) inputs.fourthDigit.current?.focus();
            }}
            type="text"
            className={classes.inputPin}
            inputMode="numeric"
            maxLength={1}
          />
          <input
            value={pin.fourthDigit}
            onChange={e => setPin(state => ({ ...state, fourthDigit: e.target.value }))}
            ref={inputs.fourthDigit}
            type="text"
            className={classes.inputPin}
            inputMode="numeric"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <Typography align="center" variant="body2" color="error">
          {error}
        </Typography>
      </div>
      <div className={classes.action}>
        <Button disabled={!isPinValid || loading} onClick={handleSubmit} variant="contained" color="primary">
          Prosseguir
        </Button>
        <Button color="primary" variant="text" onClick={() => setStep('phone')}>
          voltar
        </Button>
      </div>
    </div>
  );
};

export default ForgotPin;
