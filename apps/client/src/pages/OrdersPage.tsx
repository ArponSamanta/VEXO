import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  returned: 'bg-orange-500/20 text-orange-400',
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(r => r.data.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="section-heading mb-4">My Orders</h1>
        <p className="text-vexo-text-muted mb-6">Sign in to view your orders</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const orders = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  return (
    <div className="page-container py-8">
      <h1 className="section-heading mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-32 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-vexo-text-muted text-lg mb-6">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-heading font-bold">{order.orderNumber}</p>
                  <p className="text-sm text-vexo-text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusColors[order.status] || ''}`}>{order.status}</span>
                  <span className="font-bold gradient-text">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-vexo-bg-tertiary/50 rounded-lg p-2 pr-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-vexo-text-muted">x{item.quantity} · {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Status timeline */}
              {order.statusHistory && order.statusHistory.length > 1 && (
                <div className="mt-4 pt-4 border-t border-vexo-border">
                  <div className="flex gap-4 overflow-x-auto">
                    {order.statusHistory.map((sh: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs shrink-0">
                        <div className={`w-2 h-2 rounded-full ${i === order.statusHistory.length - 1 ? 'bg-vexo-blue' : 'bg-vexo-text-muted'}`} />
                        <span className="text-vexo-text-muted capitalize">{sh.status}</span>
                        {i < order.statusHistory.length - 1 && <div className="w-8 h-px bg-vexo-border" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
