import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Complement, Product } from 'src/types/product';

export type ProductPizzaValue = {
  product: Product | null;
  filteredProduct: Product | null;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  handleSearch(categoryId: number, searchValue: string): void;
  handleClickPizzaComplements(productId: number, complementCategoryId: number, complementId: number): void;
  openDialogAdditional(): void;
  openDialogIngredients(): void;
  complementSizeSelected: Complement | null;
  setComplementCategoryIdSelected: Dispatch<SetStateAction<number | null>>;
  setComplementIdSelected: Dispatch<SetStateAction<number | null>>;
  complementCategoryIdSelected: number | null;
  complementIdSelected: number | null;
};

const ProductPizzaContext = createContext<ProductPizzaValue>({} as ProductPizzaValue);
export const ProductPizzaProvider = ProductPizzaContext.Provider;

export function useProductPizza(): ProductPizzaValue {
  const context = useContext(ProductPizzaContext);
  return context;
}
