import React, { FormEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, LinearProgress } from '@material-ui/core';
import { api } from 'src/services/api';
import Loading from '../loading/Loading';
import NextLink from 'next/link';
import { useMessaging } from 'src/providers/MessageProvider';
import CustomLink from '../link/CustomLink';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/providers/AppProvider';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid #ddd`,
    height: 500,
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

type PasswordRequestProps = {
  emailProp?: string;
};

const PasswordRequest: React.FC<PasswordRequestProps> = ({ emailProp }) => {
  const [email, setEmail] = useState(emailProp || '');
  const [validation, setValidation] = useState({ email: [] });
  const [loading, setLoading] = useState(false);
  const messaging = useMessaging();
  const app = useApp();
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidation({ email: [] });

    setLoading(true);

    api
      .post('password/email', { email })
      .then(response => {
        return response.data;
      })
      .then(() => {
        messaging.handleOpen('Enviamos uma mensagem no seu e-mail', { variant: 'default' });
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
                <Typography variant="body1" align="center" color="textSecondary">
                  você receberá um link para redefinir sua senha
                </Typography>
                <div>
                  <TextField
                    error={validation.email.length > 0}
                    helperText={validation.email.length > 0 && validation.email[0]}
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
                  <CustomLink href="/forgot/sms" color="primary">
                    tentar outro método
                  </CustomLink>
                </div>
              </div>
              <div className={classes.action}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  Enviar
                </Button>
                <CustomLink color="primary" href="/login/email">
                  voltar ao login
                </CustomLink>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default PasswordRequest;
