import OrdersTable from '@/components/admin/OrdersTable';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
      <div className="mt-6">
        <OrdersTable />
      </div>
    </div>
  );
}
