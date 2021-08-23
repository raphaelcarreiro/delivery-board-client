import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import ForgotPhone from './ForgotPhone';
import ForgotPasswordReset from './ForgotPasswordReset';
import ForgotPin from './ForgotPin';
import { ForgotProvider, ForgotStep } from './hook/useForgot';

const Forgot: React.FC = () => {
  const [step, setStep] = useState<ForgotStep>('phone');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <ForgotProvider value={{ step, setStep, pin, setPin, phone, setPhone }}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} lg={4} xl={3} md={6}>
          {step === 'phone' ? <ForgotPhone /> : step === 'pin' ? <ForgotPin /> : <ForgotPasswordReset />}
        </Grid>
      </Grid>
    </ForgotProvider>
  );
};

export default Forgot;
