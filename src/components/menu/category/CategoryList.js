import React from 'react';
import { Typography, List, ListItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'src/components/link/Link';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: 6,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 9px 1px #eee',
    borderRadius: 4,
    height: 110,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  categoryIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 90,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 4,
    border: `2px solid #fff`,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
}));

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default function CategoryList({ categories }) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {categories.map(
        item =>
          item.productsAmount > 0 && (
            <ListItem
              href={'/menu/[url]'}
              key={item.name + item.description + item.id}
              className={classes.listItem}
              button
              as={`/menu/${item.url}`}
              component={Link}
            >
              <div className={classes.content}>
                <div>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.productsAmount === 1 ? `${item.productsAmount} produto` : `${item.productsAmount} produtos`}
                  </Typography>
                  <Typography color="textSecondary">{item.price}</Typography>
                  {item.factor && <Typography color="textSecondary">Até {item.factor} sabores</Typography>}
                </div>
                <div className={classes.categoryIcon}>
                  <img className={classes.image} src={item.image && item.image.imageUrl} alt={item.name} />
                </div>
              </div>
            </ListItem>
          )
      )}
    </List>
  );
}
