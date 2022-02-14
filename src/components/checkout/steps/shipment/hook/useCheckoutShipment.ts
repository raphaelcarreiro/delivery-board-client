import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Address } from 'src/types/address';

export interface ShipmentContextValue {
  selectedAddress: Address | null;
  handleAddressSubmit(address: Address): void;
  handleAddressUpdateSubmit(address: Address): void;
  handleSelectAddress(address: Address): void;
  setSelectedAddress: Dispatch<SetStateAction<Address | null>>;
  setDialogNewAddress: Dispatch<SetStateAction<boolean>>;
  setDialogEditAddress: Dispatch<SetStateAction<boolean>>;
  setDialogDeleteAddress: Dispatch<SetStateAction<boolean>>;
}

const ShipmentContext = createContext<ShipmentContextValue>({} as ShipmentContextValue);
export const ShipmentProvider = ShipmentContext.Provider;
export const ShipmentConsumer = ShipmentContext.Consumer;

export function useShipment(): ShipmentContextValue {
  const context = useContext(ShipmentContext);
  return context;
}
