import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Promotion } from 'src/types/promotion';
import ActivePromotionItem from './ActivePromotionItem';

const useStyles = makeStyles(theme => ({
  ul: {
    display: 'grid',
    columnGap: '20px',
    overflowX: 'auto',
    overflowY: 'hidden',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
    },
    '& li:last-child img': {
      marginRight: 15,
    },
  },
}));

interface ActivePromotionListProps {
  promotions: Promotion[];
}

const ActivePromotionList: React.FC<ActivePromotionListProps> = ({ promotions }) => {
  const classes = useStyles();

  return (
    <ul className={classes.ul}>
      {promotions.map(promotion => (
        <ActivePromotionItem promotion={promotion} key={promotion.id} />
      ))}
    </ul>
  );
};

export default ActivePromotionList;
