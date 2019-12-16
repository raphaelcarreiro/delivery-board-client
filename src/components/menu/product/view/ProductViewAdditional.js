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
  header: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontWeight: 500,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: 15,
  },
}));

ProductViewAdditional.propTypes = {
  additional: PropTypes.array.isRequired,
  handleClickAdditional: PropTypes.func.isRequired,
};

export default function ProductViewAdditional({ additional, handleClickAdditional }) {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.header}>
        <Typography variant="h6">Adicionais</Typography>
      </div>
      <List className={classes.list}>
        {additional.map(item => (
          <ListItem
            onClick={() => handleClickAdditional(item.id)}
            button
            className={item.selected ? classes.selected : classes.listItem}
            key={item.id}
          >
            <div>
              <Typography>{item.name}</Typography>
              <Typography color="primary" className={classes.price}>
                + {item.formattedPrice}
              </Typography>
            </div>
            {item.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
}
