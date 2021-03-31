import { moneyFormat } from 'src/helpers/numberFormat';
import { api } from 'src/services/api';
import { Product } from 'src/types/product';

export async function fetchProductComplement(productId: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${productId}`);
  const product = response.data;

  const categories = product.complement_categories.map(category => {
    category.product_complement_category_id = category.id;
    category.complements = category.complements.map(complement => {
      complement.product_complement_id = complement.id;
      complement.selected = !!complement.selected;
      complement.formattedPrice = complement.price && moneyFormat(complement.price);

      complement.prices = complement.prices.map((price, index) => {
        price.product_complement_price_id = price.id;
        price.formattedPrice = price.price && moneyFormat(price.price);
        price.selected = index === 0;
        return price;
      });

      complement.ingredients = complement.ingredients.map(ingredient => {
        ingredient.product_complement_ingredient_id = ingredient.id;
        return ingredient;
      });

      complement.additional = complement.additional.map(additional => {
        additional.product_complement_additional_id = additional.id;
        additional.prices = additional.prices.map((price, index) => {
          price.product_complement_additional_price_id = price.id;
          price.selected = index === 0;
          price.formattedPrice = price.price && moneyFormat(price.price);
          return price;
        });
        return additional;
      });
      return complement;
    });
    return category;
  });

  const ready = product.complement_categories.every(category => {
    if (category.is_required) {
      const selectedAmount = category.complements.reduce((sum, complement) => {
        return complement.selected ? sum + 1 : sum;
      }, 0);

      return category.min_quantity <= selectedAmount;
    }
    return true;
  });

  return {
    ...product,
    ready,
    formattedPrice: moneyFormat(product.price),
    formattedSpecialPrice: moneyFormat(product.special_price),
    complement_categories: categories,
  };
}
