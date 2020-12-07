import React from 'react';
import { Ingredient } from 'src/types/product';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    '& > p': {
      marginRight: 10,
      color: theme.palette.error.main,
    },
  },
}));

type OrderProductIngredientsProps = {
  ingredients: Ingredient[];
};

const OrderProductIngredients: React.FC<OrderProductIngredientsProps> = ({ ingredients }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {ingredients
        .filter(ingredient => !ingredient.selected)
        .map(a => (
          <Typography key={a.id} display="inline" variant="body2">
            s/ {a.name}
          </Typography>
        ))}
    </div>
  );
};

export default OrderProductIngredients;
