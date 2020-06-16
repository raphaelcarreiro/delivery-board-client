import React, { useState, Fragment } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ProductComplementItem from './ProductComplementItem';
import PropTypes from 'prop-types';
import CustomDialog from 'src/components/dialog/CustomDialog';

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
    marginBottom: 0,
  },
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  amountControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 4,
    marginRight: 10,
    height: 40,
  },
  action: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  amount: {
    textAlign: 'center',
  },
  buttonAmount: {
    minWidth: 50,
  },
  finalPrice: {
    color: ({ isSelected }) => (isSelected ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

ProductComplement.propTypes = {
  onExited: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object.isRequired,
};

export default function ProductComplement({ onExited, selectedProduct }) {
  const classes = useStyles({ isSelected: selectedProduct.selected });
  const [product, setProduct] = useState(JSON.parse(JSON.stringify(selectedProduct)));

  return (
    <CustomDialog backgroundColor="#fafafa" handleModalState={onExited} title={`${product.name} - Complementos`}>
      <Fragment>
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            {product.complement_categories.map(item => (
              <section className={classes.category} key={item.id}>
                <div className={classes.header}>
                  <div>
                    <Typography className={classes.categoryName} variant="h6">
                      {item.name}
                    </Typography>
                    {item.max_quantity === 1 ? (
                      <Typography color="textSecondary" variant="body2">
                        Escolha 1 opção.
                      </Typography>
                    ) : (
                      <Typography color="textSecondary" variant="body2">
                        Escolha até {item.max_quantity} opções.
                      </Typography>
                    )}
                  </div>
                  <div>{item.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
                </div>
                <ProductComplementItem
                  productId={product.id}
                  complementCategoryId={item.id}
                  complements={item.complements}
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
      </Fragment>
    </CustomDialog>
  );
}