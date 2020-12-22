import React from 'react';
import { ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from 'src/types/product';
import { useApp } from 'src/hooks/app';
import NextImage from 'next/image';

const useStyles = makeStyles(theme => ({
  listItem: (props: { windowWidth: number; listType: 'col' | 'row' }) => ({
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0 0 3px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    alignItems: 'flex-start',
    height: 380,
    width: props.listType === 'row' ? 230 : '100%',
    padding: 0,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: props.listType === 'row' ? props.windowWidth / 2 - 15 : '100%',
      height: 355,
    },
  }),
  img: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
    },
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 220,
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    marginBottom: 12,
    [theme.breakpoints.down('sm')]: {
      height: 190,
    },
  },
  productData: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    padding: '0 10px 10px 10px',
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
    height: 60,
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
  const { windowWidth } = useApp();
  const classes = useStyles({ windowWidth, listType });

  return (
    <ListItem onClick={() => handleProductClick(product)} button className={classes.listItem} key={product.id}>
      {product.image && (
        <div className={classes.imageWrapper}>
          <NextImage
            className={classes.img}
            src={product.image.imageThumbUrl ? product.image.imageUrl : product.image.imageUrl}
            alt={product.name}
            onClick={() => handleOpenImagePreview(product)}
            width={300}
            height={300}
          />
        </div>
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
