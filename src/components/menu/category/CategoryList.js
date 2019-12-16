import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuProduct from '../product/Product';

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

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default function CategoryList({ categories }) {
  const classes = useStyles();

  return (
    <>
      {categories.map(
        category =>
          category.productsAmount > 0 && (
            <Fragment key={category.id}>
              <div className={classes.category}>
                <Typography className={classes.name} variant="h5">
                  {category.name}
                </Typography>
              </div>
              <MenuProduct products={category.products} categoryName={category.name} />
            </Fragment>
          )
      )}
    </>
  );
}
