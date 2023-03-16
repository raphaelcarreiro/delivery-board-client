import React, { MouseEvent, useState } from 'react';
import { List, ListItem, Typography, makeStyles, Theme, alpha } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Complement, ComplementCategory } from 'src/types/product';
import ImagePreview from 'src/components/image-preview/ImagePreview';

type UseStylesProps = {
  isPizzaTaste: boolean;
};

const useStyles = makeStyles<Theme, UseStylesProps>(theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  selected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eaeaea',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    position: 'relative',
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  list: {
    padding: 0,
  },
  icon: ({ isPizzaTaste }) => ({
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: isPizzaTaste ? 10 : 15,
    top: isPizzaTaste ? 10 : 'inherit',
  }),
  complementName: {
    fontWeight: 400,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    width: 60,
    height: 60,
    borderRadius: '50%',
    cursor: 'zoom-in',
    backgroundColor: '#eee',
    flexShrink: 0,
  },
  image: {
    width: '100%',
  },
  complementData: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: 500,
  },
  more: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  additional: {
    color: '#4CAF50',
    marginRight: 7,
  },
  ingredients: {
    color: '#c53328',
    marginRight: 7,
  },
}));

interface ProductPizzaComplementItemProps {
  complements: Complement[];
  category: ComplementCategory;
}

const ProductPizzaComplementItem: React.FC<ProductPizzaComplementItemProps> = ({ complements, category }) => {
  const classes = useStyles({ isPizzaTaste: category.is_pizza_taste });
  const [selectedComplement, setSelectedComplement] = useState<null | Complement>(null);
  const [imagePreview, setImagePreview] = useState(false);

  function handleImageClick(event: MouseEvent<HTMLImageElement>, complement: Complement) {
    event.stopPropagation();
    setSelectedComplement(complement);
    setImagePreview(true);
  }

  return (
    <>
      {imagePreview && selectedComplement?.image && (
        <ImagePreview
          src={selectedComplement.image.imageUrl}
          onExited={() => setImagePreview(false)}
          description={selectedComplement.name}
        />
      )}

      <List className={classes.list}>
        {complements.map(complement => (
          <ListItem className={complement.selected ? classes.selected : classes.listItem} button key={complement.id}>
            <div className={classes.complementData}>
              {complement.image && (
                <div className={classes.imageContainer}>
                  <img
                    className={classes.image}
                    src={complement.image.imageThumbUrl ? complement.image.imageThumbUrl : complement.image.imageUrl}
                    alt={complement.name}
                    onClick={event => handleImageClick(event, complement)}
                  />
                </div>
              )}
              <div>
                <Typography variant="body1" className={classes.complementName}>
                  {complement.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {complement.description}
                </Typography>

                {complement.ingredients && complement.ingredients.some(i => !i.selected) && (
                  <div>
                    {complement.ingredients.map(
                      ingredient =>
                        !ingredient.selected && (
                          <Typography key={ingredient.id} variant="caption" className={classes.ingredients}>
                            - {ingredient.name}
                          </Typography>
                        )
                    )}
                  </div>
                )}

                {complement.additional && complement.additional.some(a => a.selected) && (
                  <div>
                    {complement.additional.map(
                      additional =>
                        additional.selected && (
                          <Typography key={additional.id} variant="caption" className={classes.additional}>
                            + {additional.name} {additional.prices.find(price => price.selected)?.formattedPrice}
                          </Typography>
                        )
                    )}
                  </div>
                )}

                {complement.prices.map(
                  price =>
                    price.selected &&
                    price.price && (
                      <Typography className={classes.price} key={price.id} color="primary">
                        {!category.is_pizza_taste && <span>+</span>} {price.formattedPrice}
                      </Typography>
                    )
                )}
              </div>
            </div>

            {complement.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ProductPizzaComplementItem;
