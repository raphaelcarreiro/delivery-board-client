import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function LoginEmailStep({ email, setEmail }) {
  return (
    <div>
      <Typography align="center">Vamos lá, informe seu email.</Typography>
      <TextField
        type="email"
        variant="outlined"
        label="Seu e-mail"
        placeholder="Seu e-mail"
        autoFocus
        fullWidth
        value={email}
        onChange={event => setEmail(event.target.value)}
        required
        margin="normal"
      />
    </div>
  );
}

LoginEmailStep.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};
