import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Pin } from 'src/types/pin';

export type ForgotStep = 'phone' | 'pin' | 'reset';

export interface ForgotContextValue {
  step: ForgotStep;
  setStep: Dispatch<SetStateAction<ForgotStep>>;
  pin: Pin;
  setPin: Dispatch<SetStateAction<Pin>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  formattedPin: string;
}

const ForgotContext = createContext<ForgotContextValue>({} as ForgotContextValue);
export const ForgotProvider = ForgotContext.Provider;
export const ForgotConsumer = ForgotContext.Consumer;

export function useForgot(): ForgotContextValue {
  const context = useContext(ForgotContext);
  return context;
}
