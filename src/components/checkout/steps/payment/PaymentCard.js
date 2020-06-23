import React, { useContext, useRef, useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { changeCreditCard } from 'src/store/redux/modules/order/actions';
import CardSecurityCode from 'src/components/masked-input/CardSecurityCode';
import CardExpirationDate from 'src/components/masked-input/CardExperitionDate';
import CpfInput from 'src/components/masked-input/CpfInput';
import CardNumber from 'src/components/masked-input/CardNumber';
import { CheckoutContext } from '../../Checkout';
import CustomDialog, { CustomDialogContext } from 'src/components/dialog/CustomDialog';
import PaymentCardActions from './PaymentCardActions';
import * as yup from 'yup';
import { cpfValidation } from 'src/helpers/cpfValidation';
import { cardBrandValidation } from 'src/helpers/cardBrandValidation';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
    padding: 15,
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
}));

export default function PaymentCard({ onExited }) {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);
  const [validation, setValidation] = useState({});

  const inputs = {
    number: useRef(null),
    name: useRef(null),
    expiration_date: useRef(null),
    cvv: useRef(null),
    cpf: useRef(null),
  };

  useEffect(() => {
    if (validation.number) inputs.number.focus();
    else if (validation.name) inputs.name.focus();
    else if (validation.expiration_date) inputs.expiration_date.focus();
    else if (validation.cvv) inputs.cvv.focus();
    else if (validation.cpf) inputs.cpf.focus();
  }, [validation]); //eslint-disable-line

  function handleChange(index, value) {
    dispatch(changeCreditCard(index, value));
  }

  function handleCardValidation() {
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
      cvv: yup
        .string()
        .min(3, 'O código de segurança deve ter 3 digitos')
        .required('O código de segurança é obrigatório'),
      expiration_date: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(4, 'Data de validade inválida')
        .required('A data de validade do cartão é obrigatória'),
      name: yup.string().required('O nome e sobrenome são obrigatórios'),
      number: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue.replace(/\D/g, '');
        })
        .min(12, 'Número do cartão inválido')
        .test('cardValidation', 'Infelizmente não trabalhamos com essa bandeira de cartão', value => {
          return cardBrandValidation(value);
        })
        .required('O número do cartão é obrigatório'),
    });

    schema
      .validate(order.creditCard)
      .then(() => {
        setValidation({});
        checkout.setIsCardValid(true);
        checkout.handleStepNext();
      })
      .catch(err => {
        checkout.setIsCardValid(false);
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  return (
    <CustomDialog
      title="Cartão"
      handleModalState={onExited}
      displayBottomActions
      componentActions={<PaymentCardActions handleSubmit={handleCardValidation} />}
      maxWidth="sm"
      height="70vh"
    >
      <CustomDialogContext.Consumer>
        {({ handleCloseDialog }) => (
          <Grid container className={classes.container}>
            <Grid item xl={9} lg={10} md={8} xs={12}>
              <TextField
                inputRef={ref => (inputs.number = ref)}
                error={!!validation.number}
                helperText={validation.number}
                label="Número do cartão"
                margin="normal"
                placeholder="Número do cartão"
                value={order.creditCard.number}
                onChange={e => handleChange('number', e.target.value)}
                fullWidth
                autoFocus
                autoComplete="cc-number"
                InputProps={{
                  inputComponent: CardNumber,
                }}
              />
              <TextField
                inputRef={ref => (inputs.name = ref)}
                label="Nome e sobrenome"
                error={!!validation.name}
                helperText={validation.name ? validation.name : 'Assim como está escrito no cartão'}
                margin="normal"
                placeholder="Nome e sobrenome"
                value={order.creditCard.name}
                onChange={e => handleChange('name', e.target.value)}
                fullWidth
                autoComplete="cc-name"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    inputRef={ref => (inputs.expiration_date = ref)}
                    error={!!validation.expiration_date}
                    helperText={validation.expiration_date ? validation.expiration_date : 'MM/AA'}
                    label="Vencimento"
                    margin="normal"
                    placeholder="Vencimento do cartão"
                    value={order.creditCard.expiration_date}
                    onChange={e => handleChange('expiration_date', e.target.value)}
                    fullWidth
                    autoComplete="cc-exp"
                    InputProps={{
                      inputComponent: CardExpirationDate,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputRef={ref => (inputs.cvv = ref)}
                    label="Código"
                    error={!!validation.cvv}
                    helperText={validation.cvv ? validation.cvv : 'Últimos três número do verso do seu cartão'}
                    margin="normal"
                    placeholder="Código de segurança"
                    value={order.creditCard.cvv}
                    onChange={e => handleChange('cvv', e.target.value)}
                    autoComplete="cc-csc"
                    fullWidth
                    InputProps={{
                      inputComponent: CardSecurityCode,
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                inputRef={ref => (inputs.cpf = ref)}
                error={!!validation.cpf}
                helperText={validation.cpf}
                label="CPF do titular do cartão"
                margin="normal"
                placeholder="CPF do titular do cartão"
                value={order.creditCard.cpf}
                onChange={e => handleChange('cpf', e.target.value)}
                fullWidth
                InputProps={{
                  inputComponent: CpfInput,
                }}
              />
              <div className={classes.actions}>
                <Button type="submit" variant="contained" color="primary" onClick={handleCardValidation}>
                  Confirmar
                </Button>
              </div>
            </Grid>
          </Grid>
        )}
      </CustomDialogContext.Consumer>
    </CustomDialog>
  );
}
