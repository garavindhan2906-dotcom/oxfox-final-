import CategoryManager from '@/components/admin/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
      <div className="mt-6">
        <CategoryManager />
      </div>
    </div>
  );
}
