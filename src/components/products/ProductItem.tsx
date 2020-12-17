import React, { MouseEvent } from 'react';
import { ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from 'src/types/product';
import { useApp } from 'src/App';

const useStyles = makeStyles(theme => ({
  listItem: (props: { windowWidth: number; listType: 'col' | 'row' }) => ({
    display: 'flex',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    alignItems: 'flex-start',
    height: 250,
    width: props.listType === 'row' ? 230 : '100%',
    padding: 10,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: props.listType === 'row' ? props.windowWidth / 2 - 15 : '100%',
    },
  }),
  img: {
    height: '100%',
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 100,
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    marginBottom: 12,
  },
  productData: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
    alignItems: 'flex-start',
  },
  price: {
    fontWeight: 600,
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
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
  },
  productDescription: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
  },
}));

type CategoryProductProps = {
  product: Product;
  handleProductClick(product: Product): void;
  handleOpenImagePreview(event: MouseEvent<HTMLImageElement>, product: Product): void;
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
          <img
            className={classes.img}
            src={product.image.thumbImageUlr ? product.image.thumbImageUlr : product.image.imageUrl}
            alt={product.name}
            onClick={event => handleOpenImagePreview(event, product)}
          />
        </div>
      )}
      <div className={classes.productData}>
        {product.promotion_activated && product.special_price && product.special_price > 0 ? (
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
            <Typography variant="body1" className={classes.price}>
              {product.formattedPrice}
            </Typography>
          )
        )}
        <Typography className={classes.productName}>{product.name}</Typography>
        <Typography variant="body2" color="textSecondary" className={classes.productDescription}>
          {product.description}
        </Typography>
        {product.category.has_complement && <Typography color="primary">Monte esse produto</Typography>}
      </div>
    </ListItem>
  );
};

export default CategoryProduct;
