import React, { useContext, useRef, useEffect, useState, FormEvent, useCallback } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { changeCreditCard, setCard } from 'src/store/redux/modules/order/actions';
import CardSecurityCode from 'src/components/masked-input/CardSecurityCode';
import CardExpirationDate from 'src/components/masked-input/CardExperitionDate';
import CpfInput from 'src/components/masked-input/CpfInput';
import CardNumber from 'src/components/masked-input/CardNumber';
import { CheckoutContext } from '../../../Checkout';
import CustomDialog from 'src/components/dialog/CustomDialog';
import PaymentCardActions from './PaymentCardActions';
import { useCardValidation } from '../validation/useCardValidation';
import { useSelector } from 'src/store/redux/selector';
import MaskedInput from 'react-text-mask';
import { format } from 'date-fns';

declare global {
  interface Window {
    Mercadopago: any;
  }
}

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

interface PaymentMercadoPagoProps {
  onExited(): void;
}

const PaymentMercadoPago: React.FC<PaymentMercadoPagoProps> = ({ onExited }) => {
  const classes = useStyles();
  const order = useSelector(state => state.order);
  const dispatch = useDispatch();
  const checkout = useContext(CheckoutContext);
  const [name, setName] = useState(order.creditCard.name);
  const [number, setNumber] = useState(order.creditCard.number);
  const [cvv, setCvv] = useState(order.creditCard.cvv);
  const [expirationDate, setExpirationDate] = useState(order.creditCard.expiration_date);
  const [cpf, setCpf] = useState(order.creditCard.cpf);
  const [validation, setValidation, validate] = useCardValidation();
  const formElement = useRef<HTMLFormElement>(null);
  const [cardExpirationMonth, setCardExpirationMonth] = useState('');
  const [cardExpirationYear, setCardExpirationYear] = useState('');

  const inputs = {
    number: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    expiration_date: useRef<HTMLInputElement>(null),
    cvv: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
  };

  const setPaymentMethod = useCallback(
    (cardnumber: string) => {
      window.Mercadopago.getPaymentMethod(
        {
          bin: cardnumber,
        },
        (status, response) => {
          if (status === 200 || status === 201) dispatch(changeCreditCard('brand', response[0].id));
        }
      );
    },
    [dispatch]
  );

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key) return;

    inputs[key].current?.focus();
  }, [validation]); //eslint-disable-line

  useEffect(() => {
    const bin = number.replace(/\D/g, '');
    if (bin.length < 15) return;

    window.Mercadopago.getPaymentMethod(
      {
        bin: bin,
      },
      () => setPaymentMethod(bin)
    );
  }, [number, setPaymentMethod]);

  useEffect(() => {
    const rawDate = expirationDate.replace(/\D/g, '');
    if (rawDate.length < 6) return;

    const splitedDate = expirationDate.split('/');

    const date = new Date(parseInt(splitedDate[1]), parseInt(splitedDate[0]) - 1, 1);

    setCardExpirationMonth(format(date, 'MM'));
    setCardExpirationYear(format(date, 'yy'));
  }, [expirationDate, number]);

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
    if (formElement.current)
      window.Mercadopago.createToken(formElement.current, (status, response) => {
        if (status === 200 || status === 201) {
          dispatch(changeCreditCard('token', response.id));
        }
      });

    dispatch(setCard(card));

    checkout.setIsCardValid(true);
    checkout.handleStepNext();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <CustomDialog
      title="cartão de crédito"
      handleModalState={onExited}
      componentActions={<PaymentCardActions handleSubmit={handleCardValidation} />}
      maxWidth="sm"
      height="70vh"
    >
      <div className={classes.container}>
        <form method="post" ref={formElement} onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <input type="hidden" value="CPF" id="docType" name="docType" data-checkout="docType" />
            <input
              type="hidden"
              value={cardExpirationMonth}
              id="cardExpirationMonth"
              data-checkout="cardExpirationMonth"
            />
            <input
              type="hidden"
              id="cardExpirationYear"
              value={cardExpirationYear}
              data-checkout="cardExpirationYear"
            />
            <TextField
              inputRef={inputs.number}
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
                inputComponent: CardNumber as any,
              }}
              inputProps={{
                'data-checkout': 'cardNumber',
              }}
              id="cardNumber"
            />
            <TextField
              inputRef={inputs.name}
              label="Nome e sobrenome"
              error={!!validation.name}
              helperText={validation.name ? validation.name : 'Assim como está escrito no cartão'}
              margin="normal"
              placeholder="Nome e sobrenome"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              autoComplete="cc-name"
              inputProps={{
                'data-checkout': 'cardholderName',
              }}
              id="cardholderName"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  inputRef={inputs.expiration_date}
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
                    inputComponent: CardExpirationDate as any,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  inputRef={inputs.cvv}
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
                    inputComponent: CardSecurityCode as any,
                  }}
                  inputProps={{
                    'data-checkout': 'securityCode',
                  }}
                  id="securityCode"
                />
              </Grid>
            </Grid>
            <TextField
              inputRef={inputs.cpf}
              error={!!validation.cpf}
              helperText={validation.cpf}
              label="CPF do titular do cartão"
              margin="normal"
              placeholder="CPF do titular do cartão"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              fullWidth
              InputProps={{
                inputComponent: CpfInput as any,
              }}
              inputProps={{
                'data-checkout': 'docNumber',
              }}
              id="docNumber"
              name="docNumber"
            />
          </Grid>
        </form>
      </div>
    </CustomDialog>
  );
};

export default PaymentMercadoPago;
