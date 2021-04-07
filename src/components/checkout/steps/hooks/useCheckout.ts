import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { CreatedOrder } from 'src/types/order';

export interface CheckoutContextValue {
  handleStepNext(): void;
  handleStepPrior(): void;
  handleSubmitOrder(): void;
  handleSetStep(step: number): void;
  handleSetStepById(id: string): void;
  setIsCardValid: Dispatch<SetStateAction<boolean>>;
  isCardValid: boolean;
  saving: boolean;
  createdOrder: CreatedOrder | null;
  step: number;
}

const CheckoutContext = createContext<CheckoutContextValue>({} as CheckoutContextValue);
export const CheckoutProvider = CheckoutContext.Provider;
export const CheckoutConsumer = CheckoutContext.Consumer;

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  return context;
}
