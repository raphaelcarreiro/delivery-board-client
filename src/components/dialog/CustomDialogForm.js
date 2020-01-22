import React, { useState, useContext } from 'react';
import { Dialog, DialogContent, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles/index';
import { CustomDialogContext } from './CustomDialog';
import { AppContext } from 'src/App';

const useStyles = makeStyles(theme => ({
  modal: {
    overflowY: 'auto',
    padding: '0 30px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '0 30px 40px !important',
    },
  },
  root: {
    paddingRight: '0!important',
  },
  appbar: {
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
    },
    '@media print': {
      display: 'none',
    },
  },
  appbarSpace: {
    marginBottom: 64,
    [theme.breakpoints.down('md')]: {
      marginBottom: 56,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      marginBottom: 51,
    },
  },
  grow: {
    flexGrow: 1,
  },
  paper: props => ({
    backgroundColor: props.backgroundColor ? props.backgroundColor : '#fff',
    height: '100vh',
  }),
  form: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    position: 'relative',
  },
}));

export const DialogFullscreenFormContext = React.createContext({
  handleCloseDialog: () => {},
});

export default function CustomDialogForm({
  handleSubmit,
  closeOnSubmit,
  async,
  handleModalState,
  title,
  componentActions,
  children,
  backgroundColor,
}) {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ backgroundColor });
  const app = useContext(AppContext);

  function handleClose() {
    setOpen(false);
  }

  async function _handleSubmit(event) {
    event.preventDefault();

    if (async) {
      try {
        await handleSubmit();
        if (closeOnSubmit) handleClose();
      } catch (err) {
        console.log(err);
      }
    } else {
      handleSubmit();
      if (closeOnSubmit) handleClose();
    }
  }

  return (
    <Dialog
      classes={
        ({ root: classes.root },
        {
          paper: classes.paper,
        })
      }
      open={open}
      onClose={handleClose}
      fullScreen={app.isMobile || app.windowWidth < 960}
      fullWidth
      maxWidth="md"
      onExited={() => handleModalState()}
    >
      <form onSubmit={_handleSubmit} className={classes.form}>
        {title && (
          <AppBar className={classes.appbar}>
            <Toolbar>
              <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                {title}
              </Typography>
              <div className={classes.grow} />
              <div>{componentActions}</div>
            </Toolbar>
          </AppBar>
        )}
        <div className={classes.appbarSpace} />
        <DialogContent className={classes.content}>
          <CustomDialogContext.Provider
            value={{
              handleCloseDialog: handleClose,
            }}
          >
            {children}
          </CustomDialogContext.Provider>
        </DialogContent>
      </form>
    </Dialog>
  );
}

CustomDialogForm.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  handleSubmit: PropTypes.func.isRequired,
  closeOnSubmit: PropTypes.bool,
  children: PropTypes.object,
  async: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
