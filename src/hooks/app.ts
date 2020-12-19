import { createContext, useContext } from 'react';

export type AppContextValue = {
  isMobile: boolean;
  windowWidth: number;
  isOpenMenu: boolean;
  isCartVisible: boolean;
  redirect: string | null;
  socket: SocketIOClient.Socket | null;
  readyToInstall: boolean;
  shownPlayStoreBanner: boolean;
  setRedirect(uri: string | null): void;
  handleOpenMenu(): void;
  handleCartVisibility(state: boolean): void;
  handleInstallApp(): void;
  handleShowPlayStoreBanner(): void;
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);
export const AppProvider = AppContext.Provider;

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  return context;
}
