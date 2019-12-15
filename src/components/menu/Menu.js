import React, { useState, useEffect, useContext } from 'react';
import PageHeader from '../pageHeader/PageHeader';
import CustomAppbar from '../appbar/CustomAppbar';
import { api } from '../../services/api';
import { MessagingContext } from '../messaging/Messaging';
import { Grid } from '@material-ui/core';
import MenuCategoryList from './category/MenuCategoryList';
import { moneyFormat } from '../../helpers/numberFormat';
import MenuLoading from './MenuLoading';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const messaging = useContext(MessagingContext);

  useEffect(() => {
    api()
      .get('/categories')
      .then(response => {
        const categories = response.data.map(category => {
          category.products = category.products.map(product => {
            product.formattedPrice = moneyFormat(product.price);
            return product;
          });
          return category;
        });
        setCategories(categories);
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <CustomAppbar title="Cardápio" />
      <PageHeader title="Cardápio" />
      {loading ? (
        <MenuLoading />
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <MenuCategoryList categories={categories} />
          </Grid>
        </Grid>
      )}
    </>
  );
}
