import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import PropTypes from 'prop-types';
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
    position: 'relative',
  },
  paper: props => ({
    backgroundColor: props.backgroundColor ? props.backgroundColor : '#fff',
    minHeight: '30vh',
  }),
  content: {
    padding: 20,
  },
}));

export const DialogInputContext = React.createContext({
  handleCloseDialog: () => {},
});

export default function DialogInput({ onExited, children, backgroundColor, maxWidth = 'md' }) {
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
          paper: classes.paper,
        })
      }
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      onExited={onExited}
    >
      <DialogContent className={classes.content}>
        <DialogInputContext.Provider value={{ handleCloseDialog: handleClose }}>{children}</DialogInputContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

DialogInput.propTypes = {
  onExited: PropTypes.func.isRequired,
  title: PropTypes.string,
  componentActions: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  backgroundColor: PropTypes.string,
  maxWidth: PropTypes.string,
};

export const DialogInputConsumer = DialogInputContext.Consumer;
