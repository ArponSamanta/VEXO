import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
};

const paymentColors: Record<string, string> = {
  paid: 'text-vexo-green',
  pending: 'text-yellow-400',
  failed: 'text-vexo-pink',
  refunded: 'text-vexo-text-muted',
};

const formatPrice = (p: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-orders', filter],
    queryFn: () =>
      api.get(`/orders/admin/all${filter !== 'all' ? `?status=${filter}&limit=50` : '?limit=50'}`).then((r) => r.data.data),
  });

  const updateStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/orders/admin/${id}/status`, { status, note: 'Updated by super admin' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('Order status updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update order'),
  });

  if (isLoading) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  const orders = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-white">Platform Orders</h1>
        <p className="text-vexo-text-secondary text-sm mt-1">
          Global order oversight across all customers and payment methods.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all shrink-0 ${
              filter === f
                ? 'bg-gradient-vexo text-white shadow-glow-purple/20'
                : 'bg-vexo-bg-tertiary text-vexo-text-secondary hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="glass-card overflow-hidden hidden md:block border-vexo-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading border-b border-vexo-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-vexo-bg-tertiary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.orderNumber || order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <p className="text-white">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-vexo-text-muted">{order.user?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-vexo-blue">{formatPrice(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold uppercase ${paymentColors[order.paymentStatus] || ''}`}>
                      {order.paymentStatus}
                    </span>
                    <p className="text-[10px] text-vexo-text-muted mt-0.5 uppercase">{order.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusColors[order.status] || ''}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="input-field text-xs py-1.5 w-32"
                      value={order.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateStatusMut.mutate({ id: order._id, status: e.target.value })}
                      disabled={updateStatusMut.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-vexo-text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order: any) => (
          <div key={order._id} className="glass-card p-4 space-y-3 border-vexo-border">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-white text-sm">
                {order.orderNumber || order._id.slice(-8)}
              </span>
              <span className="text-xs text-vexo-text-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-start text-xs border-t border-b border-vexo-border/40 py-2">
              <div>
                <p className="font-medium text-white">{order.user?.name || 'Unknown'}</p>
                <p className="text-vexo-text-muted mt-0.5">{order.user?.email || ''}</p>
              </div>
              <div className="text-right">
                <span className="font-medium text-sm text-vexo-blue block">{formatPrice(order.totalPrice)}</span>
                <span className={`badge inline-block mt-1 ${statusColors[order.status] || ''}`}>{order.status}</span>
              </div>
            </div>
            <select
              className="input-field text-xs py-1.5 w-full"
              value={order.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateStatusMut.mutate({ id: order._id, status: e.target.value })}
              disabled={updateStatusMut.isPending}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="glass-card p-8 text-center text-vexo-text-muted">No orders found</div>
        )}
      </div>
    </div>
  );
}
