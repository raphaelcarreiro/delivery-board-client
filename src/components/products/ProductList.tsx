import React, { MouseEvent } from 'react';
import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductItem from './ProductItem';
import { Product } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  listRow: {
    display: 'grid',
    gridGap: 6,
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    overflowY: 'scroll',
    padding: '10px 0 0',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 10px 0',
    },
  },
  listCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridGap: 6,
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
}));

type ProductListProps = {
  products: Product[];
  handleProductClick(product: Product): void;
  handleOpenImagePreview(event: MouseEvent<HTMLImageElement>, product: Product): void;
  listType: 'row' | 'col';
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  handleProductClick,
  handleOpenImagePreview,
  listType,
}) => {
  const classes = useStyles();

  return (
    <>
      <List className={listType === 'col' ? classes.listCol : classes.listRow}>
        {products.map(product => (
          <ProductItem
            listType={listType}
            key={product.id}
            product={product}
            handleOpenImagePreview={handleOpenImagePreview}
            handleProductClick={handleProductClick}
          />
        ))}
      </List>
    </>
  );
};

export default ProductList;
