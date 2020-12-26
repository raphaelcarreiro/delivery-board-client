import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMessaging, Options, CallbackFunction } from 'src/hooks/messaging';
import { Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  message: {
    marginLeft: 10,
    paddingTop: 3,
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    width: 500,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
  options: Options | null;
  action: CallbackFunction | null;
  handleAction(): void;
  open: boolean;
}

const MessagingLarge: React.FC<Messaging> = ({ message, options = null, action, handleAction, open }) => {
  const classes = useStyles();
  const messaging = useMessaging();

  return (
    <Dialog open={open} onClose={messaging.handleClose} maxWidth="lg">
      <DialogContent>
        <div className={classes.messageContent}>
          <Typography variant="h5">{message}</Typography>
        </div>
      </DialogContent>
      {action && (
        <DialogActions>
          <Button classes={{ root: classes.actionText }} size="small" onClick={handleAction}>
            Desfazer
          </Button>
          <Button size="small" classes={{ root: classes.actionText }} onClick={messaging.handleClose}>
            Fechar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MessagingLarge;
