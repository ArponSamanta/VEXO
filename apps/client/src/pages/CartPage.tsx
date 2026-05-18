import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, totalPrice, totalItems, setCart } = useCartStore();
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => { setCart(r.data.data); return r.data.data; }),
    enabled: isAuthenticated,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) => api.put(`/cart/${id}`, { quantity: qty }),
    onSuccess: (r) => setCart(r.data.data),
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => api.delete(`/cart/${id}`),
    onSuccess: (r) => { setCart(r.data.data); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
  });

  if (!isAuthenticated) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="section-heading mb-4">Your Cart</h1>
        <p className="text-vexo-text-muted mb-6">Please sign in to view your cart</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-heading mb-8">Shopping Cart ({totalItems})</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-vexo-text-muted text-lg mb-6">Your cart is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const p = typeof item.product === 'object' ? item.product : null;
              if (!p) return null;
              return (
                <motion.div key={item._id} layout className="glass-card p-4 flex gap-4">
                  <img src={p.images?.[0]} alt={p.name} className="w-24 h-24 object-cover rounded-lg bg-vexo-bg-tertiary" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${p.slug}`} className="font-heading font-semibold hover:text-vexo-blue transition-colors">{p.name}</Link>
                    <p className="text-vexo-blue font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center glass-card">
                        <button onClick={() => item.quantity > 1 && updateMut.mutate({ id: item._id, qty: item.quantity - 1 })} className="p-2"><HiOutlineMinus size={14} /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateMut.mutate({ id: item._id, qty: item.quantity + 1 })} className="p-2"><HiOutlinePlus size={14} /></button>
                      </div>
                      <span className="text-sm text-vexo-text-secondary">Subtotal: {formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeMut.mutate(item._id)} className="ml-auto p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg"><HiOutlineTrash size={18} /></button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-vexo-text-secondary">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between"><span className="text-vexo-text-secondary">Tax (18% GST)</span><span>{formatPrice(totalPrice * 0.18)}</span></div>
              <div className="flex justify-between"><span className="text-vexo-text-secondary">Shipping</span><span>{totalPrice > 500 ? <span className="text-vexo-green">Free</span> : formatPrice(49)}</span></div>
              <hr className="border-vexo-border" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="gradient-text">{formatPrice(totalPrice + totalPrice * 0.18 + (totalPrice > 500 ? 0 : 49))}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full mt-6 block text-center">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
