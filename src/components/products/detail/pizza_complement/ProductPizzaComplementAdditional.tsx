import { FC } from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useProductPizza } from '../hooks/useProductPizza';
import Modal from 'src/components/modal/Modal';

const useStyles = makeStyles({
  control: {
    display: 'flex',
  },
});

interface ProductPizzaComplementAdditionalProps {
  onExited(): void;
}

const ProductPizzaComplementAdditional: FC<ProductPizzaComplementAdditionalProps> = ({ onExited }) => {
  const classes = useStyles();
  const { product, setProduct, complementCategoryIdSelected, complementIdSelected } = useProductPizza();

  const category = product?.complement_categories.find(category => category.id === complementCategoryIdSelected);
  const complement = category?.complements.find(complement => complement.id === complementIdSelected);

  function handleClick(additionalId: number) {
    if (!product) {
      return [];
    }

    const categories = product?.complement_categories.map(category => {
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
    <Modal onExited={onExited} title={`${complement?.name} - adicionais`} hideBackdrop maxWidth="sm">
      {complement?.additional.map(additional => (
        <FormControlLabel
          classes={{ root: classes.control }}
          key={additional.id}
          control={
            <Checkbox color="primary" checked={additional.selected} onChange={() => handleClick(additional.id)} />
          }
          label={`${additional.name} ${additional?.prices.find(price => price.selected)?.formattedPrice}`}
        />
      ))}
    </Modal>
  );
};

export default ProductPizzaComplementAdditional;
