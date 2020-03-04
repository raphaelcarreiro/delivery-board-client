import React, { useState } from 'react';
import { List, ListItem, Typography, Menu, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import ImagePreview from 'src/components/image-preview/ImagePreview';

const useStyles = makeStyles(theme => ({
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
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    position: 'relative',
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.05),
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
    },
  },
  list: {
    padding: 0,
    maxHeight: 400,
    overflowY: 'auto',
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
    marginRight: 15,
  },
  image: {
    borderRadius: '50%',
    border: `2px solid #fff`,
    width: 70,
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    cursor: 'zoom-in',
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
  },
  ingredients: {
    color: '#c53328',
  },
}));

ProductPizzaComplementItem.propTypes = {
  complements: PropTypes.array.isRequired,
  handleClickPizzaComplements: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
  category: PropTypes.object.isRequired,
  setComplementCategoryIdSelected: PropTypes.func.isRequired,
  setComplementIdSelected: PropTypes.func.isRequired,
  openDialogAdditional: PropTypes.func.isRequired,
  openDialogIngredients: PropTypes.func.isRequired,
};

export default function ProductPizzaComplementItem({
  complements,
  handleClickPizzaComplements,
  productId,
  category,
  setComplementCategoryIdSelected,
  setComplementIdSelected,
  openDialogAdditional,
  openDialogIngredients,
}) {
  const classes = useStyles({ isPizzaTaste: category.is_pizza_taste });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplement, setSelectedComplement] = useState({ additional: [], ingredients: [] });
  const [imagePreview, setImagePreview] = useState(false);

  function handleClickMore(event, complement) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setComplementIdSelected(complement.id);
    setComplementCategoryIdSelected(category.id);
    setSelectedComplement(complement);
  }

  function handleImageClick(event, complement) {
    event.stopPropagation();
    setSelectedComplement(complement);
    setImagePreview(true);
  }

  return (
    <>
      {imagePreview && selectedComplement.image && (
        <ImagePreview
          src={selectedComplement.image.imageUrl}
          onExited={() => setImagePreview(false)}
          description={selectedComplement.name}
        />
      )}
      {category.is_pizza_taste && (
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
          {selectedComplement.additional.length > 0 && (
            <MenuItem
              onClick={() => {
                openDialogAdditional();
                setAnchorEl(null);
              }}
            >
              Adicionais
            </MenuItem>
          )}
          {selectedComplement.ingredients.length > 0 && (
            <MenuItem
              onClick={() => {
                openDialogIngredients();
                setAnchorEl(null);
              }}
            >
              Ingredientes
            </MenuItem>
          )}
        </Menu>
      )}
      <List className={classes.list}>
        {complements.map(complement => (
          <ListItem
            className={complement.selected ? classes.selected : classes.listItem}
            button
            key={complement.id}
            onClick={() => handleClickPizzaComplements(productId, category.id, complement.id)}
          >
            {category.is_pizza_taste && (complement.additional.length > 0 || complement.ingredients.length > 0) && (
              <IconButton className={classes.more} onClick={event => handleClickMore(event, complement)}>
                <MoreHorizIcon />
              </IconButton>
            )}
            <div className={classes.complementData}>
              <div className={classes.imageContainer}>
                {complement.image && (
                  <img
                    className={classes.image}
                    src={complement.image.imageUrl}
                    alt={complement.name}
                    onClick={event => handleImageClick(event, complement)}
                  />
                )}
              </div>
              <div>
                <Typography variant="body1" className={classes.complementName}>
                  {complement.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {complement.description}
                </Typography>
                {complement.ingredients &&
                  complement.ingredients.map(
                    ingredient =>
                      !ingredient.selected && (
                        <Typography
                          key={ingredient.id}
                          variant="caption"
                          display="block"
                          className={classes.ingredients}
                        >
                          - {ingredient.name}
                        </Typography>
                      )
                  )}
                {complement.additional &&
                  complement.additional.map(
                    additional =>
                      additional.selected && (
                        <Typography
                          key={additional.id}
                          variant="caption"
                          display="block"
                          className={classes.additional}
                        >
                          + {additional.name} {additional.prices.find(price => price.selected).formattedPrice}
                        </Typography>
                      )
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
}
