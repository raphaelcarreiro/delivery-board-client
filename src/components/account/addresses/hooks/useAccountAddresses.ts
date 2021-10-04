import { MouseEvent, createContext, useContext } from 'react';
import { Address } from 'src/types/address';

interface AccountAddressesContextValue {
  handleDialogEditAddress(addressId: number): void;
  handleMoreClick(event: MouseEvent, address: Address): void;
  handleDialogNewAddress(): void;
  selectedAddress: Address | null;
}

const AccountAddressesContext = createContext<AccountAddressesContextValue>({} as AccountAddressesContextValue);
export const AccountAddressesProvider = AccountAddressesContext.Provider;
export const AccountAddressesConsumer = AccountAddressesContext.Consumer;

export function useAccountAddresses(): AccountAddressesContextValue {
  const context = useContext(AccountAddressesContext);
  return context;
}
