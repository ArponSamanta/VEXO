import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineTag, HiOutlineX } from 'react-icons/hi';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('0');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiresAt, setExpiresAt] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-coupons'],
    queryFn: () => api.get('/coupons').then((r) => r.data.data),
  });

  const createMut = useMutation({
    mutationFn: (newCoupon: Record<string, unknown>) => api.post('/coupons', newCoupon),
    onSuccess: () => {
      toast.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['super-admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      setIsModalOpen(false);
      setCode('');
      setType('percentage');
      setValue('');
      setMinPurchase('0');
      setMaxDiscount('');
      setUsageLimit('100');
      setExpiresAt('');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to create coupon'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      toast.success('Coupon deleted');
      queryClient.invalidateQueries({ queryKey: ['super-admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to delete coupon'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value || !expiresAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload: Record<string, unknown> = {
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      minPurchase: Number(minPurchase),
      usageLimit: Number(usageLimit),
      expiresAt: new Date(expiresAt).toISOString(),
    };

    if (maxDiscount) payload.maxDiscount = Number(maxDiscount);
    createMut.mutate(payload);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this coupon from the platform?')) {
      deleteMut.mutate(id);
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  const coupons = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-white">Coupon Governance</h1>
          <p className="text-vexo-text-secondary text-sm mt-1">
            Create, monitor, and revoke promotional codes across the platform.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <HiOutlinePlus /> Create Coupon
        </button>
      </div>

      {/* Desktop table */}
      <div className="glass-card overflow-hidden hidden md:block border-vexo-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading border-b border-vexo-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Min. Purchase</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {coupons.map((coupon: any) => {
                const isExpired = new Date(coupon.expiresAt) < new Date();
                return (
                  <tr key={coupon._id} className="hover:bg-vexo-bg-tertiary/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white uppercase tracking-wider">{coupon.code}</td>
                    <td className="px-6 py-4 capitalize">{coupon.type}</td>
                    <td className="px-6 py-4">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      {coupon.maxDiscount && ` (Max ₹${coupon.maxDiscount})`}
                    </td>
                    <td className="px-6 py-4">₹{coupon.minPurchase}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{coupon.usedCount}</span> / {coupon.usageLimit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${isExpired ? 'bg-vexo-pink/20 text-vexo-pink' : 'bg-vexo-green/20 text-vexo-green'}`}>
                        {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-vexo-text-muted">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {coupons.map((coupon: any) => {
          const isExpired = new Date(coupon.expiresAt) < new Date();
          return (
            <div key={coupon._id} className="glass-card p-4 space-y-3 border-vexo-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HiOutlineTag className="text-vexo-blue" size={20} />
                  <span className="font-heading font-black text-white text-base tracking-wider uppercase">{coupon.code}</span>
                </div>
                <span className={`badge ${isExpired ? 'bg-vexo-pink/20 text-vexo-pink' : 'bg-vexo-green/20 text-vexo-green'}`}>
                  {isExpired ? 'Expired' : 'Active'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-vexo-border/40 py-2">
                <div>
                  <span className="text-vexo-text-muted block">Discount</span>
                  <span className="font-semibold text-white">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                </div>
                <div>
                  <span className="text-vexo-text-muted block">Usage</span>
                  <span className="font-semibold text-white">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(coupon._id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-vexo-pink/10 border border-vexo-pink/20 text-vexo-pink rounded-lg text-xs"
              >
                <HiOutlineTrash size={14} /> Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Create coupon modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg overflow-hidden border-vexo-purple/30">
            <div className="h-16 flex items-center justify-between px-6 border-b border-vexo-border">
              <h3 className="font-heading font-bold text-lg text-white">Create Platform Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-vexo-text-secondary hover:text-white">
                <HiOutlineX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Coupon Code *</label>
                  <input
                    type="text"
                    className="input-field uppercase"
                    required
                    placeholder="e.g. PLATFORM50"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Discount Type *</label>
                  <select className="input-field bg-vexo-bg-tertiary" value={type} onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Value *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    min="1"
                    max={type === 'percentage' ? 100 : undefined}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Min. Purchase (₹)</label>
                  <input type="number" className="input-field" min="0" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Max Discount (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    disabled={type === 'fixed'}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Usage Limit</label>
                  <input type="number" className="input-field" min="1" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-vexo-text-secondary">Expiry Date *</label>
                  <input type="date" className="input-field" required value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
              </div>
              <div className="pt-4 border-t border-vexo-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">
                  Cancel
                </button>
                <button type="submit" disabled={createMut.isPending} className="btn-primary px-8">
                  {createMut.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
