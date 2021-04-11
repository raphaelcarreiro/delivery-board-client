import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Category } from 'src/types/category';
import CategoryList from './CategoryList';
import Link from 'next/link';
import { AnimatedBackground } from 'src/styles/animatedBackground';
import { api } from 'src/services/api';
import Slider from 'src/components/slider/Slider';
import { useApp } from 'src/hooks/app';
import CategoryItem from './CategoryItem';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
    position: 'relative',
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
  const { isMobile } = useApp();

  useEffect(() => {
    api.get<Category[]>('/categories').then(response => {
      setCategories(response.data.filter(category => category.activated));
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
        <>
          {isMobile ? (
            <CategoryList categories={categories} />
          ) : (
            <Slider amount={categories.length} itemWidth={130}>
              {categories.map(category => (
                <CategoryItem className={classes.categoryItem} key={category.id} category={category} />
              ))}
            </Slider>
          )}
        </>
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
