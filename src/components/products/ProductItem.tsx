import React from 'react';
import { ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  listItem: (props: { listType: 'col' | 'row' }) => ({
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0 0 3px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    alignItems: 'center',
    height: 380,
    width: props.listType === 'row' ? 230 : '100%',
    padding: 10,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: props.listType === 'row' ? 'calc(100vw / 2 - 15)' : '100%',
      height: 'auto',
    },
  }),
  img: {
    height: 190,
    maxWidth: 220,
    objectFit: 'contain',
    width: '100%',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {},
  },
  productData: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  price: {
    fontWeight: 600,
  },
  oldPrice: {
    textDecoration: 'line-through',
    marginRight: 10,
  },
  specialPrice: {
    fontWeight: 600,
  },
  specialPriceContent: {
    display: 'flex',
    alignItems: 'baseline',
  },
  tag: {
    position: 'absolute',
    top: -7,
    left: 10,
    color: theme.palette.secondary.main,
  },
  productName: {
    fontWeight: 300,
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
  },
  productDescription: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
    marginTop: 3,
    [theme.breakpoints.up('sm')]: {
      height: 60,
    },
  },
}));

type CategoryProductProps = {
  product: Product;
  handleProductClick(product: Product): void;
  handleOpenImagePreview(product: Product): void;
  listType: 'col' | 'row';
};

const CategoryProduct: React.FC<CategoryProductProps> = ({
  product,
  handleProductClick,
  handleOpenImagePreview,
  listType,
}) => {
  const classes = useStyles({ listType });

  return (
    <ListItem onClick={() => handleProductClick(product)} button className={classes.listItem} key={product.id}>
      {product.image && (
        <img
          className={classes.img}
          src={product.image.imageThumbUrl ? product.image.imageUrl : product.image.imageUrl}
          alt={product.name}
          onClick={() => handleOpenImagePreview(product)}
        />
      )}
      <div className={classes.productData}>
        {product.promotion_activated && product.special_price && product.special_price > 0 ? (
          <div className={classes.specialPriceContent}>
            <Typography variant="body1" color="textSecondary" className={classes.oldPrice}>
              {product.formattedPrice}
            </Typography>
            <Typography color="primary" className={classes.specialPrice}>
              {product.formattedSpecialPrice}
            </Typography>
          </div>
        ) : (
          product.price > 0 && (
            <Typography variant="body1" className={classes.price}>
              {product.formattedPrice}
            </Typography>
          )
        )}
        <Typography className={classes.productName}>{product.name}</Typography>
        <Typography variant="body2" gutterBottom color="textSecondary" className={classes.productDescription}>
          {product.description}
        </Typography>
        {product.category.has_complement && (
          <Typography variant="body2" color="primary">
            Monte esse produto
          </Typography>
        )}
      </div>
    </ListItem>
  );
};

export default CategoryProduct;
