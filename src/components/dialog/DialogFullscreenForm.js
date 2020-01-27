import React, { Component } from 'react';
import { Dialog, Grid, DialogContent, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
// import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles/index';

const styles = theme => ({
  modal: {
    overflowY: 'auto',
    padding: '0 30px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '0 30px 40px !important',
    },
  },
  buttonClose: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 1100,
  },
  root: {
    paddingRight: '0!important',
  },
  appbarSpace: {
    height: 80,
    [theme.breakpoints.down('md')]: {
      height: 56,
    },
    [theme.breakpoints.between('xs', 'xs') + ' and (orientation: landscape)']: {
      height: 51,
    },
  },
  grow: {
    flexGrow: 1,
  },
});

export const DialogFullscreenFormContext = React.createContext({
  handleCloseDialog: () => {},
});

class DialogFullscreenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = async event => {
    const { handleSubmit, closeOnSubmit, async } = this.props;

    event.preventDefault();

    if (async) {
      try {
        await handleSubmit();
        if (closeOnSubmit) this.handleClose();
      } catch (err) {
        console.log(err);
      }
    } else {
      handleSubmit();
      if (closeOnSubmit) this.handleClose();
    }
  };

  render() {
    const { handleModalState, classes, title, componentActions, children } = this.props;

    return (
      <Dialog
        classes={{ root: classes.root }}
        open={this.state.open}
        onClose={this.handleClose}
        fullScreen
        fullWidth
        onExited={() => handleModalState()}
      >
        <form onSubmit={this.handleSubmit}>
          {title && (
            <AppBar>
              <Toolbar>
                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant={'h6'} color={'inherit'} noWrap>
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
              <DialogFullscreenFormContext.Provider
                value={{
                  handleCloseDialog: this.handleClose,
                }}
              >
                {children}
              </DialogFullscreenFormContext.Provider>
            </Grid>
          </DialogContent>
        </form>
      </Dialog>
    );
  }
}

DialogFullscreenForm.propTypes = {
  handleModalState: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  handleSubmit: PropTypes.func.isRequired,
  closeOnSubmit: PropTypes.bool,
  classes: PropTypes.object,
  children: PropTypes.object,
  async: PropTypes.bool,
};

export default withStyles(styles)(DialogFullscreenForm);
export const DialogFullscreenFormConsumer = DialogFullscreenFormContext.Consumer;
