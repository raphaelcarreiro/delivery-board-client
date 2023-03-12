import React, { useState } from 'react';
import { Dialog, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  container: ({ src }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${src}) no-repeat`,
    filter: 'blur(20px)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }),
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    // backdropFilter: 'blur(8px) opacity(0.2)',
  },
  buttonClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  description: {
    color: '#fff',
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    maxWidth: '80%',
  },
  closeIcon: {
    color: '#fff',
  },
  image: {
    borderRadius: 4,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '96%',
    },
  },
  imageWrapper: {
    maxWidth: '100vh',
    textAlign: 'center',
  },
}));

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onExited: PropTypes.func.isRequired,
};

function ImagePreview({ src, description, onExited }) {
  const classes = useStyles({ src });
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose} onExited={onExited}>
      <div className={classes.container} />
      <div className={classes.description}>
        <Typography variant="h6">{description}</Typography>
      </div>
      <IconButton onClick={handleClose} className={classes.buttonClose}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      <div className={classes.imageContainer}>
        <div className={classes.imageWrapper}>
          <img className={classes.image} src={src} alt={description} />
        </div>
      </div>
    </Dialog>
  );
}

export default ImagePreview;
