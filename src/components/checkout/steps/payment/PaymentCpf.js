import React, { useState, useRef } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { customerChange } from 'src/store/redux/modules/user/actions';
import { api } from 'src/services/api';
import CpfInput from '../../../masked-input/CpfInput';
import * as yup from 'yup';
import { cpfValidation } from '../../../../helpers/cpfValidation';
import { useMessaging } from 'src/providers/MessageProvider';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  total: {
    fontWeight: 500,
  },
  btnConfirm: {
    marginTop: 30,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
}));

PaymentCpf.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function PaymentCpf({ onExited }) {
  const dispatch = useDispatch();
  const [cpf, setCpf] = useState('');
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const messaging = useMessaging();
  const user = useSelector(state => state.user);
  const [validation, setValidation] = useState({});
  const input = useRef(null);

  function handleValidation(event, handleCloseDialog) {
    event.preventDefault();

    setValidation({});

    const schema = yup.object().shape({
      cpf: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .test('cpfValidation', 'CPF inválido', value => {
          return cpfValidation(value);
        })
        .required('CPF é obrigatório'),
    });

    const form = {
      cpf,
    };

    schema
      .validate(form)
      .then(() => {
        handleSubmit(handleCloseDialog);
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
        input.current.focus();
      });
  }

  function handleSubmit(handleCloseDialog) {
    const form = {
      cpf,
    };

    setSaving(true);
    api
      .put(`customers/${user.customer.id}`, form)
      .then(response => {
        dispatch(customerChange('cpf', response.data.cpf));
        handleCloseDialog();
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <DialogInput onExited={onExited} maxWidth="xs">
      <DialogInputConsumer>
        {({ handleCloseDialog }) => (
          <div className={classes.container}>
            <form onSubmit={event => handleValidation(event, handleCloseDialog)} className={classes.form}>
              <Typography>Precisamos saber seu CPF</Typography>
              <TextField
                autoFocus
                ref={input}
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
                inputProps={{
                  inputMode: 'numeric',
                }}
              />
              <Button
                type="submit"
                disabled={!cpf || saving}
                className={classes.btnConfirm}
                color="primary"
                variant="contained"
                fullWidth
              >
                Confirmar
              </Button>
            </form>
          </div>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
