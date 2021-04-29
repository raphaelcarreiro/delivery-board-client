import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Area } from 'src/types/area';
import { CreatedOrder } from 'src/types/order';
import { CheckoutStep } from '../steps';

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
  currentStep?: CheckoutStep;
  area: null | Area;
}

const CheckoutContext = createContext<CheckoutContextValue>({} as CheckoutContextValue);
export const CheckoutProvider = CheckoutContext.Provider;
export const CheckoutConsumer = CheckoutContext.Consumer;

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  return context;
}
