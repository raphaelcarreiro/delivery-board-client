import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import CustomLink from '../link/CustomLink';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/hooks/app';
import * as yup from 'yup';
import PhoneInput from '../masked-input/PhoneInput';
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
}));

const ForgotPhone: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const app = useApp();
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);
  const input = useRef<HTMLInputElement>(null);
  const { phone, setPhone, setStep, setPin } = useForgot();

  function handleValidation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const schema = yup.string().test('stringLength', 'Informe um número de telefone válido', value => {
      if (!value) return false;

      const rawValue = value.replace(/\D/, '');

      if (rawValue.length < 12) return false;

      return true;
    });

    schema
      .validate(phone)
      .then(handleSubmit)
      .catch(err => {
        setError(err.message);
        input.current?.focus();
      });
  }

  const handleSubmit = () => {
    setLoading(true);

    api
      .post('password/sms', { phone })
      .then(() => {
        setPin({
          firstDigit: '',
          secondDigit: '',
          thirthDigit: '',
          fourthDigit: '',
        });
        setStep('pin');
      })
      .catch(err => console.error(err))
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
            Informe seu número de telefone
          </Typography>
          <div>
            <TextField
              inputRef={input}
              error={!!error}
              helperText={error}
              variant="outlined"
              label="Telefone"
              placeholder="Seu número de telefone"
              autoFocus
              fullWidth
              value={phone}
              onChange={event => setPhone(event.target.value)}
              margin="normal"
              inputMode="tel"
              InputProps={{
                inputComponent: PhoneInput as any,
              }}
            />
            <CustomLink color="primary" href="/password-request">
              tentar recuperar usando e-mail
            </CustomLink>
          </div>
        </div>
        <div className={classes.action}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Prosseguir
          </Button>
          <CustomLink color="primary" href="/login/email">
            voltar ao login
          </CustomLink>
        </div>
      </div>
    </form>
  );
};

export default ForgotPhone;