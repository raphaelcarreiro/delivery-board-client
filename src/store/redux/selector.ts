import { createSelectorHook } from 'react-redux';
import reducers from './modules/reducers';

type RootState = ReturnType<typeof reducers>;

export const useSelector = createSelectorHook<RootState>();
