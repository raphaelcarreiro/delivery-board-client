import React, { Fragment } from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';
import { useProductPizza } from '../hooks/useProductPizza';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

ProductPizzaComplementAdditional.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ProductPizzaComplementAdditional({ onExited }) {
  const classes = useStyles();
  const { product, setProduct, complementCategoryIdSelected, complementIdSelected } = useProductPizza();

  const category = product.complement_categories.find(category => category.id === complementCategoryIdSelected);
  const complement = category.complements.find(complement => complement.id === complementIdSelected);

  function handleClick(additionalId) {
    const categories = product.complement_categories.map(category => {
      if (category.id === complementCategoryIdSelected)
        category.complements = category.complements.map(complement => {
          if (complement.id === complementIdSelected)
            complement.additional = complement.additional.map(additional => {
              additional.selected = additional.id === additionalId ? !additional.selected : additional.selected;
              return additional;
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
    <CustomDialog handleModalState={onExited} title={`${complement.name} - adicionais`} hideBackdrop maxWidth="sm">
      <Fragment>
        {complement.additional.map(additional => (
          <FormControlLabel
            classes={{ root: classes.control }}
            key={additional.id}
            control={
              <Checkbox color="primary" checked={additional.selected} onChange={() => handleClick(additional.id)} />
            }
            label={`${additional.name} ${additional.prices.find(price => price.selected).formattedPrice}`}
          ></FormControlLabel>
        ))}
      </Fragment>
    </CustomDialog>
  );
}
