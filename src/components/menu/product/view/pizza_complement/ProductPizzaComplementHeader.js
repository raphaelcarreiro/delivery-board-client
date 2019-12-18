import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, fade } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px 4px 0 0',
    // backgroundColor: '#fff8dc',
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  categoryName: {
    fontWeight: 400,
  },
}));

ProductPizzaComplementHeader.propTypes = {
  category: PropTypes.object.isRequired,
  complementSizeSelected: PropTypes.object.isRequired,
};

export default function ProductPizzaComplementHeader({ category, complementSizeSelected }) {
  const classes = useStyles();

  return (
    <>
      {category.is_pizza_taste ? (
        <div className={classes.header}>
          <div>
            <Typography className={classes.categoryName} variant="h6">
              {category.name}
            </Typography>
            {complementSizeSelected.taste_amount === 1 ? (
              <Typography color="textSecondary" variant="body2">
                Escolha 1 opção.
              </Typography>
            ) : complementSizeSelected.id ? (
              <Typography color="textSecondary" variant="body2">
                Escolha até {complementSizeSelected.taste_amount} opções.
              </Typography>
            ) : (
              <Typography color="primary">Selecione o tamanho</Typography>
            )}
          </div>
          <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
        </div>
      ) : category.is_pizza_size ? (
        <div className={classes.header}>
          <div>
            <Typography className={classes.categoryName} variant="h6">
              {category.name}
            </Typography>
            {category.max_quantity === 1 ? (
              <Typography color="textSecondary" variant="body2">
                Escolha 1 opção.
              </Typography>
            ) : (
              <Typography color="textSecondary" variant="body2">
                Escolha até {category.max_quantity} opções.
              </Typography>
            )}
          </div>
          <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
        </div>
      ) : (
        <div className={classes.header}>
          <div>
            <Typography className={classes.categoryName} variant="h6">
              {category.name}
            </Typography>
            {category.max_quantity === 1 && complementSizeSelected.id ? (
              <Typography color="textSecondary" variant="body2">
                Escolha 1 opção.
              </Typography>
            ) : complementSizeSelected.id ? (
              <Typography color="textSecondary" variant="body2">
                Escolha até {category.max_quantity} opções.
              </Typography>
            ) : (
              <Typography color="primary">Selecione o tamanho</Typography>
            )}
          </div>
          <div>{category.is_required && <span className={classes.chip}>Obrigatório</span>}</div>
        </div>
      )}
    </>
  );
}
