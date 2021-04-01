import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Category } from 'src/types/category';
import CategoryItem from './CategoryItem';

const useStyles = makeStyles(theme => ({
  ul: {
    display: 'grid',
    columnGap: '10px',
    overflowX: 'auto',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
    },
    '& li:last-child img': {
      marginRight: 15,
    },
    '& a': {
      color: 'inherit',
    },
  },
}));

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const classes = useStyles();

  return (
    <ul className={classes.ul}>
      {categories.map(category => (
        <CategoryItem category={category} key={category.id} />
      ))}
    </ul>
  );
};

export default CategoryList;
