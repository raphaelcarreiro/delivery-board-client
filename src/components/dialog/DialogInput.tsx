import React, { ReactNode, useContext, useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface UseStylesProps {
  backgroundColor: string;
}

const useStyles = makeStyles<Theme, UseStylesProps>(theme => ({
  modal: {
    overflowY: 'auto',
    padding: '0 30px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '0 30px 40px !important',
    },
  },
  root: {
    paddingRight: '0!important',
    position: 'relative',
  },
  paper: props => ({
    backgroundColor: props.backgroundColor,
    minHeight: '30vh',
  }),
  content: {
    padding: 20,
    display: 'flex',
  },
}));

interface DialogInputProps {
  onExited(): void;
  backgroundColor?: string;
  hideBackdrop?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableEscapeKeyDown?: boolean;
  children: ReactNode;
  title?: string;
  disableBackdropClick?: boolean;
}

interface DialogInputContextValue {
  handleCloseDialog: () => void;
}

export const DialogInputContext = React.createContext<DialogInputContextValue>({} as DialogInputContextValue);

const DialogInput: React.FC<DialogInputProps> = ({
  onExited,
  children,
  backgroundColor = '#fff',
  maxWidth = 'md',
  hideBackdrop,
  disableEscapeKeyDown,
  disableBackdropClick = false,
}) => {
  const [open, setOpen] = useState(true);
  const styleProps = { backgroundColor };
  const classes = useStyles(styleProps);

  function handleClose(reason?: 'backdropClick' | 'escapeKeyDown') {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }

    setOpen(false);
  }

  return (
    <Dialog
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      open={open}
      onClose={(event, reason) => handleClose(reason)}
      fullWidth
      maxWidth={maxWidth}
      hideBackdrop={hideBackdrop}
      disableEscapeKeyDown={disableEscapeKeyDown}
      TransitionProps={{
        onExited,
      }}
    >
      <DialogContent className={classes.content}>
        <DialogInputContext.Provider value={{ handleCloseDialog: handleClose }}>{children}</DialogInputContext.Provider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogInput;

export function useInputDialog(): DialogInputContextValue {
  return useContext(DialogInputContext);
}

export const DialogInputConsumer = DialogInputContext.Consumer;
