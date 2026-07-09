import CustomersTable from '@/components/admin/CustomersTable';

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Customers</h1>
      <div className="mt-6">
        <CustomersTable />
      </div>
    </div>
  );
}
