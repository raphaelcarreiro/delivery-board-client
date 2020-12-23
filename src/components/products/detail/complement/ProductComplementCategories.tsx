import { fade, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useProductComplement } from '../hooks/useProductComplement';
import ProductComplementItem from './ProductComplementItem';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    backgroundColor: '#fafafa',
    zIndex: 100,
    [theme.breakpoints.down('sm')]: {
      top: -15,
    },
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  category: {
    display: 'block',
    marginBottom: 10,
  },
  categoryName: {
    fontWeight: 400,
  },
  container: {
    marginBottom: 0,
  },
}));

const ProductComplementCategories: React.FC = () => {
  const classes = useStyles();
  const { product, handleClickComplements } = useProductComplement();

  return (
    <div>
      {product.complement_categories.map(category => (
        <section className={classes.category} key={category.id}>
          <div className={classes.header}>
            <div>
              <Typography className={classes.categoryName} variant="h6">
                {category.name}
              </Typography>
              {category.max_quantity === 1 ? (
                <Typography color="textSecondary" variant="body2">
                  Escolha 1 opção.
                </Typography>
              ) : (
                <Typography color="textSecondary" variant="body2">
                  Escolha até {category.max_quantity} opções.
                </Typography>
              )}
            </div>
            <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
          </div>
          <ProductComplementItem
            complementCategoryId={category.id}
            handleClickComplements={handleClickComplements}
            complements={category.complements}
          />
        </section>
      ))}
    </div>
  );
};

export default ProductComplementCategories;
