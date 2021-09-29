import { createContext, useContext } from 'react';
import { Address } from 'src/types/address';

interface CustomerAddressContextValue {
  handleGetPlaceLatitudeLongitude(place: google.maps.places.AutocompletePrediction): void;
  setBrowserLocation(): void;
  handleChange(index: keyof Address, value: any): void;
  handleSetAddressGeoCodeResult(address: google.maps.GeocoderResult | null): void;
  handleNext(): void;
  handleBack(): void;
  handleValidation(): void;
}

const CustomerAddressContext = createContext<CustomerAddressContextValue>({} as CustomerAddressContextValue);
export const CustomerAddressProvider = CustomerAddressContext.Provider;
export const CustomerAddressConsumer = CustomerAddressContext.Consumer;

export function useCustomerAddress(): CustomerAddressContextValue {
  const context = useContext(CustomerAddressContext);
  return context;
}
