import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products?limit=50').then(r => r.data.data) // Fixed to match max limit 50 in Zod
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error('Failed to delete product')
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMut.mutate(id);
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="btn-primary flex items-center gap-2">
          <HiOutlinePlus /> Add Product
        </Link>
      </div>

      {/* Desktop view: Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-vexo-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-vexo-bg-tertiary" />
                    <span className="font-medium text-white max-w-[200px] truncate">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${product.stock > 10 ? 'bg-vexo-green/20 text-vexo-green' : product.stock > 0 ? 'bg-vexo-orange/20 text-vexo-orange' : 'bg-vexo-pink/20 text-vexo-pink'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/products/edit/${product._id}`} className="p-2 inline-block text-vexo-blue hover:bg-vexo-blue/10 rounded-lg transition-colors">
                      <HiOutlinePencilAlt size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors">
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-vexo-text-muted">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Grid of Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product: any) => (
          <div key={product._id} className="glass-card p-4 flex gap-4 items-center">
            <img src={product.images?.[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-vexo-bg-tertiary shrink-0 animate-glow-blue" />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-white text-sm truncate">{product.name}</h3>
              <p className="text-xs text-vexo-text-muted mt-0.5">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-white text-sm">₹{product.price}</span>
                <span className={`badge ${product.stock > 10 ? 'bg-vexo-green/20 text-vexo-green' : product.stock > 0 ? 'bg-vexo-orange/20 text-vexo-orange' : 'bg-vexo-pink/20 text-vexo-pink'}`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-l border-vexo-border pl-3 shrink-0">
              <Link to={`/products/edit/${product._id}`} className="p-2 inline-block text-vexo-blue hover:bg-vexo-blue/10 rounded-lg transition-colors">
                <HiOutlinePencilAlt size={18} />
              </Link>
              <button onClick={() => handleDelete(product._id)} className="p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors">
                <HiOutlineTrash size={18} />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="glass-card p-8 text-center text-vexo-text-muted">No products found</div>
        )}
      </div>
    </div>
  );
}
