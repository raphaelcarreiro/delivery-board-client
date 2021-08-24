import React, { useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import ForgotPhone from './ForgotPhone';
import ForgotPasswordReset from './ForgotPasswordReset';
import ForgotPin from './ForgotPin';
import { ForgotProvider, ForgotStep } from './hook/useForgot';
import { Pin } from 'src/types/pin';

type PasswordRequestProps = {
  phoneProp?: string | null;
};

const Forgot: React.FC<PasswordRequestProps> = ({ phoneProp }) => {
  const [step, setStep] = useState<ForgotStep>('phone');
  const [pin, setPin] = useState<Pin>({
    firstDigit: '',
    secondDigit: '',
    thirthDigit: '',
    fourthDigit: '',
  });
  const [phone, setPhone] = useState(phoneProp || '');

  const formattedPin = useMemo(() => `${pin.firstDigit}${pin.secondDigit}${pin.thirthDigit}${pin.fourthDigit}`, [pin]);

  return (
    <ForgotProvider value={{ step, setStep, pin, setPin, phone, setPhone, formattedPin }}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={4} xl={3} md={6}>
          {step === 'phone' ? <ForgotPhone /> : step === 'pin' ? <ForgotPin /> : <ForgotPasswordReset />}
        </Grid>
      </Grid>
    </ForgotProvider>
  );
};

export default Forgot;
