import React, { Fragment } from 'react';
import DialogFullscreen from 'components/dialog/DialogFullscreen';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

function ItemUpdateIngredients({ handleModalState, handleUpdateIngredients, product, categoryUid }) {
  const classes = useStyles();

  return (
    <DialogFullscreen handleModalState={handleModalState} title={`${product.name} - ingredientes`}>
      <Fragment>
        {product.ingredients.map(ingredient => (
          <FormControlLabel
            classes={{ root: classes.control }}
            key={ingredient.id}
            control={
              <Checkbox
                color="primary"
                checked={ingredient.selected}
                onChange={() => handleUpdateIngredients(categoryUid, product.id, ingredient.id)}
              />
            }
            label={ingredient.name}
          ></FormControlLabel>
        ))}
      </Fragment>
    </DialogFullscreen>
  );
}

export default ItemUpdateIngredients;
