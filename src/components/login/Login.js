import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoginEmailStep from './LoginEmailStep';
import LoginPasswordStep from './LoginPasswordStep';
import { api } from '../../services/api';
import { MessagingContext } from '../messaging/Messaging';
import { AppContext } from '../../../pages/_app';
import Loading from '../loading/Loading';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../services/auth';

const useStyles = makeStyles({
  action: {
    marginTop: 20,
  },
});

function Login() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const messaging = useContext(MessagingContext);
  const appContext = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.push('/account');
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (step === 'email') {
      setLoading(true);

      api()
        .get(`/user/show/${email}`)
        .then(response => {
          setName(response.data.name);
          setStep('password');
          messaging.handleClose();
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) messaging.handleOpen('E-mail não encontrado');
          } else messaging.handleOpen(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);

      api()
        .post('/login', { email, password })
        .then(response => {
          localStorage.setItem(process.env.localStorageTokenName, response.data.token);
          appContext.handleSetUser(response.data.user);
          router.push('/');
        })
        .catch(err => {
          if (err.response)
            if (err.response.status === 401) messaging.handleOpen('Usuário ou senha incorretos');
            else messaging.handleOpen(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      {loading && <Loading />}
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={4} xl={4} md={6}>
          <form onSubmit={handleSubmit}>
            {step === 'email' ? (
              <LoginEmailStep email={email} setEmail={setEmail} />
            ) : (
              <LoginPasswordStep name={name} password={password} setPassword={setPassword} />
            )}
            <div className={classes.action}>
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                {step === 'email' ? 'Próximo' : 'Entrar'}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
