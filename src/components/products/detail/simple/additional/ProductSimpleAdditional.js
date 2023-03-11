import React, { Fragment } from 'react';
import { ListItem, List, Typography, makeStyles, alpha } from '@material-ui/core';
import PropTypes from 'prop-types';
import ProductViewAmountControl from './ProductSimpleAmountControl';

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
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    position: 'relative',
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  list: {
    padding: 0,
  },
  header: {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px 4px 0 0',
    position: 'sticky',
    top: 0,
    marginTop: 15,
    backgroundColor: '#fafafa',
    zIndex: 100,
    [theme.breakpoints.down('sm')]: {
      top: -15,
    },
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

ProductSimpleAdditional.propTypes = {
  additional: PropTypes.array.isRequired,
  handleClickAdditional: PropTypes.func.isRequired,
};

export default function ProductSimpleAdditional({ additional, handleClickAdditional }) {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.header}>
        <Typography variant="h6">Adicionais</Typography>
      </div>
      <List className={classes.list}>
        {additional.map(item => (
          <ListItem button className={item.selected ? classes.selected : classes.listItem} key={item.id}>
            <div>
              <Typography>{item.name}</Typography>
              {item.price > 0 && (
                <Typography color="primary" className={classes.price}>
                  + {item.formattedPrice}
                </Typography>
              )}
            </div>
            <ProductViewAmountControl
              selectedAmount={item.amount}
              additionalId={item.id}
              handleClickAdditional={handleClickAdditional}
            />
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
}
