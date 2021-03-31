import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moneyFormat } from 'src/helpers/numberFormat';
import { Promotion } from 'src/types/promotion';
import { PromotionActions } from './types';

export const INITIAL_STATE: Promotion[] | null = null;

export default function promotions(state = INITIAL_STATE, action: PromotionActions): Promotion[] | null {
  switch (action.type) {
    case '@promotions/SET_PROMOTIONS': {
      const promotions = action.promotions.map(promotion => {
        const date = promotion.valid_at ? parseISO(promotion.valid_at) : null;
        promotion.formattedValidAt = date ? format(date, 'PP', { locale: ptBR }) : undefined;
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
