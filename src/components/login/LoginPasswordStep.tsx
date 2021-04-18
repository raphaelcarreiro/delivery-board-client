import React, { useState } from 'react';
import { Typography, TextField, InputAdornment, IconButton } from '@material-ui/core';
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

type LoginPasswordStepProps = {
  password: string;
  setPassword(passowd: string): void;
  name: string;
  phoneParam?: string;
  emailParam?: string;
  email: string;
  passwordError: string;
};

const LoginPasswordStep: React.FC<LoginPasswordStepProps> = ({
  password,
  setPassword,
  name,
  phoneParam,
  emailParam,
  email,
  passwordError,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  function handlePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <Typography align="center">
        olá <span className={classes.name}>{name}</span>!
      </Typography>
      {phoneParam && (
        <Typography align="center" variant="body2" className={classes.info}>
          Esse telefone já está registrado. Informe a senha.
        </Typography>
      )}
      {emailParam && (
        <Typography align="center" variant="body2" className={classes.info}>
          Esse e-mail já está registrado. Informe a senha
        </Typography>
      )}
      <input type="text" style={{ display: 'none' }} value={email} readOnly autoComplete="username email" />
      <TextField
        error={!!passwordError}
        helperText={passwordError}
        variant="outlined"
        margin="normal"
        label="Sua senha"
        placeholder={`Informe sua senha ${name}`}
        autoFocus
        fullWidth
        autoComplete="current-password"
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
};

export default LoginPasswordStep;
