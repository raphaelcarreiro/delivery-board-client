import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  ingredient: {
    color: '#c53328',
    marginRight: 6,
    display: 'inline-block',
  },
});

CartProductComplementIngredient.propTypes = {
  ingredients: PropTypes.array.isRequired,
};

export default function CartProductComplementIngredient({ ingredients }) {
  const classes = useStyles();

  return (
    <>
      {ingredients.map(
        ingredient =>
          !ingredient.selected && (
            <Typography variant="caption" className={classes.ingredient} key={ingredient.id}>
              {`- ${ingredient.name}`}
            </Typography>
          )
      )}
    </>
  );
}
