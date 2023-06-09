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
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    alignItems: 'center',
    minHeight: 120,
  },
  img: {
    width: '100%',
    borderRadius: 4,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 4,
    position: 'relative',
    flexShrink: 0,
  },
  productData: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  price: {
    fontWeight: 300,
  },
  oldPrice: {
    textDecoration: 'line-through',
    marginRight: 10,
  },
  specialPrice: {
    color: '#2ca52a',
  },
  specialPriceContent: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    minWidth: 135,
  },
  tag: {
    position: 'absolute',
    top: -7,
    left: 10,
    color: theme.palette.secondary.main,
  },
  productName: {
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
              <Typography variant="h6" className={classes.productName}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              {product.promotion_activated && product.special_price > 0 ? (
                <div className={classes.specialPriceContent}>
                  <Typography variant="body1" color="textSecondary" className={classes.oldPrice}>
                    {product.formattedPrice}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.formattedSpecialPrice}
                  </Typography>
                </div>
              ) : (
                product.price > 0 && (
                  <Typography variant="h6" className={classes.price} color="primary">
                    {product.formattedPrice}
                  </Typography>
                )
              )}
              {product.category.has_complement && <Typography color="primary">Monte esse produto</Typography>}
            </div>
            {product.image && (
              <div className={classes.imageWrapper}>
                <img
                  className={classes.img}
                  src={product.image.imageThumbUrl ? product.image.imageThumbUrl : product.image.imageUrl}
                  alt={product.name}
                  onClick={event => handleOpenImagePreview(event, product)}
                />
              </div>
            )}
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
