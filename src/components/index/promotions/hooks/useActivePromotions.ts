import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Promotion } from 'src/types/promotion';

export interface ActivePromotionsValue {
  selectedPromotion: Promotion | null;
  setSelectedPromotion: Dispatch<SetStateAction<Promotion | null>>;
}

const ActivePromotionsContext = createContext<ActivePromotionsValue>({} as ActivePromotionsValue);
export const ActivePromotionsProvider = ActivePromotionsContext.Provider;
export const ActivePromotionsConsumer = ActivePromotionsContext.Consumer;

export function useActivePromotions(): ActivePromotionsValue {
  const context = useContext(ActivePromotionsContext);
  return context;
}
