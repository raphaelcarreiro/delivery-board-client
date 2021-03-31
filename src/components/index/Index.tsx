import React, { Fragment } from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { makeStyles } from '@material-ui/core/styles';
import Cover from './Cover';
import Info from './Info';
import { useSelector } from 'src/store/redux/selector';
import WorkingTime from './WorkingTime';
import Promotions from './promotions/ActivePromotions';
import Offers from './offers/Offers';
import Categories from './categories/Categories';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  action: {
    margin: '40px 0',
  },
  installApp: {
    position: 'fixed',
    bottom: -100,
    right: 0,
    left: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    zIndex: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'bottom 0.3s ease 6s',
    '& span': {
      maxWidth: 160,
    },
  },
  playStoreImg: {
    width: 120,
  },
});

const Index: React.FC = () => {
  const restaurant = useSelector(state => state.restaurant);
  const classes = useStyles({
    restaurantIsOpen: restaurant ? restaurant.is_open : false,
  });

  if (!restaurant) return <Fragment />;

  return (
    <>
      <CustomAppbar title="início" actionComponent={<IndexAppbarActions />} />
      <div className={classes.container}>
        <Cover restaurant={restaurant} />
        <div className={classes.main}>
          <Info restaurant={restaurant} />
          <Categories />
          <Offers />
          <Promotions />
          <WorkingTime restaurant={restaurant} />
        </div>
      </div>
    </>
  );
};

export default Index;
