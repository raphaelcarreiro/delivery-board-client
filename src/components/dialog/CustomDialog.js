import React, { useState, useContext } from 'react';
import { Dialog, Grid, DialogContent, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
// import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
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
    position: 'relative',
  },
  appbar: {
    position: 'absolute',
    [theme.breakpoints.down('md')]: {
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
}));

export const CustomDialogContext = React.createContext({
  handleCloseDialog: () => {},
});

export default function CustomDialog({ handleModalState, title, componentActions, children, backgroundColor }) {
  const [open, setOpen] = useState(true);
  const app = useContext(AppContext);
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
          paper: classes.paper,
        })
      }
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={app.isMobile || app.windowWidth < 960}
      maxWidth="md"
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
      <div className={classes.appbarSpace} />
      <DialogContent>
        <Grid item xs={12}>
          <CustomDialogContext.Provider value={{ handleCloseDialog: handleClose }}>
            {children}
          </CustomDialogContext.Provider>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  backgroundColor: PropTypes.string,
};

export const DialogConsumer = CustomDialogContext.Consumer;
