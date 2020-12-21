import { Product } from 'src/types/product';

export function calculateProductComplementsPrice(product: Product): number {
  const price = product.complement_categories.reduce((value, category) => {
    const categoryPrice = category.complements.reduce((sum, complement) => {
      return complement.selected && complement.price ? sum + complement.price : sum;
    }, 0);
    return categoryPrice + value;
  }, 0);

  return price;
}
