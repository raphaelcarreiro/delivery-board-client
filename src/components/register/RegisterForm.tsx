import React, { useEffect, useRef } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { UserRegisterValidation } from './validation/registerValidation';
import PhoneInput from '../masked-input/PhoneInput';
import { makeStyles } from '@material-ui/core/styles';
import { UserRegister } from 'src/types/userRegister';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
  },
});

type RegisterFormProps = {
  user: UserRegister;
  validation: UserRegisterValidation;
  handleChange(index: keyof UserRegister, value: string): void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ user, validation, handleChange }) => {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  const inputs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    passwordConfirm: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key || !inputs[key]) return;

    inputs[key].current?.focus();
  }, [validation]); //eslint-disable-line

  return (
    <div>
      <div className={classes.header}>
        {restaurant && <img width={70} src={restaurant.image.imageUrl} alt="Logo" />}
        <Typography variant="h6">Criar conta</Typography>
        <Typography variant="body2" color="textSecondary">
          É rapidinho, complete os 5 campos abaixo.
        </Typography>
      </div>
      <TextField
        inputRef={inputs.name}
        error={!!validation.name}
        helperText={validation.name}
        label="Nome completo"
        placeholder="Digite seu nome completo"
        margin="normal"
        fullWidth
        value={user.name}
        onChange={event => handleChange('name', event.target.value)}
        autoFocus
        autoComplete="name"
      />
      <TextField
        inputRef={inputs.phone}
        error={!!validation.phone}
        helperText={validation.phone}
        label="Telefone"
        placeholder="Seu telefone"
        margin="normal"
        fullWidth
        InputProps={{
          inputComponent: PhoneInput as any,
        }}
        value={user.phone}
        onChange={event => handleChange('phone', event.target.value)}
        autoComplete="tel"
        inputProps={{
          inputMode: 'numeric',
        }}
      />
      <TextField
        inputRef={inputs.email}
        error={!!validation.email}
        helperText={validation.email}
        label="Email"
        placeholder="Digite seu e-mail"
        margin="normal"
        fullWidth
        value={user.email}
        onChange={event => handleChange('email', event.target.value)}
        autoComplete="email"
      />
      <TextField
        inputRef={inputs.password}
        error={!!validation.password}
        helperText={validation.password}
        type="password"
        label="Senha"
        placeholder="Digite seu senha"
        margin="normal"
        fullWidth
        value={user.password}
        onChange={event => handleChange('password', event.target.value)}
        autoComplete="new-password"
      />
      <TextField
        inputRef={inputs.passwordConfirm}
        error={!!validation.passwordConfirm}
        helperText={validation.passwordConfirm}
        type="password"
        label="Confirme a senha"
        placeholder="Digite novamente a sua senha"
        margin="normal"
        fullWidth
        value={user.passwordConfirm}
        onChange={event => handleChange('passwordConfirm', event.target.value)}
        autoComplete="new-password"
      />
    </div>
  );
};

export default RegisterForm;
