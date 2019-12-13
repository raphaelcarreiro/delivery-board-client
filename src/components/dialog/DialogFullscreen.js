import React, { useState } from 'react';
import { Dialog, Grid, DialogContent, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { makeStyles } from '@material-ui/core/styles';

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
    '@media print': {
      display: 'none',
    },
  },
  appbarSpace: {
    marginBottom: 80,
    [theme.breakpoints.down('md')]: {
      marginBottom: 75,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      marginBottom: 70,
    },
  },
  grow: {
    flexGrow: 1,
  },
  background: props => ({
    backgroundColor: props.backgroundColor ? props.backgroundColor : '#fff',
  }),
}));

export const DialogFullscreenContext = React.createContext({
  handleCloseDialog: () => {},
});

function DialogFullscreen({ handleModalState, title, componentActions, children, backgroundColor }) {
  const [open, setOpen] = useState(true);
  const styleProps = { backgroundColor };
  const classes = useStyles(styleProps);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog
      classes={
        ({ root: classes.root },
        {
          paper: classes.background,
        })
      }
      open={open}
      onClose={handleClose}
      fullScreen
      fullWidth
      onExited={() => handleModalState()}
    >
      {title && (
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton color="inherit" onClick={handleClose}>
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant={'h6'} color="inherit" noWrap>
              {title}
            </Typography>
            <div className={classes.grow} />
            <div>{componentActions}</div>
          </Toolbar>
        </AppBar>
      )}
      <div className={classes.appbarSpace} />
      <DialogContent>
        <Grid item xs={12}>
          <DialogFullscreenContext.Provider value={{ handleCloseDialog: handleClose }}>
            {children}
          </DialogFullscreenContext.Provider>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

DialogFullscreen.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  backgroundColor: PropTypes.string,
};

// eslint-disable-next-line react/display-name
export const withDialoagFullscreen = Component => props => (
  <DialogFullscreenContext.Consumer>
    {context => <Component {...props} {...context} />}
  </DialogFullscreenContext.Consumer>
);

export default DialogFullscreen;
export const DialogFullscreenConsumer = DialogFullscreenContext.Consumer;
