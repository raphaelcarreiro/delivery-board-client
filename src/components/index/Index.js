import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
  },
  closedRestaurant: {
    backgroundColor: theme.palette.error.main,
    padding: 15,
    color: theme.palette.error.contrastText,
    borderRadius: 4,
    width: '100%',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 10,
    },
  },
}));

export default function Index() {
  const restaurant = useSelector(state => state.restaurant) || {};
  const classes = useStyles();

  return (
    <>
      <CustomAppbar title={restaurant.name ? restaurant.name : 'Carregando'} actionComponent={<IndexAppbarActions />} />
      <div className={classes.container}></div>
    </>
  );
}
