import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../../services/api';
import Loading from '../../loading/Loading';
import OrderList from './OrderList';
import { formatDistanceStrict, parseISO, format } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { moneyFormat } from '../../../helpers/numberFormat';
import { Grid } from '@material-ui/core';
import PageHeader from '../../pageHeader/PageHeader';
import CustomAppbar from '../../appbar/CustomAppbar';
import { formatId } from 'src/helpers/formatOrderId';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api()
      .get('/orders')
      .then(response => {
        setOrders(handleSetOrders(response.data.data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleSetOrders(orders) {
    return orders.map(order => {
      const date = parseISO(order.created_at);
      return {
        ...order,
        formattedId: formatId(order.id),
        formattedTotal: moneyFormat(order.total),
        formattedDate: format(date, "PP 'às' p", { locale: ptbr }),
        dateDistance: formatDistanceStrict(date, new Date(), { locale: ptbr, roundingMethod: 'ceil' }),
      };
    });
  }

  return (
    <>
      <CustomAppbar title="Meus pedidos" />
      {loading ? (
        <Loading />
      ) : (
        <Grid container>
          <PageHeader title="Meus pedidos" description="Acompanhe seus pedidos" />
          <Grid item xs={12}>
            <OrderList orders={orders} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Orders;
