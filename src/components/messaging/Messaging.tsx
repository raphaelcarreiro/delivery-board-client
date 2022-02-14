import React, { CSSProperties } from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMessaging } from 'src/providers/MessageProvider';
import { useApp } from 'src/providers/AppProvider';

const useStyles = makeStyles(theme => ({
  message: {
    marginLeft: 10,
    paddingTop: 3,
  },
  messageContent: {
    display: 'flex',
  },
  snackbar: {
    bottom: 10,
  },
  warningText: {
    color: '#ffc107',
  },
  actionText: {
    color: theme.palette.primary.light,
  },
}));

interface Messaging {
  message: string;
  style?: CSSProperties;
  action?: () => void;
  handleAction(): void;
  open: boolean;
}

const Messaging: React.FC<Messaging> = ({ message, style, action, handleAction, open }) => {
  const classes = useStyles();
  const app = useApp();
  const messaging = useMessaging();

  return (
    <Snackbar
      style={style}
      classes={{
        anchorOriginBottomCenter: !app.isMobile ? classes.snackbar : undefined,
      }}
      open={open}
      onClose={messaging.handleClose}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: app.isMobile ? 'left' : 'center',
      }}
    >
      <SnackbarContent
        message={
          <div className={classes.messageContent}>
            <span className={classes.message}>{message}</span>
          </div>
        }
        action={
          action ? (
            <Button classes={{ root: classes.actionText }} size="small" onClick={handleAction}>
              Desfazer
            </Button>
          ) : (
            <Button size="small" classes={{ root: classes.actionText }} onClick={messaging.handleClose}>
              Fechar
            </Button>
          )
        }
      />
    </Snackbar>
  );
};

export default Messaging;
