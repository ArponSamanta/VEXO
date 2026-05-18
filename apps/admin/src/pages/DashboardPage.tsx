import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { HiOutlineCurrencyRupee, HiOutlineShoppingCart, HiOutlineCube, HiOutlineUsers } from 'react-icons/hi';
import api from '@/lib/api';

const mockChartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // For now, we will simulate the dashboard stats. 
      // In a real app, this would be a dedicated admin endpoint.
      const [orders, products, users] = await Promise.all([
        api.get('/orders/admin/all?limit=50').catch(() => ({ data: { data: { data: [] } } })),
        api.get('/products?limit=50').catch(() => ({ data: { data: [] } })),
        api.get('/auth/users').catch(() => ({ data: { data: [] } }))
      ]);
      
      const ordersData = orders.data?.data?.data || [];
      const totalRevenue = ordersData.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
      
      return {
        revenue: totalRevenue,
        orders: orders.data?.data?.total || ordersData.length,
        products: products.data?.data?.total || products.data?.data?.data?.length || 0,
        customers: users.data?.data?.length || 0,
        recentOrders: ordersData.slice(0, 5)
      };
    }
  });

  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-vexo-bg-secondary rounded-xl" />)}
      </div>
      <div className="h-96 bg-vexo-bg-secondary rounded-xl" />
    </div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: formatPrice(stats?.revenue || 0), icon: HiOutlineCurrencyRupee, color: 'text-vexo-green', bg: 'bg-vexo-green/10' },
    { title: 'Total Orders', value: stats?.orders || 0, icon: HiOutlineShoppingCart, color: 'text-vexo-blue', bg: 'bg-vexo-blue/10' },
    { title: 'Products', value: stats?.products || 0, icon: HiOutlineCube, color: 'text-vexo-purple', bg: 'bg-vexo-purple/10' },
    { title: 'Customers', value: stats?.customers || 0, icon: HiOutlineUsers, color: 'text-vexo-pink', bg: 'bg-vexo-pink/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-vexo-text-muted">Last 7 Days</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-start justify-between">
            <div>
              <p className="text-vexo-text-secondary text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="font-heading font-semibold text-lg mb-6">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b6b80" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b6b80" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00d4ff' }}
                  formatter={(value: number) => [formatPrice(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00d4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold text-lg mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {stats?.recentOrders.length === 0 ? (
              <p className="text-sm text-vexo-text-muted">No recent orders</p>
            ) : (
              stats?.recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between pb-4 border-b border-vexo-border last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-vexo-text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-vexo-blue">{formatPrice(order.totalPrice)}</p>
                    <span className="text-[10px] uppercase font-bold text-vexo-text-secondary">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
