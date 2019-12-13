import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import Loading from '../../loading/Loading';
import OrderList from './OrderList';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api()
      .get('/orders')
      .then(response => {
        setOrders(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return <>{loading ? <Loading /> : <OrderList orders={orders} />}</>;
}

export default Orders;
