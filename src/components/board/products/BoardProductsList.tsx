import React, { FC } from 'react';
import { List, makeStyles } from '@material-ui/core';
import BoardProductItem from './BoardProductItem';
import { BoardOrderProduct } from 'src/types/boardOrderProduct';

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: 0,
    [theme.breakpoints.down('md')]: {
      paddingBottom: 15,
    },
    '& > li:last-child': {
      [theme.breakpoints.down('sm')]: {
        border: 'none',
      },
    },
  },
}));

interface BoardProductListProps {
  products: BoardOrderProduct[];
}

const BoardProductList: FC<BoardProductListProps> = ({ products }) => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {products.map(product => (
        <BoardProductItem product={product} key={product.id} />
      ))}
    </List>
  );
};

export default BoardProductList;
