import React from 'react';
import { makeStyles, List, ListItem, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import OrderProductAdditional from './OrderProductAdditional';
import OrderProductIngredients from './OrderProductIngredients';
import OrderProductComplements from './OrderProductComplements';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    borderRadius: 4,
    position: 'relative',
    minHeight: 60,
    marginBottom: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    marginBottom: 7,
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

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Itens
      </Typography>
      <List className={classes.list}>
        {products.map(product => (
          <ListItem key={product.id} className={classes.listItem}>
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
            {product.additional.length > 0 && <OrderProductAdditional additional={product.additional} />}
            {product.ingredients.length > 0 && <OrderProductIngredients ingredients={product.ingredients} />}
            {product.complement_categories.length > 0 && (
              <OrderProductComplements complementCategories={product.complement_categories} />
            )}
          </ListItem>
        ))}
      </List>
    </>
  );
}
