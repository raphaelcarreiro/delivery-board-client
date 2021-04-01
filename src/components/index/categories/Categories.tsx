import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Category } from 'src/types/category';
import CategoryList from './CategoryList';
import Link from 'next/link';
import { AnimatedBackground } from 'src/styles/animatedBackground';
import { api } from 'src/services/api';

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    '& a': {
      display: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
      marginRight: 15,
      '& a': {
        display: 'inline-block',
      },
    },
  },
  loading: {
    display: 'grid',
    columnGap: '10px',
    overflowX: 'hidden',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 15,
    },
  },
  animated: {
    height: 155,
    width: 120,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw / 3 + 30px)',
    },
  },
  categoryItem: {
    marginRight: 10,
  },
}));

const Categories: React.FC = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories').then(response => {
      setCategories(response.data);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h5">cardápio</Typography>
        <Link href="/menu">
          <a>ver todos</a>
        </Link>
      </div>
      {categories.length > 0 ? (
        <CategoryList categories={categories} />
      ) : (
        <div className={classes.loading}>
          {Array.from(Array(10).keys()).map(item => (
            <AnimatedBackground className={classes.animated} key={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
