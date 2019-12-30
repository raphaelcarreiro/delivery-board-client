import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountImage from './AccountImage';
import PhoneInput from '../masked-input/PhoneInput';
import CpfInput from '../masked-input/CpfInput';
import * as Yup from 'yup';
import { cpfValidation } from '../../helpers/cpfValidation';

const useStyles = makeStyles(theme => ({
  actions: {
    marginTop: 35,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export default function AccountForm({
  user,
  handleUserChange,
  handleCustomerChange,
  handleImageSelect,
  handleImageDelete,
  handleSubmit,
  saving,
}) {
  const classes = useStyles();
  const [validation, setValidation] = useState({});

  function accountFormHandleSubmit(event) {
    event.preventDefault();

    setValidation({});

    const schema = Yup.object().shape({
      cpf: Yup.string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .test('cpfValidation', 'CPF inválido', value => {
          return cpfValidation(value);
        })
        .required('CPF é obrigatório'),
      phone: Yup.string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .min(10, 'Telefone inválido')
        .required('O telefone é obrigatório'),
      name: Yup.string()
        .min(3, 'Nome inválido')
        .required('O nome é obrigatório'),
    });

    const form = {
      name: user.name,
      phone: user.customer.phone,
      cpf: user.customer.cpf,
    };

    schema
      .validate(form)
      .then(() => {
        handleSubmit();
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  return (
    <>
      <form onSubmit={accountFormHandleSubmit}>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <TextField
            variant="standard"
            label="E-mail"
            placeholder="E-mail"
            margin="normal"
            value={user.email}
            onChange={event => handleUserChange('email', event.target.value)}
            fullWidth
            disabled
          />
          <TextField
            error={validation.name}
            helperText={validation.name}
            variant="standard"
            label="Nome"
            placeholder="Nome"
            margin="normal"
            value={user.name}
            fullWidth
            onChange={event => handleUserChange('name', event.target.value)}
          />
          <TextField
            error={validation.phone}
            helperText={validation.phone}
            variant="standard"
            label="Telefone"
            placeholder="Telefone"
            margin="normal"
            value={user.customer && user.customer.phone}
            onChange={event => handleCustomerChange('phone', event.target.value)}
            fullWidth
            InputProps={{
              inputComponent: PhoneInput,
            }}
          />
          <TextField
            error={validation.cpf}
            helperText={validation.cpf}
            variant="standard"
            label="CPF"
            placeholder="CPF"
            margin="normal"
            value={user.customer && user.customer.cpf}
            onChange={event => handleCustomerChange('cpf', event.target.value)}
            fullWidth
            InputProps={{
              inputComponent: CpfInput,
            }}
          />
          <AccountImage
            user={user}
            handleUserChange={handleUserChange}
            handleImageSelect={handleImageSelect}
            handleImageDelete={handleImageDelete}
          />
          <Typography variant="body2" color="textSecondary">
            Foto do perfil
          </Typography>
        </Grid>
        <div className={classes.actions}>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            Confirmar
          </Button>
        </div>
      </form>
    </>
  );
}

AccountForm.propTypes = {
  user: PropTypes.object.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  handleCustomerChange: PropTypes.func.isRequired,
  handleImageSelect: PropTypes.func.isRequired,
  handleImageDelete: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};
