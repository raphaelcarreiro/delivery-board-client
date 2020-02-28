import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductPizzaComplementItem from './ProductPizzaComplementItem';
import { MessagingContext } from 'src/components/messaging/Messaging';
import CustomDialog from 'src/components/dialog/CustomDialog';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: 4,
    backgroundColor: theme.palette.primary.dark,
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
    marginBottom: 50,
  },
}));

ProductPizzaComplement.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
  onExited: PropTypes.func.isRequired,
  handleUpdateCartProduct: PropTypes.func.isRequired,
};

export default function ProductPizzaComplement({ selectedProduct, onExited, handleUpdateCartProduct }) {
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));
  const classes = useStyles();
  const categoryComplementSize = product.complement_categories.find(category => category.is_pizza_size);
  const complementSizeSelected = categoryComplementSize.complements.find(complement => complement.selected);

  return (
    <CustomDialog backgroundColor="#fafafa" handleModalState={onExited} title={`${product.name} - Complementos`}>
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          {product.complement_categories.map(category => (
            <section className={classes.category} key={category.id}>
              {category.is_pizza_taste ? (
                <div className={classes.header}>
                  <div>
                    <Typography className={classes.categoryName} variant="h6">
                      {category.name}
                    </Typography>
                    {complementSizeSelected.taste_amount === 1 ? (
                      <Typography color="textSecondary" variant="body2">
                        Escolha 1 opção.
                      </Typography>
                    ) : (
                      <Typography color="textSecondary" variant="body2">
                        Escolha até {complementSizeSelected.taste_amount} opções.
                      </Typography>
                    )}
                  </div>
                  <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
                </div>
              ) : (
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
              )}
              <ProductPizzaComplementItem
                category={category}
                productId={product.id}
                complements={category.complements}
              />
            </section>
          ))}
        </Grid>
        <Grid item xs={12} className={classes.annotationContainer}>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            label="Tem alguma observação?"
            placeholder="Por exemplo, carne do hamburguer bem passada"
            fullWidth
            margin="normal"
            value={product.annotation}
            onChange={event => setProduct({ ...product, annotation: event.target.value })}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
