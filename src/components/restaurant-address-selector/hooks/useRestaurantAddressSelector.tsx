import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface RestaurantAddressContextValue {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const RestaurantAddressContext = createContext<RestaurantAddressContextValue>({} as RestaurantAddressContextValue);

export const RestaurantAddressProvider = RestaurantAddressContext.Provider;
export const RestaurantAddressConsumer = RestaurantAddressContext.Consumer;

export function useRestaurantAddressSelector(): RestaurantAddressContextValue {
  const context = useContext(RestaurantAddressContext);
  return context;
}
