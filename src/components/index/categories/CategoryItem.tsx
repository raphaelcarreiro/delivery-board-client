import React, { HTMLAttributes } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Category } from 'src/types/category';
import Link from 'next/link';

const useStyles = makeStyles({
  li: {
    position: 'relative',
    width: 120,
    cursor: 'pointer',
  },
  image: {
    width: 120,
    height: 120,
    objectFit: 'cover',
    '&:hover': {
      transform: 'scale(1.02)',
    },
    transition: 'transform 0.3s ease',
  },
  promotionDescription: {
    marginTop: 5,
  },
  categoryName: {
    fontWeight: 600,
    fontSize: 18,
  },
});

interface CategoryItemProps extends HTMLAttributes<HTMLLIElement> {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, ...rest }) => {
  const classes = useStyles();

  return (
    <Link href={`/menu/${category.url}`}>
      <li className={classes.li} key={category.id} {...rest}>
        <img
          className={classes.image}
          src={category.image.imageThumbUrl ? category.image.imageThumbUrl : category.image.imageUrl}
          alt={category.name}
        />
        <div className={classes.promotionDescription}>
          <Typography className={classes.categoryName} align="center" color="textSecondary">
            {category.name}
          </Typography>
        </div>
      </li>
    </Link>
  );
};

export default CategoryItem;
