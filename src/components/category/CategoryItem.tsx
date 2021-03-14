import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { Category } from 'src/types/category';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0 0 3px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    minHeight: 120,
    padding: '0 0 0 15px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    overflow: 'hidden',
    flexShrink: 0,
    marginLeft: 10,
  },
  image: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },
  productName: {
    fontWeight: 400,
  },
}));

type CategoryItemProps = {
  category: Category;
};

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const classes = useStyles();

  return (
    <Link href={'/menu/[url]'} as={`/menu/${category.url}`}>
      <ListItem className={classes.listItem} button component="a">
        <div className={classes.content}>
          <div>
            <Typography variant="h6" className={classes.productName}>
              {category.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {category.description}
            </Typography>
          </div>
          {category.image && (
            <img
              className={classes.image}
              src={category.image.imageThumbUrl ? category.image.imageThumbUrl : category.image.imageUrl}
              alt={category.name}
            />
          )}
        </div>
      </ListItem>
    </Link>
  );
};

export default CategoryItem;
