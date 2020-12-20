import React from 'react';
import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Category } from 'src/types/category';
import CategoryItem from './CategoryItem';

const useStyles = makeStyles({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gridGap: 6,
  },
});

type CategoryListProps = {
  categories: Category[];
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const classes = useStyles();

  return (
    <List className={classes.list} disablePadding>
      {categories
        .filter(category => category.activated)
        .map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
    </List>
  );
};

export default CategoryList;
