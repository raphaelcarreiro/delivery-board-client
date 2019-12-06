import React from 'react';
import Head from 'next/head';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  textField: {
    marginBottom: 20,
  },
});

function Login() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={4} xl={4} md={6}>
          <Typography align="center" variant="h6">
            Precisamos saber o seu e-mail
          </Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            margin="normal"
            label="Seu e-mail"
            placeholder="Para iniciar, informe seu e-mail"
            autoFocus
            fullWidth
          />
          <Button fullWidth variant="contained" color="primary">
            Próximo
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
