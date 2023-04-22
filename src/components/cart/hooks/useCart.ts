import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Product } from 'src/types/product';

export type CartContextValue = {
  handleUpdateCartProduct(product: Product, amount: number): void;
  setSelectedProduct(product: Product | null): void;
  selectedProduct: Product | null;
  setShowCustomerDialog: Dispatch<SetStateAction<boolean>>;
  saving: boolean;
  handleSubmit(customerName?: string): void;
};

const CartContextValue = createContext<CartContextValue>({} as CartContextValue);
export const CartProvider = CartContextValue.Provider;

export function useCart(): CartContextValue {
  const context = useContext(CartContextValue);
  return context;
}
