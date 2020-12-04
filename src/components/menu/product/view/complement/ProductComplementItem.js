import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';
import { Add, Remove } from '@material-ui/icons';

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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eaeaea',
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    position: 'relative',
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
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: 15,
  },
  complementName: {
    fontWeight: 400,
  },
  price: {
    fontWeight: 500,
  },
  amountControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 70,
  },
}));

ProductComplementItem.propTypes = {
  complements: PropTypes.array.isRequired,
  handleClickComplements: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
  complementCategoryId: PropTypes.number.isRequired,
  maxQuantity: PropTypes.number.isRequired,
};

export default function ProductComplementItem({
  complements,
  handleClickComplements,
  productId,
  complementCategoryId,
  maxQuantity,
}) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {complements.map(complement => (
        <ListItem
          className={complement.selected ? classes.selected : classes.listItem}
          button
          key={complement.id}
          onClick={() => handleClickComplements(productId, complementCategoryId, complement.id)}
        >
          <div>
            <Typography variant="body1" className={classes.complementName}>
              {complement.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {complement.description}
            </Typography>
            {complement.price && (
              <Typography className={classes.price} color="primary">
                + {complement.formattedPrice}
              </Typography>
            )}
          </div>
          {maxQuantity >= 2 && (
            <div className={classes.amountControl}>
              <Remove color="primary"></Remove>
              <Typography variant="body1" display="inline">
                0
              </Typography>
              <Add color="primary"></Add>
            </div>
          )}
          {complement.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
        </ListItem>
      ))}
    </List>
  );
}
