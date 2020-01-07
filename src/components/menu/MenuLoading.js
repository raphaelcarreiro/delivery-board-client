import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
    gridGap: 6,
  },
  listItem: {
    display: 'flex',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: 4,
    position: 'relative',
    alignItems: 'center',
    height: 100,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: '50%',
  },
  productData: {
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
    alignItems: 'flex-start',
  },
  name: {
    height: 20,
    width: '50%',
    marginBottom: 6,
  },
  description: {
    height: 20,
    width: '85%',
    marginBottom: 6,
  },
  price: {
    height: 20,
    width: 50,
  },
  categoryName: {
    height: 23,
    width: 100,
    marginTop: 5,
  },
}));

const products = Array(6).fill('');
// const categories = Array(2).fill('');

export default function MenuLoading() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {products.map((product, index) => (
          <ListItem key={index} className={classes.listItem}>
            <div className={`animated-background ${classes.img}`} />
            <div className={classes.productData}>
              <div className={`animated-background ${classes.name}`} />
              <div className={`animated-background ${classes.description}`} />
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}