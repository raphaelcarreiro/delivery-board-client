import { Promotion } from 'src/types/promotion';
import { PromotionActions } from './types';

export function setPromotions(promotions: Promotion[]): PromotionActions {
  return {
    type: '@promotions/SET_PROMOTIONS',
    promotions,
  };
}
