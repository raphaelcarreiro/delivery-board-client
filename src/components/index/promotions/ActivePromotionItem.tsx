import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Promotion } from 'src/types/promotion';
import { useActivePromotions } from './hooks/useActivePromotions';

const useStyles = makeStyles({
  li: {
    position: 'relative',
    width: 250,
    height: 250,
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.01)',
    },
    transition: 'transform 0.3s ease',
  },
  image: {
    width: 250,
    height: 250,
    objectFit: 'cover',
  },
  promotionDescription: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 10,
    textShadow: '0 1px 2px #000',
  },
});

interface ActivePromotionItemProps {
  promotion: Promotion;
}

const ActivePromotionItem: React.FC<ActivePromotionItemProps> = ({ promotion }) => {
  const classes = useStyles();
  const { setSelectedPromotion } = useActivePromotions();

  return (
    <li className={classes.li} key={promotion.id} onClick={() => setSelectedPromotion(promotion)}>
      <img className={classes.image} src={promotion.image?.imageUrl} alt={promotion.name} />
      <div className={classes.promotionDescription}>
        <Typography variant="h6" color="inherit">
          {promotion.name}
        </Typography>
        <Typography variant="body2" color="inherit">
          {promotion.description}
        </Typography>
      </div>
    </li>
  );
};

export default ActivePromotionItem;
