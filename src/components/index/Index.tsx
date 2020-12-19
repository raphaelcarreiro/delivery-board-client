import React from 'react';
import CustomAppbar from '../appbar/CustomAppbar';
import IndexAppbarActions from './IndexAppbarActions';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../link/Link';
import { useApp } from 'src/hooks/app';
import Cover from './Cover';
import Info from './Info';
import { useSelector } from 'src/store/redux/selector';
import WorkingTime from './WorkingTime';
import PlayStoreBox from './PlayStoreBox';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  main: {
    padding: '5px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  action: {
    margin: '40px 0',
  },
}));

const Index: React.FC = () => {
  const restaurant = useSelector(state => state.restaurant);
  const app = useApp();
  const classes = useStyles({
    restaurantIsOpen: restaurant ? restaurant.is_open : false,
  });

  return (
    <>
      {restaurant && (
        <>
          {restaurant.play_store_link && app.isMobile && app.shownPlayStoreBanner && (
            <PlayStoreBox restaurant={restaurant} />
          )}
          <CustomAppbar title="início" actionComponent={<IndexAppbarActions />} />
          {restaurant && (
            <div className={classes.container}>
              <Cover restaurant={restaurant} />
              <div className={classes.main}>
                <Info restaurant={restaurant} />
                <div className={classes.action}>
                  <Button variant="contained" size="large" color="primary" component={Link} href="/menu">
                    Acessar cardápio
                  </Button>
                </div>
                <WorkingTime restaurant={restaurant} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Index;
