import React, { useState, useContext } from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles/index';
import { useApp } from 'src/hooks/app';

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
    position: 'relative',
  },
  appbar: {
    position: 'absolute',
    zIndex: '1102!important',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
    '@media print': {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
  paper: props => ({
    backgroundColor: props.backgroundColor ? props.backgroundColor : '#fff',
    [theme.breakpoints.up('md')]: {
      height: props.height,
    },
  }),
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  form: ({ title, displayBottomActions }) => ({
    overflowY: 'auto',
    marginTop: title ? 64 : 15,
    marginBottom: displayBottomActions ? 72 : 0,
    [theme.breakpoints.down('md')]: {
      marginTop: title ? 56 : 15,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      marginTop: title ? 48 : 15,
    },
  }),
}));

export const CustomDialogFormContext = React.createContext({
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
  displayBottomActions,
  maxWidth,
  height,
}) {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ backgroundColor, title: !!title, displayBottomActions, height });
  const app = useApp();

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
      maxWidth={maxWidth}
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
        <div className={classes.content}>
          <CustomDialogFormContext.Provider
            value={{
              handleCloseDialog: handleClose,
            }}
          >
            {children}
          </CustomDialogFormContext.Provider>
        </div>
      </form>
    </Dialog>
  );
}

CustomDialogForm.defaultProps = {
  displayBottomActions: false,
  maxWidth: 'md',
  height: '100vh',
};

CustomDialogForm.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  handleSubmit: PropTypes.func.isRequired,
  closeOnSubmit: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  async: PropTypes.bool,
  backgroundColor: PropTypes.string,
  displayBottomActions: PropTypes.bool,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
};
