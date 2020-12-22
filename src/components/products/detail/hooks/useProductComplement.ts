import { createContext, useContext } from 'react';
import { Product } from 'src/types/product';

export type ProductComplementValue = {
  product: Product;
  setProduct(product: Product): void;
  handleClickComplements(complementCategoryId: number, complementId: number, amount: number): void;
};

const ProductComplementContext = createContext<ProductComplementValue>({} as ProductComplementValue);
export const ProductComplementProvider = ProductComplementContext.Provider;

export function useProductComplement(): ProductComplementValue {
  const context = useContext(ProductComplementContext);
  return context;
}
