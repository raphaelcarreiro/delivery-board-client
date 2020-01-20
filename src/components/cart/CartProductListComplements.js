import React from 'react';
import { useSelector } from 'react-redux';
import { ListItem, List, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
                    if (complement.selected) {
                      count += 1;
                      return (
                        <Typography key={complement.id} display="inline" variant="body2">
                          {complement.name}
                          {amount > 1 && amount !== count && <span>, </span>}
                        </Typography>
                      );
                    }
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
