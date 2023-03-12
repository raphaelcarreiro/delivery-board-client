import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useProductPizza } from '../hooks/useProductPizza';
import Modal from 'src/components/modal/Modal';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

interface ProductPizzaComplementIngredientProps {
  onExited(): void;
}

const ProductPizzaComplementIngredient: React.FC<ProductPizzaComplementIngredientProps> = ({ onExited }) => {
  const classes = useStyles();
  const { product, setProduct, complementCategoryIdSelected, complementIdSelected } = useProductPizza();

  const category = product?.complement_categories.find(category => category.id === complementCategoryIdSelected);
  const complement = category?.complements.find(complement => complement.id === complementIdSelected);

  function handleClick(ingredientId: number) {
    if (!product) {
      return [];
    }

    const categories = product?.complement_categories.map(category => {
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

    setProduct(state =>
      !state
        ? null
        : {
            ...state,
            complement_categories: categories,
          }
    );
  }

  return (
    <Modal onExited={onExited} title={`${complement?.name} - ingredientes`} hideBackdrop maxWidth="sm">
      {complement?.ingredients.map(ingredient => (
        <FormControlLabel
          classes={{ root: classes.control }}
          key={ingredient.id}
          control={
            <Checkbox color="primary" checked={ingredient.selected} onChange={() => handleClick(ingredient.id)} />
          }
          label={ingredient.name}
        />
      ))}
    </Modal>
  );
};

export default ProductPizzaComplementIngredient;
