import React, { useContext, useState } from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  modal: {
    overflowY: 'auto',
    padding: '0 30px 40px',
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
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
  content: ({ title, displayBottomActions }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: title ? 64 : 15,
    marginBottom: displayBottomActions ? 72 : 0,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: title ? 56 : 15,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      marginTop: title ? 48 : 15,
    },
  }),
}));

export const CustomDialogContext = React.createContext({
  handleCloseDialog: () => {},
});

export default function CustomDialog({
  handleModalState,
  title,
  componentActions,
  children,
  backgroundColor,
  hideBackdrop,
  displayBottomActions,
  maxWidth,
  height,
  onScroll,
}) {
  const [open, setOpen] = useState(true);
  const app = useApp();
  const styleProps = { backgroundColor, title: !!title, displayBottomActions, height };
  const classes = useStyles(styleProps);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog
      classes={
        ({ root: classes.root },
        {
          paper: classes.paper,
        })
      }
      hideBackdrop={hideBackdrop}
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={app.isMobile || app.windowWidth < 960}
      maxWidth={maxWidth}
      onExited={() => handleModalState()}
    >
      {title && (
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton color="inherit" onClick={handleClose}>
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
      <div className={classes.content} onScroll={onScroll}>
        <CustomDialogContext.Provider value={{ handleCloseDialog: handleClose }}>
          {children}
        </CustomDialogContext.Provider>
      </div>
    </Dialog>
  );
}

CustomDialog.defaultProps = {
  hideBackdrop: false,
  displayBottomActions: false,
  maxWidth: 'md',
  height: '100vh',
};

CustomDialog.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  backgroundColor: PropTypes.string,
  hideBackdrop: PropTypes.bool,
  displayBottomActions: PropTypes.bool,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
  onScroll: PropTypes.func,
};

export const DialogConsumer = CustomDialogContext.Consumer;

export function useCustomDialog() {
  const context = useContext(CustomDialogContext);
  return context;
}
