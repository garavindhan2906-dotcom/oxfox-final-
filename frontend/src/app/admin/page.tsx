import AdminCalendar from '@/components/admin/AdminCalendar';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Daily visit counts across the site.</p>
      <div className="mt-6 max-w-4xl">
        <AdminCalendar />
      </div>
    </div>
  );
}
