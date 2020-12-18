import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { Category } from 'src/types/category';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    // border: '1px solid #eee',
    boxShadow: '0 0 3px 1px #eee',
    borderRadius: theme.shape.borderRadius,
    minHeight: 120,
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
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 4,
    flexShrink: 0,
    marginLeft: 10,
  },
  image: {
    borderRadius: 4,
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      width: '100%',
    },
  },
  productName: {
    fontWeight: 300,
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
            <div className={classes.imageWrapper}>
              <img
                className={classes.image}
                src={category.image.imageThumbUrl ? category.image.imageThumbUrl : category.image.imageUrl}
                alt={category.name}
              />
            </div>
          )}
        </div>
      </ListItem>
    </Link>
  );
};

export default CategoryItem;
