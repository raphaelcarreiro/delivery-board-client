import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type ForgotStep = 'phone' | 'pin' | 'reset';

export interface ForgotContextValue {
  step: ForgotStep;
  setStep: Dispatch<SetStateAction<ForgotStep>>;
  pin: string;
  setPin: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
}

const ForgotContext = createContext<ForgotContextValue>({} as ForgotContextValue);
export const ForgotProvider = ForgotContext.Provider;
export const ForgotConsumer = ForgotContext.Consumer;

export function useForgot(): ForgotContextValue {
  const context = useContext(ForgotContext);
  return context;
}
