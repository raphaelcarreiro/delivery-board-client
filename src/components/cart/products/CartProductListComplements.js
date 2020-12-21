import React from 'react';
import { ListItem, List, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  list: {
    padding: '0 0 10px',
  },
  listItem: {
    padding: 0,
  },
  categoryName: {
    marginRight: 10,
    minWidth: 75,
  },
  additional: {
    color: '#4CAF50',
    marginRight: 6,
    display: 'inline-block',
  },
  ingredient: {
    color: '#c53328',
    marginRight: 6,
    display: 'inline-block',
  },
  complementName: {
    display: 'inline',
    marginRight: 6,
  },
});

CartProductListComplements.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default function CartProductListComplements({ categories }) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {categories.map(category => {
        const amount = category.complements.reduce((sum, complement) => (complement.selected ? sum + 1 : sum), 0);
        let count = 0;
        return (
          <ListItem key={category.id} className={classes.listItem}>
            {category.complements.some(complement => complement.selected) && (
              <>
                <Typography variant="body2" display="inline" className={classes.categoryName}>
                  {category.name}:
                </Typography>
                <div>
                  {category.complements.map((complement, index) => {
                    count = complement.selected ? count + 1 : count;
                    return (
                      complement.selected && (
                        <div key={complement.id} style={{ display: 'inline-flex' }}>
                          <Typography className={classes.complementName} key={complement.id} variant="body2">
                            {complement.name}
                            {amount > 1 && amount !== count && <span>, </span>}
                          </Typography>
                          <div></div>
                        </div>
                      )
                    );
                  })}
                </div>
              </>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
