import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

export type AppContextValue = {
  isMobile: boolean;
  windowWidth: number;
  windowHeight: number;
  isOpenMenu: boolean;
  isCartVisible: boolean;
  redirect: string | null;
  socket: Socket | null;
  readyToInstall: boolean;
  shownPlayStoreBanner: boolean;
  setRedirect(uri: string | null): void;
  handleOpenMenu(): void;
  handleCartVisibility(state: boolean): void;
  handleInstallApp(): void;
  handleShowPlayStoreBanner(): void;
  isBoardMovementLoading: boolean;
  isSocketBoardConnected: boolean;
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);
export const AppProvider = AppContext.Provider;

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  return context;
}
