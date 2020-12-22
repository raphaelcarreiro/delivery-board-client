import { createContext, useContext } from 'react';
import { Complement, Product } from 'src/types/product';

export type ProductPizzaValue = {
  product: Product;
  filteredProduct: Product;
  setProduct(product: Product): void;
  handleSearch(categoryId: number, searchValue: string): void;
  handleClickPizzaComplements(productId: number, complementCategoryId: number, complementId: number): void;
  openDialogAdditional(): void;
  openDialogIngredients(): void;
  complementSizeSelected: Complement;
  setComplementCategoryIdSelected(complementCategoryId: number): void;
  setComplementIdSelected(complementId: number): void;
  complementCategoryIdSelected: number;
  complementIdSelected: number;
};

const ProductPizzaContext = createContext<ProductPizzaValue>({} as ProductPizzaValue);
export const ProductPizzaProvider = ProductPizzaContext.Provider;

export function useProductPizza(): ProductPizzaValue {
  const context = useContext(ProductPizzaContext);
  return context;
}
