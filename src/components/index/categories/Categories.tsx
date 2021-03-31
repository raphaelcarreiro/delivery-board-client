import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Category } from 'src/types/category';
import CategoryList from './CategoryList';
import Link from 'next/link';
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
      <CategoryList categories={categories} />
    </div>
  );
};

export default Categories;
