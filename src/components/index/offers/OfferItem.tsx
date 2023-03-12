import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useProducts } from 'src/components/products/hooks/useProducts';
import { Product } from 'src/types/product';

const useStyles = makeStyles({
  li: {
    position: 'relative',
    width: 200,
    boxShadow: '0 0 5px 0 #ddd',
    cursor: 'pointer',

    '&:hover': {
      transform: 'scale(1.01)',
    },
    transition: 'transform 0.3s ease',
  },

  image: {
    width: 200,
    height: 200,
    objectFit: 'cover',
  },
  prices: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    '& .old-price': {
      marginRight: 20,
      textDecoration: 'line-through',
    },
  },
  description: {
    padding: 10,
    borderTop: '1px solid #eee',
    marginTop: 10,
  },
});

interface OfferItemProps {
  product: Product;
}

const OfferItem: React.FC<OfferItemProps> = ({ product }) => {
  const classes = useStyles();
  const { handleSelectProduct } = useProducts();

  return (
    <li className={classes.li} key={product.id} onClick={() => handleSelectProduct(product)}>
      <img className={classes.image} src={product.image?.imageUrl} alt={product.name} />
      <div className={classes.description}>
        <div className={classes.prices}>
          <Typography className="old-price" color="inherit">
            {product.formattedPrice}
          </Typography>
          <Typography variant="h6" color="primary">
            {product.formattedSpecialPrice}
          </Typography>
        </div>
        <Typography variant="subtitle1" color="inherit">
          {product.name}
        </Typography>
      </div>
    </li>
  );
};

export default OfferItem;
