import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/auth/users').then(r => r.data.data)
  });

  if (isLoading) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  const customers = data || [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Customers</h1>

      {/* Desktop view: Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-vexo-text-secondary">
            <thead className="bg-vexo-bg-tertiary text-white font-heading">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vexo-border">
              {customers.map((customer: any) => (
                <tr key={customer._id} className="hover:bg-vexo-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs">
                      {customer.name[0]}
                    </div>
                    <span className="font-medium text-white">{customer.name}</span>
                  </td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`badge ${customer.role === 'admin' || customer.role === 'superadmin' ? 'bg-vexo-purple/20 text-vexo-purple' : 'bg-vexo-blue/20 text-vexo-blue'}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-vexo-blue hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-vexo-text-muted">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: Grid of Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {customers.map((customer: any) => (
          <div key={customer._id} className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white text-xs shrink-0">
                {customer.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-white block truncate">{customer.name}</span>
                <span className="text-xs text-vexo-text-muted block truncate">{customer.email}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-vexo-border/40 text-xs text-vexo-text-muted">
              <div>
                <span className="text-vexo-text-secondary mr-1">Joined:</span>
                {new Date(customer.createdAt).toLocaleDateString()}
              </div>
              <span className={`badge capitalize ${customer.role === 'admin' || customer.role === 'superadmin' ? 'bg-vexo-purple/20 text-vexo-purple' : 'bg-vexo-blue/20 text-vexo-blue'}`}>
                {customer.role}
              </span>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="glass-card p-8 text-center text-vexo-text-muted">No customers found</div>
        )}
      </div>
    </div>
  );
}
