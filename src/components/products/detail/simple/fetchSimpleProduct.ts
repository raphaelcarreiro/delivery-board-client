import { moneyFormat } from 'src/helpers/numberFormat';
import { api } from 'src/services/api';
import { Product } from 'src/types/product';

export async function fetchSimpleProduct(productId: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${productId}`);
  const product = response.data;

  const additional = product.additional.map(additional => {
    additional.selected = false;
    additional.additional_id = additional.id;
    additional.formattedPrice = moneyFormat(additional.price);
    additional.amount = 0;
    return additional;
  });

  const ingredients = product.ingredients.map(ingredient => {
    ingredient.ingredient_id = ingredient.id;
    ingredient.selected = true;
    return ingredient;
  });

  return {
    ...product,
    formattedPrice: moneyFormat(product.price),
    formattedSpecialPrice: moneyFormat(product.special_price),
    additional,
    ingredients,
    ready: true,
  };
}
