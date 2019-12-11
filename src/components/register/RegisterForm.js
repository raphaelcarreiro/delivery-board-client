import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import PhoneInput from '../masked-input/PhoneInput';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
  },
});

export default function RegisterForm({ user, validation, handleChange }) {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  return (
    <div>
      <div className={classes.header}>
        <img width={70} src={restaurant && restaurant.image.imageUrl} alt="Logo" />
        <Typography variant="h6">Criar conta</Typography>
        <Typography variant="body2" color="textSecondary">
          É rapidinho, complete os 5 campos abaixo.
        </Typography>
      </div>
      <TextField
        error={!!validation.name}
        helperText={validation.name}
        label="Nome completo"
        placeholder="Digite seu nome completo"
        margin="normal"
        fullWidth
        value={user.name}
        onChange={event => handleChange('name', event.target.value)}
        autoFocus
      />
      <TextField
        error={!!validation.phone}
        helperText={validation.phone}
        label="Telefone"
        placeholder="Seu telefone"
        margin="normal"
        fullWidth
        InputProps={{
          inputComponent: PhoneInput,
        }}
        value={user.phone}
        onChange={event => handleChange('phone', event.target.value)}
      />
      <TextField
        error={!!validation.email}
        helperText={validation.email}
        label="Email"
        placeholder="Digite seu e-mail"
        margin="normal"
        fullWidth
        value={user.email}
        onChange={event => handleChange('email', event.target.value)}
      />
      <TextField
        error={!!validation.password}
        helperText={validation.password}
        type="password"
        label="Senha"
        placeholder="Digite seu senha"
        margin="normal"
        fullWidth
        value={user.password}
        onChange={event => handleChange('password', event.target.value)}
      />
      <TextField
        error={!!validation.passwordConfirm}
        helperText={validation.passwordConfirm}
        type="password"
        label="Confirme a senha"
        placeholder="Digite novamente a sua senha"
        margin="normal"
        fullWidth
        value={user.passwordConfirm}
        onChange={event => handleChange('passwordConfirm', event.target.value)}
      />
    </div>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
  }).isRequired,
  validation: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
  }),
  handleChange: PropTypes.func.isRequired,
};
