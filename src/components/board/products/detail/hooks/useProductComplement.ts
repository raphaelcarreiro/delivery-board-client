import { createContext, useContext } from 'react';
import { Product } from 'src/types/product';

export type ProductComplementValue = {
  product: Product | null;
};

const ProductComplementContext = createContext<ProductComplementValue>({} as ProductComplementValue);
export const ProductComplementProvider = ProductComplementContext.Provider;

export function useProductComplement(): ProductComplementValue {
  const context = useContext(ProductComplementContext);
  return context;
}
