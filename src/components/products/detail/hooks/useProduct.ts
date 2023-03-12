import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Product } from 'src/types/product';

export type ProductValue = {
  product: Product | null;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  handleClickAdditional(additionalId: number, amount: number): void;
  handleClickIngredient(ingredientId: number): void;
};

const ProductContext = createContext<ProductValue>({} as ProductValue);
export const ProductSimpleProvider = ProductContext.Provider;

export function useProduct(): ProductValue {
  const context = useContext(ProductContext);
  return context;
}
