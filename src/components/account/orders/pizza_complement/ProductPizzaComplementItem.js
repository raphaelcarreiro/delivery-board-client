import React, { useState } from 'react';
import { List, ListItem, Typography, MenuItem, Menu, IconButton } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f5f5f5',
    position: 'relative',
  },
  selected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f5f5f5',
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
  },
  complementData: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: 500,
  },
  additional: {
    color: '#4CAF50',
  },
  ingredients: {
    color: '#c53328',
  },
  more: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  productId,
  category,
  setComplementCategoryIdSelected,
  setComplementIdSelected,
  openDialogAdditional,
  openDialogIngredients,
}) {
  const classes = useStyles({ isPizzaTaste: category.is_pizza_taste });
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      {category.is_pizza_taste && (
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              openDialogAdditional();
              setAnchorEl(null);
            }}
          >
            Adicionais
          </MenuItem>
          <MenuItem
            onClick={() => {
              openDialogIngredients();
              setAnchorEl(null);
            }}
          >
            Ingredientes
          </MenuItem>
        </Menu>
      )}
      <List className={classes.list}>
        {complements.map(complement => (
          <ListItem className={complement.selected ? classes.selected : classes.listItem} button key={complement.id}>
            <div className={classes.complementData}>
              <div className={classes.imageContainer}>
                {complement.image && (
                  <img className={classes.image} src={complement.image.imageUrl} alt={complement.name} />
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
                          + {additional.name} {additional.formattedPrice}
                        </Typography>
                      )
                  )}
                {complement.price && (
                  <Typography className={classes.price} color="primary">
                    {!category.is_pizza_taste && <span>+</span>} {complement.formattedPrice}
                  </Typography>
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
