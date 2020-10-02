import React, { useState, useEffect } from 'react';
import PageHeader from '../pageHeader/PageHeader';
import CustomAppbar from '../appbar/CustomAppbar';
import { api, getCancelTokenSource } from '../../services/api';
import { Grid } from '@material-ui/core';
import CategoryList from './category/CategoryList';
import MenuLoading from './MenuLoading';
import IndexAppbarActions from 'src/components/index/IndexAppbarActions';
import { useMessaging } from 'src/hooks/messaging';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleOpen } = useMessaging();
  const [productsAmount, setProductsAmount] = useState(0);

  useEffect(() => {
    const source = getCancelTokenSource();
    setLoading(true);
    let request = true;
    api
      .get('/categories', { cancelToken: source.token })
      .then(response => {
        setProductsAmount(response.data.reduce((sum, category) => sum + category.available_products_amount, 0));
        if (request) setCategories(response.data);
      })
      .catch(err => {
        if (err.response) handleOpen(err.response.data.error);
      })
      .finally(() => {
        if (request) setLoading(false);
        request = false;
      });

    return () => {
      if (request) source.cancel();
    };
  }, [handleOpen]);

  return (
    <>
      <CustomAppbar title="cardápio" actionComponent={<IndexAppbarActions />} />
      <PageHeader
        title="cardápio"
        description={
          productsAmount > 1
            ? `${productsAmount} produtos disponíveis`
            : productsAmount === 1
            ? `${productsAmount} produto disponível`
            : ''
        }
      />
      {loading ? (
        <MenuLoading />
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <CategoryList categories={categories} />
          </Grid>
        </Grid>
      )}
    </>
  );
}
