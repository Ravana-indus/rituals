import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { OrderList } from '../../components/admin/orders/OrderList';
import { OrderDrawer } from '../../components/admin/orders/OrderDrawer';
import { useOrderContext } from '../../context/OrderContext';

export default function AdminOrders() {
  const { selectedOrderId } = useOrderContext();

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-noto-serif text-primary">Orders</h1>
        </div>
        <Link
          to="/admin/fulfillment"
          className="flex items-center gap-2 bg-surface border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-surface-container transition-colors"
        >
          <Icon name="local_shipping" className="text-sm" />
          Pack List
        </Link>
      </div>

      <OrderList />
      {selectedOrderId && <OrderDrawer />}
    </div>
  );
}
