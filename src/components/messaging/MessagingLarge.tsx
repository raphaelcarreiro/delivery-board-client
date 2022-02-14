import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMessaging } from 'src/providers/MessageProvider';
import { Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';

const useStyles = makeStyles({
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
  content: {
    minHeight: 200,
    minWidth: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& p': {
      fontSize: 20,
    },
  },
});

interface LargeMessagingProps {
  message: string;
  action?: () => void;
  handleAction?(): void;
  open: boolean;
}

const LargeMessaging: React.FC<LargeMessagingProps> = ({ message, action, handleAction, open }) => {
  const classes = useStyles();
  const messaging = useMessaging();

  return (
    <Dialog open={open} onClose={messaging.handleClose} maxWidth="sm">
      <DialogContent>
        <div className={classes.content}>
          <Typography>{message}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        {action ? (
          <Button color="primary" size="small" onClick={handleAction}>
            Desfazer
          </Button>
        ) : (
          <Button variant="text" color="primary" size="small" onClick={messaging.handleClose}>
            Fechar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LargeMessaging;
