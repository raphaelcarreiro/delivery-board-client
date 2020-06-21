import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import InsideLoading from '../../loading/InsideLoading';
import OrdersList from './OrdersList';
import { formatDistanceStrict, parseISO, format } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { moneyFormat } from '../../../helpers/numberFormat';
import { Grid } from '@material-ui/core';
import PageHeader from '../../pageHeader/PageHeader';
import CustomAppbar from '../../appbar/CustomAppbar';
import { formatId } from 'src/helpers/formatOrderId';
import { orderStatusName } from './order/orderStatus';
import NoData from 'src/components/nodata/NoData';

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
        statusName: orderStatusName(order.shipment.shipment_method, order.status),
        shipment: {
          ...order.shipment,
          formattedScheduledAt: order.shipment.scheduled_at
            ? format(parseISO(order.shipment.scheduled_at), 'HH:mm')
            : null,
        },
      };
    });
  }

  return (
    <>
      <CustomAppbar title="Meus pedidos" />
      <PageHeader title="Meus pedidos" description="Acompanhe seus pedidos" />
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          {orders.length > 0 ? (
            <Grid container>
              <Grid item xs={12}>
                <OrdersList orders={orders} />
              </Grid>
            </Grid>
          ) : (
            <NoData message="Nenhum pedido para mostrar." />
          )}
        </>
      )}
    </>
  );
}

export default Orders;
