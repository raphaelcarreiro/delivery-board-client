import React, { Fragment } from 'react';
import { ListItem, List, Typography } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  selected: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eaeaea',
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.05),
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
    },
  },
  list: {
    padding: 0,
  },
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff8dc',
    marginTop: 10,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: 15,
  },
}));

ProductViewIngredients.propTypes = {
  ingredients: PropTypes.array.isRequired,
  handleClickIngredient: PropTypes.func.isRequired,
};

export default function ProductViewIngredients({ ingredients, handleClickIngredient }) {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.header}>
        <Typography variant="h6">Ingredientes</Typography>
      </div>
      <List className={classes.list}>
        {ingredients.map(additional => (
          <ListItem
            onClick={() => handleClickIngredient(additional.id)}
            button
            className={additional.selected ? classes.selected : classes.listItem}
            key={additional.id}
          >
            <div>
              <Typography>{additional.name}</Typography>
            </div>
            {additional.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
}
