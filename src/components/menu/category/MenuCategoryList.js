import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuProduct from '../product/MenuProduct';

const useStyles = makeStyles({
  category: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0',
  },
  name: {
    fontWeight: 500,
  },
});

MenuCategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default function MenuCategoryList({ categories }) {
  const classes = useStyles();

  return (
    <>
      {categories.map(category => (
        <>
          {category.productsAmount > 0 && (
            <>
              <div className={classes.category}>
                <Typography className={classes.name} key={category.id} variant="h5">
                  {category.name}
                </Typography>
              </div>
              <MenuProduct products={category.products} categoryName={category.name} />
            </>
          )}
        </>
      ))}
    </>
  );
}
