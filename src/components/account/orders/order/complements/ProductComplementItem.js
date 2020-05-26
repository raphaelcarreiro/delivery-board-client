import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
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
    borderBottom: '1px solid #f5f5f5',
    position: 'relative',
  },
  selected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f5f5f5',
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
}));

ProductComplementItem.propTypes = {
  complements: PropTypes.array.isRequired,
  handleClickComplements: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
  complementCategoryId: PropTypes.number.isRequired,
};

export default function ProductComplementItem({ complements, productId, complementCategoryId }) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {complements.map(complement => (
        <ListItem className={complement.selected ? classes.selected : classes.listItem} button key={complement.id}>
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
          {complement.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
        </ListItem>
      ))}
    </List>
  );
}
