import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
      <div className="mt-6">
        <ProductForm productId={Number(id)} />
      </div>
    </div>
  );
}
