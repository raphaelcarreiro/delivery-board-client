import { List, makeStyles } from '@material-ui/core';
import React from 'react';
import { RestaurantAddress } from 'src/types/restaurant';
import RestaurantAddressItem from './RestaurantAddressItem';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '15px',
    columnGap: 15,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

interface RestaurantAddressListProps {
  addresses?: RestaurantAddress[];
}

const RestaurantAddressList: React.FC<RestaurantAddressListProps> = ({ addresses }) => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {addresses?.map(address => (
        <RestaurantAddressItem address={address} key={address.id} />
      ))}
    </List>
  );
};

export default RestaurantAddressList;
