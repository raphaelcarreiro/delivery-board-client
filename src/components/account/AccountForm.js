import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountImage from './AccountImage';

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

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            variant="standard"
            label="Nome"
            placeholder="Nome"
            margin="normal"
            value={user.name}
            fullWidth
            onChange={event => handleUserChange('name', event.target.value)}
          />
          <TextField
            variant="standard"
            label="Telefone"
            placeholder="Telefone"
            margin="normal"
            value={user.customer && user.customer.phone}
            onChange={event => handleCustomerChange('phone', event.target.value)}
            fullWidth
          />
          <TextField
            variant="standard"
            label="CPF"
            placeholder="CPF"
            margin="normal"
            value={user.customer && user.customer.cpf}
            onChange={event => handleCustomerChange('cpf', event.target.value)}
            fullWidth
          />
          <AccountImage
            user={user}
            handleUserChange={handleUserChange}
            handleImageSelect={handleImageSelect}
            handleImageDelete={handleImageDelete}
          />
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
