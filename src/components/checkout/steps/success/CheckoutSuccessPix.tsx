import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { CreatedOrder } from 'src/types/order';

const useStyles = makeStyles({
  qrCodeImage: {
    width: 305,
    height: 305,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '30px 0',
  },
  copyQrCodeContainer: {
    marginTop: 20,
  },
  button: {
    width: 160,
  },
});

interface CheckoutSuccessPixProps {
  order: CreatedOrder;
}

const CheckoutSucessPix: React.FC<CheckoutSuccessPixProps> = ({ order }) => {
  const classes = useStyles();
  const [buttonText, setButtonText] = useState('copiar código qr');

  function handleCopyToClipboard(value?: string) {
    if (!value) return;

    navigator.clipboard.writeText(value).then(
      () => {
        setButtonText('Copiado!');
        setTimeout(() => setButtonText('copiar código qr'), 2000);
      },
      err => console.error(err)
    );
  }

  return (
    <div className={classes.container}>
      <Typography>Código QR para pagamento com Pix</Typography>

      <div className={classes.copyQrCodeContainer}>
        <Button
          onClick={() => handleCopyToClipboard(order?.pix_payment?.qr_code)}
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
        >
          {buttonText}
        </Button>
      </div>

      <img
        className={classes.qrCodeImage}
        src={order?.pix_payment?.qr_code_base64}
        alt="qrcode para pagamento pedido"
      />
      <Typography align="center" variant="body2" color="textSecondary" gutterBottom>
        Este código tem válidade de 10min
      </Typography>
      <Typography align="center" variant="body2" color="textSecondary" gutterBottom>
        Você deve procurar a opção de colar código QR no app onde será realizado o pagamento.
      </Typography>
    </div>
  );
};

export default CheckoutSucessPix;
