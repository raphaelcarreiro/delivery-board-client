import React, { useContext, useRef, useEffect, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { changeCreditCard, setCard } from 'src/store/redux/modules/order/actions';
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
import Card from './card/Card';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      flexDirection: 'column-reverse',
      flexWrap: 'nowrap',
    },
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
  const [face, setFace] = useState('front');
  const theme = useTheme();
  const [name, setName] = useState(order.creditCard.name);
  const [number, setNumber] = useState(order.creditCard.number);
  const [cvv, setCvv] = useState(order.creditCard.cvv);
  const [expirationDate, setExpirationDate] = useState(order.creditCard.expiration_date);
  const [cpf, setCpf] = useState(order.creditCard.cpf);

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

    const card = {
      number,
      name,
      expiration_date: expirationDate,
      cvv,
      cpf,
    };

    schema
      .validate(card)
      .then(() => {
        setValidation({});
        dispatch(setCard(card));
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

  function handleFocus(face) {
    setFace(face);
  }

  return (
    <CustomDialog
      title="Cartão"
      handleModalState={onExited}
      displayBottomActions
      componentActions={<PaymentCardActions handleSubmit={handleCardValidation} />}
      maxWidth="md"
      height="70vh"
    >
      <CustomDialogContext.Consumer>
        {({ handleCloseDialog }) => (
          <div className={classes.container}>
            <Grid item xl={5} lg={5} md={10} xs={12}>
              <TextField
                inputRef={ref => (inputs.number = ref)}
                error={!!validation.number}
                helperText={validation.number}
                label="Número do cartão"
                margin="normal"
                placeholder="Número do cartão"
                value={number}
                onChange={e => setNumber(e.target.value)}
                fullWidth
                autoFocus
                autoComplete="cc-number"
                InputProps={{
                  inputComponent: CardNumber,
                }}
                onFocus={() => handleFocus('front')}
              />
              <TextField
                inputRef={ref => (inputs.name = ref)}
                label="Nome e sobrenome"
                error={!!validation.name}
                helperText={validation.name ? validation.name : 'Assim como está escrito no cartão'}
                margin="normal"
                placeholder="Nome e sobrenome"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                autoComplete="cc-name"
                onFocus={() => handleFocus('front')}
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
                    value={expirationDate}
                    onChange={e => setExpirationDate(e.target.value)}
                    fullWidth
                    autoComplete="cc-exp"
                    InputProps={{
                      inputComponent: CardExpirationDate,
                    }}
                    onFocus={() => handleFocus('front')}
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
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    autoComplete="cc-csc"
                    fullWidth
                    InputProps={{
                      inputComponent: CardSecurityCode,
                    }}
                    onFocus={() => handleFocus('back')}
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
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                fullWidth
                InputProps={{
                  inputComponent: CpfInput,
                }}
                onFocus={() => handleFocus('front')}
              />
              <div className={classes.actions}>
                <Button type="submit" variant="contained" color="primary" onClick={handleCardValidation}>
                  Confirmar
                </Button>
              </div>
            </Grid>
            <Card
              color={theme.palette.primary.contrastText}
              background={theme.palette.primary.main}
              number={number}
              name={name}
              expirationDate={expirationDate}
              cvv={cvv}
              face={face}
            />
          </div>
        )}
      </CustomDialogContext.Consumer>
    </CustomDialog>
  );
}
