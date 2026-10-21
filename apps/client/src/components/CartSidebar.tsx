import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlinePlus, HiOutlineMinus, HiOutlineTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export default function CartSidebar() {
  const { items, totalPrice, totalItems, isOpen, closeCart, setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/${itemId}`, { quantity }),
    onSuccess: (res) => { setCart(res.data.data); },
    onError: () => toast.error('Failed to update cart'),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/${itemId}`),
    onSuccess: (res) => { setCart(res.data.data); queryClient.invalidateQueries({ queryKey: ['cart'] }); },
    onError: () => toast.error('Failed to remove item'),
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={closeCart}
        />
      )}
      
      {isOpen && (
        <motion.div
          key="cart-sidebar"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-vexo-bg-secondary border-l border-vexo-border z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-vexo-border">
            <h2 className="font-heading font-bold text-xl">
              Cart <span className="text-vexo-text-muted text-base font-normal">({totalItems})</span>
            </h2>
            <button onClick={closeCart} aria-label="Close shopping cart" className="p-2 rounded-lg hover:bg-vexo-glass transition-colors">
              <HiOutlineX size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-vexo-text-muted text-lg mb-4">Your cart is empty</p>
                <Link to="/products" onClick={closeCart} className="btn-primary inline-block">Browse Products</Link>
              </div>
            ) : (
              items.map((item) => {
                const product = typeof item.product === 'object' ? item.product : null;
                if (!product) return null;
                return (
                  <motion.div key={item._id} layout
                    className="flex gap-4 glass-card p-3">
                    <img src={product.images?.[0] || ''} alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-vexo-bg-tertiary" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-vexo-blue font-semibold mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => item.quantity > 1 && updateMutation.mutate({ itemId: item._id, quantity: item.quantity - 1 })}
                          aria-label={`Decrease quantity for ${product.name}`}
                          className="p-1 rounded bg-vexo-glass hover:bg-vexo-glass-hover transition-colors"
                        >
                          <HiOutlineMinus size={14} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                          aria-label={`Increase quantity for ${product.name}`}
                          className="p-1 rounded bg-vexo-glass hover:bg-vexo-glass-hover transition-colors"
                        >
                          <HiOutlinePlus size={14} />
                        </button>
                        <button
                          onClick={() => removeMutation.mutate(item._id)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="p-1 rounded text-vexo-pink hover:bg-vexo-pink/10 ml-auto transition-colors"
                        >
                          <HiOutlineTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-vexo-border space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="gradient-text">{formatPrice(totalPrice)}</span>
              </div>
              {isAuthenticated ? (
                <Link to="/checkout" onClick={closeCart} className="btn-primary block text-center w-full">
                  Checkout
                </Link>
              ) : (
                <Link to="/login" onClick={closeCart} className="btn-primary block text-center w-full">
                  Sign in to Checkout
                </Link>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
