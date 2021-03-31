import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import CustomDialog, { DialogConsumer } from 'src/components/dialog/CustomDialog';
import ImagePreview from 'src/components/image-preview/ImagePreview';
import { useActivePromotions } from './hooks/useActivePromotions';

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  grid: {
    display: 'grid',
    flex: 1,
    columnGap: 20,
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      flex: 0,
    },
  },
  buttonClose: {
    alignSelf: 'flex-end',
  },
  imageContainer: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
    },
  },
  image: {
    cursor: 'pointer',
    maxWidth: 590,
    maxHeight: 590,
    width: '100%',
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  title: {
    marginBottom: 15,
  },
  description: {
    fontWeight: 300,
  },
}));

const PromotionDetail: React.FC = () => {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState(false);
  const { selectedPromotion: promotion, setSelectedPromotion } = useActivePromotions();

  return (
    <CustomDialog maxWidth="md" height="60vh" handleModalState={() => setSelectedPromotion(null)}>
      {imagePreview && promotion && promotion.image && (
        <ImagePreview
          onExited={() => setImagePreview(false)}
          src={promotion.image.imageUrl}
          description={promotion.name}
        />
      )}
      {promotion && (
        <DialogConsumer>
          {context => (
            <div className={classes.container}>
              <div className={classes.grid}>
                <div className={classes.imageContainer}>
                  <img
                    onClick={() => setImagePreview(true)}
                    className={classes.image}
                    src={promotion.image?.imageUrl}
                    alt={promotion.name}
                  />
                </div>
                <div>
                  <Typography color="primary">promoção</Typography>
                  <Typography className={classes.title} variant="h3">
                    {promotion.name}
                  </Typography>
                  <Typography gutterBottom className={classes.description} variant="h6">
                    {promotion.description}
                  </Typography>
                  {promotion.valid_at && (
                    <Typography color="textSecondary">Promoção válida até {promotion.formattedValidAt}</Typography>
                  )}
                </div>
              </div>
              <Button
                className={classes.buttonClose}
                onClick={context.handleCloseDialog}
                color="primary"
                variant="text"
              >
                fechar
              </Button>
            </div>
          )}
        </DialogConsumer>
      )}
    </CustomDialog>
  );
};

export default PromotionDetail;
