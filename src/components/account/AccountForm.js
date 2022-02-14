import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid, Button, Typography, darken } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountImage from './AccountImage';
import PhoneInput from '../masked-input/PhoneInput';
import CpfInput from '../masked-input/CpfInput';
import { useAuth } from 'src/providers/AuthProvider';

const useStyles = makeStyles(theme => ({
  actions: {
    marginTop: 35,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  accountImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
    },
  },
  disconnectButton: {
    marginTop: 30,
    display: 'none',
    backgroundColor: theme.palette.error.main,
    width: '100%',
    color: 'white',
    height: 45,
    '&:hover': {
      backgroundColor: darken(theme.palette.error.main, 0.1),
    },
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
}));

export default function AccountForm({ userCustomer, handleValidation, saving, validation, handleUserCustomerChange }) {
  const classes = useStyles();
  const { logout } = useAuth();

  function handleSubmit(event) {
    event.preventDefault();
    handleValidation();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <div className={classes.accountImage}>
          <AccountImage />
          <Typography variant="body2" color="textSecondary">
            Foto do perfil
          </Typography>
        </div>
        <Grid item xl={4} lg={4} md={6} xs={12}>
          <TextField
            variant="standard"
            label="E-mail"
            placeholder="E-mail"
            margin="normal"
            value={userCustomer.email}
            fullWidth
            disabled
          />
          <TextField
            error={!!validation.name}
            helperText={validation.name}
            variant="standard"
            label="Nome"
            placeholder="Nome"
            margin="normal"
            value={userCustomer.name}
            fullWidth
            onChange={event => handleUserCustomerChange('name', event.target.value)}
          />
          <TextField
            error={!!validation.phone}
            helperText={validation.phone}
            variant="standard"
            label="Telefone"
            placeholder="Telefone"
            margin="normal"
            value={userCustomer.phone}
            onChange={event => handleUserCustomerChange('phone', event.target.value)}
            fullWidth
            InputProps={{
              inputComponent: PhoneInput,
            }}
          />
          <TextField
            error={!!validation.cpf}
            helperText={validation.cpf}
            variant="standard"
            label="CPF"
            placeholder="CPF"
            margin="normal"
            value={userCustomer.cpf}
            onChange={event => handleUserCustomerChange('cpf', event.target.value)}
            fullWidth
            InputProps={{
              inputComponent: CpfInput,
            }}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
          <div className={classes.actions}>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              Confirmar
            </Button>
          </div>
          <div>
            <Button onClick={logout} className={classes.disconnectButton} variant="contained">
              Desconectar
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
}

AccountForm.propTypes = {
  userCustomer: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired,
  handleValidation: PropTypes.func.isRequired,
  handleUserCustomerChange: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};
