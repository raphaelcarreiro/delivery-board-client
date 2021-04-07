import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useMessaging } from 'src/hooks/messaging';
import { CreatedOrder } from 'src/types/order';
import { useCheckout } from '../hooks/useCheckout';

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
});

interface CheckoutSuccessPixProps {
  order: CreatedOrder;
}

const CheckoutSucessPix: React.FC<CheckoutSuccessPixProps> = ({ order }) => {
  const classes = useStyles();
  const messaging = useMessaging();

  function handleCopyToClipboard(value?: string) {
    if (!value) return;

    navigator.clipboard.writeText(value).then(
      () => {
        messaging.handleOpen('Código QR copiado!');
      },
      err => console.error(err)
    );
  }

  return (
    <div className={classes.container}>
      <Typography>Código QR para pagamento com PIX</Typography>

      <img
        className={classes.qrCodeImage}
        src={order?.pix_payment?.qr_code_base64}
        alt="qrcode para pagamento pedido"
      />
      <Typography align="center" variant="body2" color="textSecondary" gutterBottom>
        Se você estiver em um PC pode escanear o código QR. Caso contrário copie o código QR para realizar o pagamento.
      </Typography>
      <div className={classes.copyQrCodeContainer}>
        <Button
          onClick={() => handleCopyToClipboard(order?.pix_payment?.qr_code)}
          variant="contained"
          color="primary"
          size="small"
        >
          Copiar código QR
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSucessPix;
