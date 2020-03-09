import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
    gridGap: 6,
    padding: '10px 0',
  },
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: 4,
    position: 'relative',
    alignItems: 'center',
    minHeight: 120,
  },
  img: {
    width: 100,
    borderRadius: 4,
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
    fontWeight: 300,
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
                <Typography variant="h6" className={classes.price} color="primary">
                  {product.formattedPrice}
                </Typography>
              )}
              {product.category.has_complement && <Typography color="primary">Monte esse produto</Typography>}
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
