import React, { useState } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  paperScrollPaper: {
    maxHeight: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 100,
  },
  actions: {
    padding: 20,
  },
});

function DialogDelete({ handleDelete, title, onExited, message, buttonText }) {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  function handleAction() {
    handleDelete();
    handleClose();
  }

  return (
    <Dialog
      classes={{ paperScrollPaper: classes.paperScrollPaper }}
      open={open}
      onClose={handleClose}
      onExited={onExited}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Grid container spacing={1} justify="space-evenly">
          <Grid item>
            <Button variant="text" color="primary" onClick={handleClose}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleAction} variant="contained" color="primary">
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

DialogDelete.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onExited: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default DialogDelete;
