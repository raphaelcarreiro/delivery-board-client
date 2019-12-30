import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function LoginEmailStep({ email, setEmail }) {
  return (
    <div>
      <Typography align="center">Se você já se registrou, informe seu e-mail.</Typography>
      <TextField
        variant="outlined"
        label="E-mail ou telefone"
        placeholder="Seu e-mail ou telefone"
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
