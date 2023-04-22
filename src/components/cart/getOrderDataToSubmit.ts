import { BoardMovement } from 'src/types/boardMovement';
import { Cart, CartProduct } from 'src/types/cart';
import { Complement, ComplementCategory, Ingredient, OrderProductAdditional } from 'src/types/product';
import { Restaurant } from 'src/types/restaurant';
import packageJson from '../../../package.json';

export function getOrderDataToSubmit(cart: Cart, movement: BoardMovement, restaurant: Restaurant) {
  const products = getProducts(cart.products);

  return {
    customer: movement.customer,
    payment_method: null,
    shipment: {
      ...restaurant?.addresses.find(address => address.is_main),
      shipment_method: 'board',
    },
    products,
    board_movement_id: movement.id,
    total: cart.total,
    discount: cart.discount,
    change: 0,
    tax: cart.tax,
    origin: {
      version: packageJson.version,
      app_name: packageJson.name,
      platform: 'board-web-app',
    },
  };
}

function getProducts(products: CartProduct[]): CartProduct[] {
  return products.map(product => {
    const additional = getAdditional(product.additional);
    const ingredients = getIngredients(product.ingredients);

    product.additional = additional;
    product.ingredients = ingredients;

    product.complement_categories = getComplementCategories(product.complement_categories);

    return product;
  });
}

function getComplementCategories(categories: ComplementCategory[]): ComplementCategory[] {
  return categories.filter(category => {
    category.complements = getComplements(category.complements);
    return category.complements.length > 0;
  });
}

function getComplements(complements: Complement[]): Complement[] {
  return complements.filter(complement => complement.selected);
}

function getAdditional(additional: OrderProductAdditional[]): OrderProductAdditional[] {
  return additional.filter(item => item.selected);
}

function getIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.filter(item => !item.selected);
}
