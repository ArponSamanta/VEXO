import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { HiOutlineSearch, HiOutlineUserRemove, HiOutlineUserAdd } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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
      toast.success('Customer status updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update user status');
    },
  });

  // Toggle user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.put(`/auth/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
      toast.success('User privileges changed successfully.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to change user privileges');
    },
  });

  if (isLoading) {
    return <div className="animate-pulse h-[400px] bg-vexo-bg-secondary rounded-xl" />;
  }

  const list = users || [];

  // Filter out superadmins so we don't accidentally edit governance structures
  const filteredUsers = list.filter((u: any) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;

    return matchesSearch && matchesRole && u.role !== 'superadmin';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-white">Platform Customer Directory</h1>
        <p className="text-vexo-text-secondary text-sm mt-1">
          Search all registered customer accounts, suspend users, or promote customer privileges.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-vexo-text-muted">
            <HiOutlineSearch size={18} />
          </span>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="input-field w-full sm:w-48 bg-vexo-bg-secondary text-white font-body"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Desktop view: Table */}
      <div className="glass-card overflow-hidden hidden md:block border-vexo-border bg-vexo-bg-secondary/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading border-b border-vexo-border">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Customer Account</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Privilege</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {filteredUsers.map((user: any) => (
                <tr key={user._id} className="hover:bg-vexo-bg-tertiary/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs shadow-glow-blue/20">
                      {user.name[0]}
                    </div>
                    <span className="font-bold text-white">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge border ${
                        user.isActive
                          ? 'bg-vexo-green/10 text-vexo-green border-vexo-green/30'
                          : 'bg-vexo-pink/10 text-vexo-pink border-vexo-pink/30'
                      }`}
                    >
                      {user.isActive ? 'Active User' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="bg-vexo-bg-tertiary border border-vexo-border rounded-lg text-xs font-bold text-white px-2.5 py-1.5 outline-none focus:border-vexo-blue"
                      value={user.role}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRoleMutation.mutate({ id: user._id, role: e.target.value })}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          id: user._id,
                          isActive: !user.isActive,
                        })
                      }
                      className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg border ${
                        user.isActive
                          ? 'text-vexo-pink border-vexo-pink/20 hover:bg-vexo-pink/10'
                          : 'text-vexo-green border-vexo-green/20 hover:bg-vexo-green/10'
                      }`}
                    >
                      {user.isActive ? 'Suspend' : 'Unsuspend'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-vexo-text-muted">
                    No customers found matching queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Card grid */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map((user: any) => (
          <div key={user._id} className="glass-card p-5 space-y-4 border-vexo-border bg-vexo-bg-secondary/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs shrink-0">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white block truncate">{user.name}</span>
                <span className="text-xs text-vexo-text-muted block truncate">{user.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-vexo-border/40 text-xs">
              <div>
                <span className="text-vexo-text-muted block">Joined:</span>
                <span className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-vexo-text-muted block">Status:</span>
                <span
                  className={`badge border mt-0.5 inline-block ${
                    user.isActive
                      ? 'bg-vexo-green/10 text-vexo-green border-vexo-green/30'
                      : 'bg-vexo-pink/10 text-vexo-pink border-vexo-pink/30'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  className="w-full bg-vexo-bg-tertiary border border-vexo-border rounded-lg text-xs font-bold text-white py-2 px-2.5 outline-none"
                  value={user.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRoleMutation.mutate({ id: user._id, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={() =>
                  toggleStatusMutation.mutate({
                    id: user._id,
                    isActive: !user.isActive,
                  })
                }
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all text-center ${
                  user.isActive
                    ? 'text-vexo-pink border-vexo-pink/20 hover:bg-vexo-pink/10'
                    : 'text-vexo-green border-vexo-green/20 hover:bg-vexo-green/10'
                }`}
              >
                {user.isActive ? 'Suspend' : 'Unsuspend'}
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="glass-card p-8 text-center text-vexo-text-muted">No accounts found.</div>
        )}
      </div>
    </div>
  );
}
