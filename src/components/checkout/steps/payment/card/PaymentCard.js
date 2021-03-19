import React, { useContext, useRef, useEffect, useState } from 'react';
import { Grid, TextField, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setCard } from 'src/store/redux/modules/order/actions';
import CardSecurityCode from 'src/components/masked-input/CardSecurityCode';
import CardExpirationDate from 'src/components/masked-input/CardExperitionDate';
import CpfInput from 'src/components/masked-input/CpfInput';
import CardNumber from 'src/components/masked-input/CardNumber';
import { CheckoutContext } from '../../../Checkout';
import CustomDialog, { CustomDialogContext } from 'src/components/dialog/CustomDialog';
import PaymentCardActions from './PaymentCardActions';
import Card from './Card';
import { useCardValidation } from '../validation/useCardValidation';

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
}));

export default function PaymentCard({ onExited }) {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);
  const [face, setFace] = useState('back');
  const theme = useTheme();
  const [name, setName] = useState(order.creditCard.name);
  const [number, setNumber] = useState(order.creditCard.number);
  const [cvv, setCvv] = useState(order.creditCard.cvv);
  const [expirationDate, setExpirationDate] = useState(order.creditCard.expiration_date);
  const [cpf, setCpf] = useState(order.creditCard.cpf);
  const [validation, setValidation, validate] = useCardValidation();

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

  useEffect(() => {
    setFace('back');
  }, []);

  function handleCardValidation() {
    const card = {
      number,
      name,
      expiration_date: expirationDate,
      cvv,
      cpf,
    };

    setValidation({});

    validate(card)
      .then(() => {
        handleConfirm(card);
      })
      .catch(err => {
        console.error(err);
        checkout.setIsCardValid(false);
      });
  }

  function handleConfirm(card) {
    dispatch(setCard(card));

    checkout.setIsCardValid(true);
    checkout.handleStepNext();
  }

  function handleFocus(face) {
    setFace(face);
  }

  return (
    <CustomDialog
      title="Cartão"
      handleModalState={onExited}
      componentActions={<PaymentCardActions handleSubmit={handleCardValidation} />}
      maxWidth="md"
      height="70vh"
    >
      <CustomDialogContext.Consumer>
        {({ handleCloseDialog }) => (
          <div className={classes.container}>
            <Grid item xl={5} lg={5} md={5} xs={12}>
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
                    helperText={validation.expiration_date ? validation.expiration_date : 'MM/AAAA'}
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
            </Grid>
            <Card
              color={theme.palette.primary.contrastText}
              background={theme.palette.primary.dark}
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
