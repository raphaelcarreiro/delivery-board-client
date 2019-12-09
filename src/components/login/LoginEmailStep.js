import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function LoginEmailStep({ email, setEmail }) {
  return (
    <>
      <Typography align="center" variant="h6">
        Precisamos saber o seu e-mail
      </Typography>
      <TextField
        type="email"
        variant="outlined"
        margin="normal"
        label="Seu e-mail"
        placeholder="Para iniciar, informe seu e-mail"
        autoFocus
        fullWidth
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
    </>
  );
}

LoginEmailStep.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};
