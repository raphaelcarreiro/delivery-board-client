import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, IconButton, makeStyles, alpha } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import ProductPizzaComplementSearchBox from './ProductPizzaComplementSearchBox';

const useStyles = makeStyles(theme => ({
  header: {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 0,
    height: 75,
    position: 'sticky',
    top: 0,
    backgroundColor: '#fafafa',
    zIndex: 100,
    [theme.breakpoints.down('sm')]: {
      top: -15,
    },
  },
  chip: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
    marginLeft: 10,
  },
  categoryName: {
    fontWeight: 400,
  },
}));

ProductPizzaComplementHeader.propTypes = {
  category: PropTypes.object.isRequired,
  complementSizeSelected: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default function ProductPizzaComplementHeader({ category, complementSizeSelected, handleSearch }) {
  const classes = useStyles();
  const [searchBox, setSearchBox] = useState(false);

  return (
    <>
      {category.is_pizza_taste ? (
        <div id={`complement-category-${category.id}`} className={classes.header} onScroll={() => console.log('test')}>
          {searchBox ? (
            <ProductPizzaComplementSearchBox
              categoryId={category.id}
              handleSearch={handleSearch}
              closeSearchBox={() => setSearchBox(false)}
            />
          ) : (
            <>
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

              <div>
                {complementSizeSelected.id && (
                  <IconButton onClick={() => setSearchBox(true)}>
                    <IconSearch />
                  </IconButton>
                )}
                {category.is_required && <span className={classes.chip}>Obrigatório</span>}
              </div>
            </>
          )}
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
