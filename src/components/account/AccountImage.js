import React, { useContext, useState } from 'react';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import { CircularProgress, Zoom, Typography, Button } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { MessagingContext } from '../messaging/Messaging';
import { api } from '../../services/api';

const useStyles = makeStyles(theme => ({
  image: {
    width: 195,
    height: 195,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  imageContainer: {
    display: 'flex',
    width: 200,
    height: 200,
    border: `2px dashed ${fade(theme.palette.primary.main, 0.2)}`,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    marginTop: 15,
  },
  imageWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    display: 'flex',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: fade(theme.palette.primary.main, 0.2),
  },
  label: {
    display: 'flex',
    cursor: 'pointer',
    minWidth: 110,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
}));

function AccountImage({ user, handleUserChange, handleImageSelect, handleImageDelete }) {
  const messaging = useContext(MessagingContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  function handleChange(image) {
    const form = new FormData();
    form.append('image', image);

    setLoading(true);

    api()
      .post('/images', form)
      .then(response => {
        handleUserChange('image', response.data);
      })
      .catch(() => {
        messaging.handleOpen('Não foi possível carregar a imagem');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleImageDeleteClick(event) {
    event.stopPropagation();
    handleImageDelete();
  }

  return (
    <>
      {loading ? (
        <div className={classes.imageContainer}>
          <CircularProgress color="primary" />
        </div>
      ) : !user.image ? (
        <>
          <input
            type="file"
            name="photo"
            onChange={event => handleChange(event.target.files[0])}
            accept="image/*"
            id="photo-file"
            style={{ display: 'none' }}
          />
          <label htmlFor="photo-file">
            <div className={classes.imageContainer}>
              <AddPhotoIcon color="primary" />
            </div>
          </label>
        </>
      ) : (
        <>
          <div className={classes.imageContainer} onClick={handleImageSelect}>
            <Zoom in={user.image.selected}>
              <div className={classes.imageWrapper}>
                <Button variant="contained" color="primary" onClick={event => handleImageDeleteClick(event)}>
                  Trocar foto
                </Button>
              </div>
            </Zoom>
            <img alt="Foto do produto" className={classes.image} src={user.image.imageUrl} />
          </div>
          <Typography variant="body2" color="textSecondary">
            Foto do perfil
          </Typography>
        </>
      )}
    </>
  );
}

AccountImage.propTypes = {
  user: PropTypes.object.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  handleImageSelect: PropTypes.func.isRequired,
  handleImageDelete: PropTypes.func.isRequired,
};

export default AccountImage;
