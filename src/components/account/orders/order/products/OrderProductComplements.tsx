import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { ComplementCategory } from 'src/types/product';

type OrderProductComplementsProps = {
  complementCategories: ComplementCategory[];
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    flexDirection: 'row',
    display: 'flex',
  },
  categoryName: {
    minWidth: 70,
    marginRight: 10,
    fontWeight: 400,
  },
  complement: {
    flexDirection: 'row',
    display: 'flex',
    '& > p': {
      marginRight: 5,
    },
  },
  complementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
  },
});

const OrderProductComplements: React.FC<OrderProductComplementsProps> = ({ complementCategories }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      {complementCategories.map(category => {
        const amount = category.complements.length;
        let count = 0;
        return (
          <div key={String(category.id)} className={styles.category}>
            <Typography variant="body2" className={styles.categoryName}>
              {category.name}
            </Typography>
            <div className={styles.complementsContainer}>
              {category.complements
                .filter(complement => complement.selected)
                .map(complement => {
                  count = count + 1;
                  return (
                    <div className={styles.complement} key={complement.id}>
                      <Typography variant="body2">
                        {complement.name}
                        {amount > 1 && amount !== count && ', '}
                      </Typography>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderProductComplements;
