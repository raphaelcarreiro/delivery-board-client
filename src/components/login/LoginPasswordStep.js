import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function LoginPasswordStep({ password, setPassword, name }) {
  return (
    <>
      <Typography align="center" variant="h6">
        {name}, digite a senha
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        label="Sua senha"
        placeholder={`Informe sua senha ${name}`}
        autoFocus
        fullWidth
        value={password}
        type="password"
        onChange={event => setPassword(event.target.value)}
      />
    </>
  );
}

LoginPasswordStep.propTypes = {
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
