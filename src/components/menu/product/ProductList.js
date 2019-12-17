import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
    gridGap: 6,
  },
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 3px 0px #ddd',
    borderRadius: 4,
    position: 'relative',
    alignItems: 'center',
    height: 120,
  },
  img: {
    width: 100,
    borderRadius: 4,
    backgroundColor: '#ccc',
    cursor: 'zoom-in',
  },
  productData: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
    alignItems: 'flex-start',
  },
  price: {
    fontWeight: 500,
  },
}));

export default function ProductList({ products, handleProductClick, handleOpenImagePreview }) {
  const classes = useStyles();

  return (
    <>
      <List className={classes.list}>
        {products.map(product => (
          <ListItem onClick={() => handleProductClick(product)} button className={classes.listItem} key={product.id}>
            <div className={classes.productData}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              {product.price > 0 && (
                <Typography color="primary" className={classes.price}>
                  {product.formattedPrice}
                </Typography>
              )}
              {product.category.has_complement && <Typography color="textSecondary">Monte esse produto</Typography>}
            </div>
            <img
              className={classes.img}
              src={product.image.imageUrl}
              alt={product.name}
              onClick={event => handleOpenImagePreview(event, product)}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  handleProductClick: PropTypes.func.isRequired,
  handleOpenImagePreview: PropTypes.func.isRequired,
};
