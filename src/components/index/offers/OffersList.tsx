import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Product } from 'src/types/product';
import OfferItem from './OfferItem';

const useStyles = makeStyles(theme => ({
  ul: {
    display: 'grid',
    overflowX: 'scroll',
    overflowY: 'hidden',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    columnGap: '10px',
    paddingBottom: 5,
    '& li:last-child img': {
      marginRight: 15,
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
    },
  },
}));

interface OffersListProps {
  products: Product[];
}

const OffersList: React.FC<OffersListProps> = ({ products }) => {
  const classes = useStyles();

  return (
    <ul className={classes.ul}>
      {products.map(product => (
        <OfferItem key={product.id} product={product} />
      ))}
    </ul>
  );
};

export default OffersList;
