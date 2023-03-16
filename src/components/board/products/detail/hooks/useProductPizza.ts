import { createContext, useContext } from 'react';
import { Complement, Product } from 'src/types/product';

export type ProductPizzaValue = {
  product: Product | null;
  complementSizeSelected: Complement | null;
};

const ProductPizzaContext = createContext<ProductPizzaValue>({} as ProductPizzaValue);
export const ProductPizzaProvider = ProductPizzaContext.Provider;

export function useProductPizza(): ProductPizzaValue {
  const context = useContext(ProductPizzaContext);
  return context;
}
