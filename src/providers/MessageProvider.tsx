import React, { useState, useContext, useCallback, CSSProperties } from 'react';
import Messaging from 'src/components/messaging/Messaging';
import MessagingLarge from 'src/components/messaging/MessagingLarge';
import { useApp } from './AppProvider';
interface MessagingContextData {
  handleClose(): void;
  handleOpen(message: string, messagingOptions?: MessagingOptions): void;
}

export const MessagingContext = React.createContext({} as MessagingContextData);

type MessagingContainerType = 'default' | 'large';

type CallbackFunction = () => void;

type MessagingOptions = {
  action?: () => void;
  style?: CSSProperties;
  variant?: MessagingContainerType;
};

const MessagingProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [style, setOptions] = useState<CSSProperties | undefined>(undefined);
  const [variant, setVariant] = useState<MessagingContainerType>('default');
  const [action, setAction] = useState<CallbackFunction | undefined>(undefined);
  const app = useApp();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(
    (_message: string, messagingOptions?: MessagingOptions) => {
      setOptions(messagingOptions?.style);
      setVariant(messagingOptions?.variant || app.isMobile ? 'default' : 'large');
      setAction(messagingOptions?.action);
      setOpen(false);

      setTimeout(() => {
        setMessage(_message);
        setOpen(true);
      }, 150);
    },
    [app.isMobile]
  );

  function handleAction() {
    if (action) {
      action();
      setOpen(false);
    }
  }

  return (
    <MessagingContext.Provider
      value={{
        handleClose,
        handleOpen,
      }}
    >
      {children}
      {variant === 'default' ? (
        <Messaging message={message} style={style} action={action} handleAction={handleAction} open={open} />
      ) : (
        <MessagingLarge message={message} action={action} handleAction={handleAction} open={open} />
      )}
    </MessagingContext.Provider>
  );
};

export function useMessaging(): MessagingContextData {
  const context = useContext(MessagingContext);

  if (!context) throw new Error('This hook must be in Messaging Context Component');

  return context;
}

export default MessagingProvider;
