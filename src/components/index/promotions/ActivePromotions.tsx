import { makeStyles, Typography } from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'src/store/redux/selector';
import { Promotion } from 'src/types/promotion';
import ActivePromotionList from './ActivePromotionList';
import { ActivePromotionsProvider } from './hooks/useActivePromotions';
import PromotionDetail from './PromotionDetail';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
    },
  },
}));

const ActivePromotions: React.FC = () => {
  const classes = useStyles();
  const promotions = useSelector(state => state.promotions);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  if (!promotions || promotions.length === 0) return <Fragment />;

  return (
    <ActivePromotionsProvider value={{ selectedPromotion, setSelectedPromotion }}>
      {selectedPromotion && <PromotionDetail />}
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography>promoções</Typography>
        </div>
        <ActivePromotionList promotions={promotions} />
      </div>
    </ActivePromotionsProvider>
  );
};

export default ActivePromotions;
