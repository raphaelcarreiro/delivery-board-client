import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PhoneInput from 'src/components/masked-input/PhoneInput';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
  },
});

export default function GuestRegisterForm({ user, validation, handleChange }) {
  const classes = useStyles();
  const restaurant = useSelector(state => state.restaurant);

  return (
    <div>
      <div className={classes.header}>
        <img width={70} src={restaurant && restaurant.image.imageUrl} alt="Logo" />
        <Typography variant="h6">Por favor, se identifique.</Typography>
      </div>
      <TextField
        error={!!validation.name}
        helperText={validation.name ? validation.name : 'Obrigatório'}
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
        helperText={validation.phone ? validation.phone : 'Obrigatório'}
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
      {/*
      <TextField
        error={!!validation.email}
        helperText={validation.email ? validation.email : 'Opcional, caso deseje acompanhar o andamento do pedido'}
        label="Email"
        placeholder="Digite seu e-mail"
        margin="normal"
        fullWidth
        value={user.email}
        onChange={event => handleChange('email', event.target.value)}
      />
      */}
    </div>
  );
}

GuestRegisterForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  validation: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }),
  handleChange: PropTypes.func.isRequired,
};
