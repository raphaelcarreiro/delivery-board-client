import React, { useState } from 'react';
import { makeStyles, List, ListItem, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';
import ProductPizzaComplement from './pizza_complement/ProductPizzaComplement';
import ProductComplement from './complements/ProductComplement';
import ProductSimple from './simple/ProductSimple';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    borderRadius: 4,
    position: 'relative',
    alignItems: 'center',
    minHeight: 60,
    marginBottom: 4,
    // boxShadow: '1px 1px 9px 1px #eee',
  },
  list: {
    paddingBottom: 20,
  },
  additional: {
    color: '#4CAF50',
    marginRight: 6,
  },
  ingredients: {
    color: '#c53328',
    marginRight: 6,
  },
  productData: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  productName: {
    fontSize: 18,
  },
});

OrderProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function OrderProductList({ products }) {
  const classes = useStyles();
  const [dialogProductComplement, setDialogProductComplement] = useState(false);
  const [dialogProduct, setDialogProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleClick(product) {
    setSelectedProduct(product);
    if (product.category.has_complement) {
      setDialogProductComplement(true);
      return false;
    }

    setDialogProduct(true);
  }

  return (
    <>
      {dialogProductComplement && (
        <>
          {selectedProduct.category.is_pizza ? (
            <ProductPizzaComplement
              onExited={() => setDialogProductComplement(false)}
              selectedProduct={selectedProduct}
            />
          ) : (
            <ProductComplement onExited={() => setDialogProductComplement(false)} selectedProduct={selectedProduct} />
          )}
        </>
      )}
      {dialogProduct && <ProductSimple onExited={() => setDialogProduct(false)} selectedProduct={selectedProduct} />}
      <Typography variant="h6" gutterBottom>
        Itens
      </Typography>
      <List className={classes.list}>
        {products.map(product => (
          <ListItem button key={product.id} className={classes.listItem} onClick={() => handleClick(product)}>
            <div className={classes.productData}>
              <div>
                <Typography variant="body1" className={classes.productName}>
                  {product.name}
                </Typography>
                <Typography color="textSecondary">
                  {product.amount} x {product.formattedPrice}
                </Typography>
              </div>
              <Typography variant="h5">{product.formattedFinalPrice}</Typography>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
}
