import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    //
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    height: 20,
    width: '30%',
    marginBottom: 6,
  },
  description: {
    height: 20,
    width: '55%',
    marginBottom: 6,
  },
});

const products = Array(6).fill('');

const PlacesLoading: React.FC = () => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {products.map((product, index) => (
        <ListItem key={index} className={classes.listItem}>
          <div className={`animated-background ${classes.name}`} />
          <div className={`animated-background ${classes.description}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default PlacesLoading;
