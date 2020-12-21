import { Product } from 'src/types/product';
import { Restaurant } from 'src/types/restaurant';

export function calculatePizzaProductComplementPrice(product: Product, restaurant: Restaurant): number {
  // Calcula o valor total dos complements selecionados
  let sumPrices = 0;
  let counterTaste = 0;
  let tastePrice = 0;
  let additionalPrice = 0;
  const tastePrices: number[] = [];

  product.complement_categories.forEach(category => {
    category.complements.forEach(complement => {
      if (complement.selected) {
        counterTaste = category.is_pizza_taste && complement.selected ? counterTaste + 1 : counterTaste;
        complement.prices.forEach(price => {
          if (category.is_pizza_taste) {
            tastePrice = price.selected && price.price ? tastePrice + price.price : tastePrice;
            if (price.selected) tastePrices.push(price.price);
          } else sumPrices = price.selected && price.price ? sumPrices + price.price : sumPrices;
        });
        complement.additional.forEach(additional => {
          if (additional.selected)
            additional.prices.forEach(price => {
              additionalPrice = price.selected && price.price ? additionalPrice + price.price : additionalPrice;
            });
        });
      }
    });
  });

  if (counterTaste > 0) {
    if (restaurant.configs.pizza_calculate === 'average_value') sumPrices = sumPrices + tastePrice / counterTaste;
    else if (restaurant.configs.pizza_calculate === 'higher_value') sumPrices = sumPrices + Math.max(...tastePrices);
  }

  return sumPrices + additionalPrice;
}
