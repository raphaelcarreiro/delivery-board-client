import { moneyFormat } from 'src/helpers/numberFormat';
import { RestaurantConfig } from 'src/types/restaurant';
import { Complement, ComplementCategory, OrderProductAdditional } from 'src/types/product';
import { v4 } from 'uuid';
import { Cart, CartProduct, CartRestaurantConfigs } from 'src/types/cart';
import { Promotion } from 'src/types/promotion';

type Prices = {
  complement: number;
  complementAdditional: number;
  tastes: number[];
};

export function addProduct(cart: Cart, product: CartProduct, amount: number, promotion?: Promotion): CartProduct {
  const price = getProductPrice(product);

  const additionalPrice = getAdditionalPrice(product.additional as OrderProductAdditional[]);

  const complementsPrice = product.category.is_pizza
    ? getPizzaComplementsPrice(product.complement_categories, cart.configs)
    : getComplementPrice(product.complement_categories);

  const finalPrice = promotion ? 0 : (price + additionalPrice + complementsPrice) * amount;

  return {
    ...product,
    uid: v4(),
    ready: true,
    additional: product.additional as OrderProductAdditional[],
    amount,
    product_price: price,
    price: price + additionalPrice + complementsPrice,
    final_price: finalPrice,
    complementsPrice,
    additionalPrice,
    formattedProductPrice: moneyFormat(price),
    formattedPrice: moneyFormat(price + complementsPrice),
    formattedFinalPrice: moneyFormat(finalPrice),
    product_id: product.id,
    annotation: product.annotation ?? null,
    promotion: promotion ? { id: promotion.id, name: promotion.name } : null,
  };
}

function getAdditionalPrice(additional: OrderProductAdditional[]) {
  return additional
    .filter(item => item.selected)
    .reduce((sum, additional) => {
      return sum + additional.price * additional.amount;
    }, 0);
}

function getProductPrice(product: CartProduct) {
  if (product.promotion_activated && product.special_price) {
    return product.special_price;
  }

  return product.product_price ?? product.price;
}

function getComplementPrice(complementCategories: ComplementCategory[]): number {
  let price = 0;

  complementCategories.forEach(category => {
    price += category.complements
      .filter(item => item.selected && item.price)
      .reduce((sum, complement) => sum + (complement.price as number), 0);
  });

  return price;
}

export function getPizzaComplementsPrice(
  complementCategories: ComplementCategory[],
  settings?: CartRestaurantConfigs | null
): number {
  const prices: Prices = {
    complement: 0,
    complementAdditional: 0,
    tastes: [],
  };

  complementCategories.forEach(category => {
    category.complements
      .filter(item => item.selected)
      .forEach(complement => {
        complement.prices
          .filter(item => item.selected && item.price)
          .forEach(item => {
            if (category.is_pizza_taste) {
              prices.tastes.push(item.price as number);
              return;
            }

            prices.complement += item.price as number;
          });

        prices.complementAdditional += getComplementAdditionalPrice(complement);
      });
  });

  let tastePrice = 0;

  if (settings?.pizza_calculate === 'average_value') {
    tastePrice = prices.tastes.reduce((sum, item) => sum + item, 0) / prices.tastes.length;
  }

  if (settings?.pizza_calculate === 'higher_value') {
    tastePrice = Math.max(...prices.tastes);
  }

  return prices.complement + tastePrice + prices.complementAdditional;
}

function getComplementAdditionalPrice(complement: Complement): number {
  let value = 0;

  complement.additional
    .filter(item => item.selected)
    .forEach(additional => {
      additional.prices
        .filter(item => item.selected && item.price)
        .forEach(price => (value = (price.price as number) + value));
    });

  return value;
}

export function getComplementsPrice(product: CartProduct, settings: CartRestaurantConfigs | null): number {
  return product.category.is_pizza
    ? getPizzaComplementsPrice(product.complement_categories, settings)
    : getComplementPrice(product.complement_categories);
}
