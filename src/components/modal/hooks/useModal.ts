import { createContext, useContext } from 'react';

interface ModalContextValue {
  handleModalClose(): void;
}

const ModalContext = createContext<ModalContextValue>({} as ModalContextValue);
export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  return context;
}
