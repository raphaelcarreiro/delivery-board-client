import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

ProductPizzaComplementIngredient.propTypes = {
  onExited: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  setProduct: PropTypes.func.isRequired,
  complementIdSelected: PropTypes.number.isRequired,
  complementCategoryIdSelected: PropTypes.number.isRequired,
};

export default function ProductPizzaComplementIngredient({
  onExited,
  product,
  setProduct,
  complementIdSelected,
  complementCategoryIdSelected,
}) {
  const classes = useStyles();

  const category = product.complement_categories.find(category => category.id === complementCategoryIdSelected);
  const complement = category.complements.find(complement => complement.id === complementIdSelected);

  function handleClick(ingredientId) {
    const categories = product.complement_categories.map(category => {
      if (category.id === complementCategoryIdSelected)
        category.complements = category.complements.map(complement => {
          if (complement.id === complementIdSelected)
            complement.ingredients = complement.ingredients.map(ingredient => {
              ingredient.selected = ingredient.id === ingredientId ? !ingredient.selected : ingredient.selected;
              return ingredient;
            });
          return complement;
        });
      return category;
    });

    setProduct({
      ...product,
      complement_categories: categories,
    });
  }

  return (
    <CustomDialog handleModalState={onExited} title={`${complement.name} - ingredientes`} hideBackdrop maxWidth="sm">
      <>
        {complement.ingredients.map(ingredient => (
          <FormControlLabel
            classes={{ root: classes.control }}
            key={ingredient.id}
            control={
              <Checkbox color="primary" checked={ingredient.selected} onChange={() => handleClick(ingredient.id)} />
            }
            label={ingredient.name}
          ></FormControlLabel>
        ))}
      </>
    </CustomDialog>
  );
}
