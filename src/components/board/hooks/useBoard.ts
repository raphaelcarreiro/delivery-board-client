import { createContext, Dispatch, useContext, SetStateAction } from 'react';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';

export interface BoardContextValue {
  selectedProduct: BoardOrderProduct | null;
  setSelectedProduct: Dispatch<SetStateAction<BoardOrderProduct | null>>;
}

const BoardContext = createContext<BoardContextValue>({} as BoardContextValue);
export const BoardConsumer = BoardContext.Consumer;
export const BoardProvider = BoardContext.Provider;

export function useBoard(): BoardContextValue {
  return useContext(BoardContext);
}
