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
  accountImage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
  const [name, setName] = useState(user.customer ? user.customer.name : '');
  const [phone, setPhone] = useState(user.customer ? user.customer.phone : '');
  const [cpf, setCpf] = useState(user.customer ? user.customer.cpf : '');
  const [image, setImage] = useState(user.image);
  const [isImageSelected, setIsImageSelected] = useState(false);

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
      name,
      phone,
      cpf,
      image,
      customer: {
        cpf,
      },
    };

    schema
      .validate(form)
      .then(() => {
        handleSubmit(form);
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  return (
    <form onSubmit={accountFormHandleSubmit}>
      <Grid container>
        <div className={classes.accountImage}>
          <AccountImage
            image={image}
            setImage={setImage}
            isImageSelected={isImageSelected}
            setIsImageSelected={setIsImageSelected}
            handleImageDelete={handleImageDelete}
          />
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
            value={user.email}
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
            value={name}
            fullWidth
            onChange={event => setName(event.target.value)}
          />
          <TextField
            error={!!validation.phone}
            helperText={validation.phone}
            variant="standard"
            label="Telefone"
            placeholder="Telefone"
            margin="normal"
            value={phone}
            onChange={event => setPhone(event.target.value)}
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
            value={cpf}
            onChange={event => setCpf(event.target.value)}
            fullWidth
            InputProps={{
              inputComponent: CpfInput,
            }}
          />
          <div className={classes.actions}>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              Confirmar
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
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
