import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-products'],
    queryFn: () => api.get('/products/admin/all?limit=50').then((r) => r.data.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product removed from catalog');
      queryClient.invalidateQueries({ queryKey: ['super-admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const toggleActiveMut = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/products/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-products'] });
      toast.success('Product visibility updated');
    },
    onError: () => toast.error('Failed to update product'),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently remove this product from the platform catalog?')) {
      deleteMut.mutate(id);
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  const products = data?.data || data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-white">Catalog Oversight</h1>
        <p className="text-vexo-text-secondary text-sm mt-1">
          Monitor all products including inactive listings, stock levels, and visibility.
        </p>
      </div>

      {/* Desktop table */}
      <div className="glass-card overflow-hidden hidden md:block border-vexo-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading border-b border-vexo-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-vexo-bg-tertiary/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-vexo-bg-tertiary"
                    />
                    <div>
                      <span className="font-medium text-white block max-w-[200px] truncate">{product.name}</span>
                      {product.featured && (
                        <span className="text-[10px] text-vexo-purple font-bold uppercase">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        product.stock > 10
                          ? 'bg-vexo-green/20 text-vexo-green'
                          : product.stock > 0
                            ? 'bg-vexo-orange/20 text-vexo-orange'
                            : 'bg-vexo-pink/20 text-vexo-pink'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActiveMut.mutate({ id: product._id, isActive: !product.isActive })}
                      className={`badge border cursor-pointer transition-all ${
                        product.isActive
                          ? 'bg-vexo-green/10 text-vexo-green border-vexo-green/30 hover:bg-vexo-green/20'
                          : 'bg-vexo-pink/10 text-vexo-pink border-vexo-pink/30 hover:bg-vexo-pink/20'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-vexo-text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product: any) => (
          <div key={product._id} className="glass-card p-4 flex gap-4 items-center border-vexo-border">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover bg-vexo-bg-tertiary shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-white text-sm truncate">{product.name}</h3>
              <p className="text-xs text-vexo-text-muted mt-0.5">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-white text-sm">₹{product.price}</span>
                <span
                  className={`badge ${
                    product.stock > 10
                      ? 'bg-vexo-green/20 text-vexo-green'
                      : product.stock > 0
                        ? 'bg-vexo-orange/20 text-vexo-orange'
                        : 'bg-vexo-pink/20 text-vexo-pink'
                  }`}
                >
                  {product.stock} in stock
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(product._id)}
              className="p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors shrink-0"
            >
              <HiOutlineTrash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
