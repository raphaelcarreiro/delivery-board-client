import { createContext, useContext } from 'react';
import { Product } from 'src/types/product';

export type ProductsContextValue = {
  handleSelectProduct(product: Product | null): void;
  selectedProduct: Product | null;
  handleAddProductToCart(): void;
  handlePrepareProduct(product: Product, amount?: number): void;
  isComplement: boolean;
  isPizza: boolean;
  isSimple: boolean;
  redirectToMenuAfterAddToCart: boolean;
};

export const ProductsContext = createContext<ProductsContextValue>({} as ProductsContextValue);
export const ProductsProvider = ProductsContext.Provider;

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);
  return context;
}
