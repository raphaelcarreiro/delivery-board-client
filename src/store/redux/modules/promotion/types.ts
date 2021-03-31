import { Promotion } from 'src/types/promotion';

const SET_PROMOTIONS = '@promotions/SET_PROMOTIONS';

interface SetPromotionsAction {
  type: typeof SET_PROMOTIONS;
  promotions: Promotion[];
}

export type PromotionActions = SetPromotionsAction;
