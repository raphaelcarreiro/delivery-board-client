import React, { useState, useContext } from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { AppContext } from '../../App';

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
  actionText: {
    color: theme.palette.primary.light,
  },
}));

export const MessagingContext = React.createContext({
  handleOpen: () => {},
  handleClose: () => {},
});

function Messaging({ children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null);
  const [options, setOptions] = useState(null);
  const appContext = useContext(AppContext);

  function handleClose(event, reason) {
    if (reason === 'clickaway') return false;

    setOpen(false);
  }

  function handleOpen(_message, _action, _options = null) {
    setOptions(_options);

    if (open) {
      setOpen(false);
      setTimeout(() => {
        setAction(_action ? { do: _action } : null);
        setOpen(true);
        setMessage(_message);
      }, 350);
    } else {
      setAction(_action ? { do: _action } : null);
      setOpen(true);
      setMessage(_message);
    }
  }

  function handleAction() {
    if (typeof action.do === 'function') {
      action.do();
      handleClose();
    }
  }

  return (
    <MessagingContext.Provider
      value={{
        handleClose,
        handleOpen,
      }}
    >
      <Snackbar
        style={options && options}
        classes={{
          anchorOriginBottomCenter: !appContext.isMobile ? classes.snackbar : null,
        }}
        open={open}
        onClose={handleClose}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: appContext.isMobile ? 'left' : 'center',
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
              <Button
                classes={{ root: classes.actionText }}
                key="undo"
                color="inherit"
                size="small"
                onClick={handleAction}
              >
                Desfazer
              </Button>
            ) : (
              <Button
                key="close"
                size="small"
                color="inherit"
                classes={{ root: classes.actionText }}
                onClick={handleClose}
              >
                Fechar
              </Button>
            )
          }
        />
      </Snackbar>
      {children}
    </MessagingContext.Provider>
  );
}

Messaging.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

export default Messaging;
