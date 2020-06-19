import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import reducers from './modules/reducers';

type RootState = ReturnType<typeof reducers>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
