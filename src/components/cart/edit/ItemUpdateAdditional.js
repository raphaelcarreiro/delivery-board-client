import React, { Fragment } from 'react';
import DialogFullscreen from 'components/dialog/DialogFullscreen';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

function ItemUpdateAdditional({ product, handleModalState, handleUpdateAdditional, categoryUid }) {
  const classes = useStyles();

  return (
    <DialogFullscreen handleModalState={handleModalState} title={`${product.name} - adicionais`}>
      <Fragment>
        {product.additional.map(additional => (
          <FormControlLabel
            classes={{ root: classes.control }}
            key={additional.id}
            control={
              <Checkbox
                color="primary"
                checked={additional.selected}
                onChange={() => handleUpdateAdditional(categoryUid, product.id, additional.id)}
              />
            }
            label={`${additional.name} ${additional.formattedPrice}`}
          ></FormControlLabel>
        ))}
      </Fragment>
    </DialogFullscreen>
  );
}

export default ItemUpdateAdditional;
