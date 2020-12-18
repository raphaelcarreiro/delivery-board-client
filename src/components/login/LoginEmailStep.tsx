import React from 'react';
import { TextField, Typography } from '@material-ui/core';

type LoginEmailStepProps = {
  email: String;
  setEmail(email: string): void;
  emailError: string;
};

const LoginEmailStep: React.FC<LoginEmailStepProps> = ({ email, setEmail, emailError }) => {
  return (
    <div>
      <Typography align="center">Informe seu e-mail ou telefone.</Typography>
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
        autoComplete="email"
        error={!!emailError}
        helperText={emailError}
      />
    </div>
  );
};

export default LoginEmailStep;
