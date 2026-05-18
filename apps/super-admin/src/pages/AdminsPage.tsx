import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import {
  HiOutlineUserAdd,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineUser,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['super-admin-users'],
    queryFn: () => api.get('/auth/users').then((r) => r.data.data),
  });

  // Toggle user active status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/auth/users/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      toast.success('Administrator status updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update administrator status');
    },
  });

  // Create new Admin
  const createAdminMutation = useMutation({
    mutationFn: () => api.post('/auth/users/admin', { name, email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      toast.success(`Administrator ${name} registered successfully.`);
      setName('');
      setEmail('');
      setPassword('');
      setModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to register administrator');
    },
  });

  if (isLoading) {
    return <div className="animate-pulse h-[400px] bg-vexo-bg-secondary rounded-xl" />;
  }

  const list = users || [];
  const admins = list.filter((u: any) => u.role === 'admin' || u.role === 'superadmin');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }
    createAdminMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-white">System Administrators</h1>
          <p className="text-vexo-text-secondary text-sm mt-1">
            Manage system control privileges, view active operators, and create administrators.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <HiOutlineUserAdd size={20} /> Register Administrator
        </button>
      </div>

      {/* Desktop view: Table */}
      <div className="glass-card overflow-hidden hidden md:block border-vexo-border bg-vexo-bg-secondary/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading border-b border-vexo-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Administrator</th>
                <th className="px-6 py-4">Security Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Privilege Level</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {admins.map((admin: any) => (
                <tr key={admin._id} className="hover:bg-vexo-bg-tertiary/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs shadow-glow-purple/20">
                      {admin.name[0]}
                    </div>
                    <span className="font-bold text-white">{admin.name}</span>
                  </td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge border ${
                        admin.isActive
                          ? 'bg-vexo-green/10 text-vexo-green border-vexo-green/30'
                          : 'bg-vexo-pink/10 text-vexo-pink border-vexo-pink/30'
                      }`}
                    >
                      {admin.isActive ? 'Active Operator' : 'Suspended Access'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge bg-vexo-purple/20 text-vexo-purple uppercase font-bold text-[10px]">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {admin.role === 'superadmin' ? (
                      <span className="text-xs text-vexo-text-muted italic">Unmodifiable Level-1</span>
                    ) : (
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: admin._id,
                            isActive: !admin.isActive,
                          })
                        }
                        className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg border ${
                          admin.isActive
                            ? 'text-vexo-pink border-vexo-pink/20 hover:bg-vexo-pink/10'
                            : 'text-vexo-green border-vexo-green/20 hover:bg-vexo-green/10'
                        }`}
                      >
                        {admin.isActive ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Card grid */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {admins.map((admin: any) => (
          <div key={admin._id} className="glass-card p-5 space-y-4 border-vexo-border bg-vexo-bg-secondary/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs shrink-0">
                {admin.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white block truncate">{admin.name}</span>
                <span className="text-xs text-vexo-text-muted block truncate">{admin.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-vexo-border/40 text-xs">
              <span className="badge bg-vexo-purple/20 text-vexo-purple uppercase font-bold text-[9px]">
                {admin.role}
              </span>
              <span
                className={`badge border ${
                  admin.isActive
                    ? 'bg-vexo-green/10 text-vexo-green border-vexo-green/30'
                    : 'bg-vexo-pink/10 text-vexo-pink border-vexo-pink/30'
                }`}
              >
                {admin.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>

            {admin.role !== 'superadmin' && (
              <button
                onClick={() =>
                  toggleStatusMutation.mutate({
                    id: admin._id,
                    isActive: !admin.isActive,
                  })
                }
                className={`w-full py-2 rounded-lg border text-xs font-bold transition-all text-center ${
                  admin.isActive
                    ? 'text-vexo-pink border-vexo-pink/20 hover:bg-vexo-pink/10'
                    : 'text-vexo-green border-vexo-green/20 hover:bg-vexo-green/10'
                }`}
              >
                {admin.isActive ? 'Revoke Access' : 'Restore Access'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Popup to create a new Administrator */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md bg-vexo-bg-secondary/95 border-vexo-purple/30 p-6 relative">
            <h3 className="font-heading font-black text-xl text-white mb-6 border-b border-vexo-border pb-3 flex items-center gap-2">
              <HiOutlineShieldCheck className="text-vexo-purple" /> Register Administrator
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary">
                  Operator Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-vexo-text-muted">
                    <HiOutlineUser size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    className="input-field pl-11"
                    placeholder="Admin Operator"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary">
                  Security Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-vexo-text-muted">
                    <HiOutlineMail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    className="input-field pl-11"
                    placeholder="operator@vexo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary">
                  Security Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-vexo-text-muted">
                    <HiOutlineLockClosed size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    className="input-field pl-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-vexo-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary flex-1 py-2.5 text-xs font-bold text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="btn-primary flex-1 py-2.5 text-xs font-bold text-center bg-gradient-to-r from-vexo-purple to-vexo-blue"
                >
                  {createAdminMutation.isPending ? 'Registering...' : 'Register Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
