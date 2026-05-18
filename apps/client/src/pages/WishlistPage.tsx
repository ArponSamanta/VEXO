import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';

const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { setCart, openCart } = useCartStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => api.delete(`/wishlist/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['wishlist'] }); toast.success('Removed from wishlist'); },
  });

  const addCartMut = useMutation({
    mutationFn: (id: string) => api.post('/cart', { productId: id, quantity: 1 }),
    onSuccess: (r) => { setCart(r.data.data); openCart(); toast.success('Added to cart!'); },
  });

  if (!isAuthenticated) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="section-heading mb-4">Wishlist</h1>
        <p className="text-vexo-text-muted mb-6">Sign in to view your wishlist</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="page-container py-8">
      <h1 className="section-heading mb-8">My Wishlist ({products.length})</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card aspect-square animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-vexo-text-muted text-lg mb-6">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden group">
              <Link to={`/products/${product.slug}`} className="block aspect-square bg-vexo-bg-tertiary overflow-hidden">
                <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-sm truncate">{product.name}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-vexo-blue font-bold">{formatPrice(product.price)}</span>
                  {product.comparePrice && <span className="text-xs text-vexo-text-muted line-through">{formatPrice(product.comparePrice)}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addCartMut.mutate(product._id)} className="btn-primary flex-1 py-2 text-xs">Add to Cart</button>
                  <button onClick={() => removeMut.mutate(product._id)} className="p-2 glass-card text-vexo-pink hover:bg-vexo-pink/10"><HiOutlineTrash size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
