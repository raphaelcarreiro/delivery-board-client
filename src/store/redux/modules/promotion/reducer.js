import { moneyFormat } from 'src/helpers/numberFormat';

export const INITIAL_STATE = null;

export default function promotions(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@promotion/SET_PROMOTIONS': {
      const promotions = action.promotions.map(promotion => {
        promotion.offered_products = promotion.offered_products.map(product => {
          product.additional = product.additional.map(additional => {
            additional.formattedPrice = moneyFormat(additional.price);
            additional.selected = false;
            return additional;
          });
          product.ingredients = product.ingredients.map(ingredient => {
            ingredient.selected = true;
            return ingredient;
          });
          return product;
        });
        return promotion;
      });
      return promotions;
    }

    default: {
      return state;
    }
  }
}
