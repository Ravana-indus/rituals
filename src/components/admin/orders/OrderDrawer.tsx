import React from 'react';
import { useOrderContext } from '../../../context/OrderContext';
import OrderDetail from '../OrderDetail';

export function OrderDrawer() {
  const { selectedOrderId, setSelectedOrderId } = useOrderContext();

  if (!selectedOrderId) return null;

  return (
    <OrderDetail
      orderId={selectedOrderId}
      onClose={() => setSelectedOrderId(null)}
    />
  );
}
