import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Address } from 'src/types/address';

interface CustomerAddressContextValue {
  handleGetPlaceLatitudeLongitude(addressDescription: string): void;
  handleChange(index: keyof Address, value: any): void;
  handleNext(): void;
  handleBack(): void;
  setStep: Dispatch<SetStateAction<number>>;
  handleValidation(handleModalClose: () => void): void;
  setPosition: Dispatch<SetStateAction<null | { lat: number; lng: number }>>;
  setAddress: Dispatch<SetStateAction<Address>>;
  step: number;
}

const CustomerAddressContext = createContext<CustomerAddressContextValue>({} as CustomerAddressContextValue);
export const CustomerAddressProvider = CustomerAddressContext.Provider;
export const CustomerAddressConsumer = CustomerAddressContext.Consumer;

export function useCustomerAddress(): CustomerAddressContextValue {
  const context = useContext(CustomerAddressContext);
  return context;
}
