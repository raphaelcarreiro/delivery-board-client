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
    minHeight: 120,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 4,
    flexShrink: 0,
    marginLeft: 5,
  },
  image: {
    borderRadius: 4,
    width: '100%',
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
          item.activated && (
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
                    {item.description}
                  </Typography>
                  <Typography color="textSecondary">{item.price}</Typography>
                  {item.factor && <Typography color="textSecondary">Até {item.factor} sabores</Typography>}
                </div>
                {item.image && (
                  <div className={classes.imageWrapper}>
                    <img
                      className={classes.image}
                      src={item.image.imageThumbUrl ? item.image.imageThumbUrl : item.image.imageUrl}
                      alt={item.name}
                    />
                  </div>
                )}
              </div>
            </ListItem>
          )
      )}
    </List>
  );
}
