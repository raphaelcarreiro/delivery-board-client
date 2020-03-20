import React, { useState } from 'react';
import { Typography, TextField, InputAdornment, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  name: {
    fontWeight: 400,
  },
  info: {
    marginTop: 6,
  },
});

export default function LoginPasswordStep({ password, setPassword, name, phoneParam, emailParam }) {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  function handlePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <Typography align="center">
        Olá <span className={classes.name}>{name}</span>!
      </Typography>
      {phoneParam && (
        <Typography align="center" variant="body2" className={classes.info}>
          Encontramos um registro para esse telefone. Você se registrou em outro restaurante que usa o mesmo aplicativo.
        </Typography>
      )}
      {emailParam && (
        <Typography align="center" variant="body2" className={classes.info}>
          Encontramos um registro para esse email. Você se registrou em outro restaurante que usa o mesmo aplicativo.
        </Typography>
      )}
      <TextField
        variant="outlined"
        margin="normal"
        label="Sua senha"
        placeholder={`Informe sua senha ${name}`}
        autoFocus
        fullWidth
        value={password}
        type={showPassword ? 'text' : 'password'}
        onChange={event => setPassword(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="primary" onClick={handlePasswordVisibility}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

LoginPasswordStep.propTypes = {
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  phoneParam: PropTypes.string,
  emailParam: PropTypes.string,
};
