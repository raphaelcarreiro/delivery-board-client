import { createContext, useContext } from 'react';
import { Product } from 'src/types/product';

export type ProductValue = {
  product: Product;
  handleClickAdditional(additionalId: number): void;
  handleClickIngredient(ingredientId: number): void;
  setProduct(product: Product): void;
};

const ProductContext = createContext<ProductValue>({} as ProductValue);
export const ProductSimpleProvider = ProductContext.Provider;

export function useProduct(): ProductValue {
  const context = useContext(ProductContext);
  return context;
}
