import React from 'react';
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
});

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const classes = useStyles();

  return (
    <Link href={`/menu/${category.url}`}>
      <a>
        <li className={classes.li} key={category.id}>
          <img
            className={classes.image}
            src={category.image.imageThumbUrl ? category.image.imageThumbUrl : category.image.imageUrl}
            alt={category.name}
          />
          <div className={classes.promotionDescription}>
            <Typography align="center" color="textSecondary">
              {category.name}
            </Typography>
          </div>
        </li>
      </a>
    </Link>
  );
};

export default CategoryItem;
