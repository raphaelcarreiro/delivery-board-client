import { Product } from 'src/types/product';

export function handleSelectProductComplement(
  complementCategoryId: number,
  complementId: number,
  product: Product
): { newProduct: Product } {
  const categories = product.complement_categories.map(category => {
    if (category.id === complementCategoryId) {
      const selectedAmount = category.complements.filter(complement => complement.selected).length;

      category.complements = category.complements.map(complement => {
        if (category.max_quantity === 1) {
          complement.selected = complement.id === complementId && !complement.selected;
        } else {
          if (complement.id === complementId) {
            if (complement.selected) complement.selected = !complement.selected;
            else if (category.max_quantity > selectedAmount) complement.selected = !complement.selected;
          }
        }

        return complement;
      });
    }
    return category;
  });

  const ready = product.complement_categories.every(category => {
    if (category.is_required) {
      const selectedAmount = category.complements.filter(complement => complement.selected).length;
      return category.min_quantity <= selectedAmount;
    }
    return true;
  });

  return {
    newProduct: {
      ...product,
      ready,
      complement_categories: categories,
    },
  };
}
