import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import {
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineCurrencyRupee,
  HiOutlineTag,
} from 'react-icons/hi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const formatPrice = (p: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  processing: 'text-purple-400',
  shipped: 'text-cyan-400',
  delivered: 'text-vexo-green',
  cancelled: 'text-vexo-pink',
  confirmed: 'text-vexo-blue',
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data.data),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['super-admin-revenue-chart'],
    queryFn: () => api.get('/admin/revenue-chart').then((r) => r.data.data),
  });

  if (statsLoading || chartLoading) {
    return <div className="animate-pulse h-[500px] bg-vexo-bg-secondary rounded-xl" />;
  }

  const pieData = [
    { name: 'Super Admins', value: stats?.totalSuperadmins ?? 0, color: '#7b2ff7' },
    { name: 'Admins', value: stats?.totalAdmins ?? 0, color: '#00d4ff' },
    { name: 'Customers', value: stats?.totalCustomers ?? 0, color: '#00ff88' },
  ];

  const statCards = [
    {
      name: 'Platform Revenue',
      value: formatPrice(stats?.totalRevenue ?? 0),
      icon: HiOutlineCurrencyRupee,
      color: 'text-vexo-green bg-vexo-green/10 border-vexo-green/20',
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: HiOutlineShoppingBag,
      color: 'text-vexo-pink bg-vexo-pink/10 border-vexo-pink/20',
      sub: stats?.pendingOrders ? `${stats.pendingOrders} pending` : undefined,
    },
    {
      name: 'Products',
      value: stats?.totalProducts ?? 0,
      icon: HiOutlineCube,
      color: 'text-vexo-green bg-vexo-green/10 border-vexo-green/20',
      sub: stats?.lowStockProducts ? `${stats.lowStockProducts} low stock` : undefined,
    },
    {
      name: 'Total Accounts',
      value: stats?.totalUsers ?? 0,
      icon: HiOutlineUserGroup,
      color: 'text-vexo-blue bg-vexo-blue/10 border-vexo-blue/20',
    },
    {
      name: 'System Admins',
      value: (stats?.totalAdmins ?? 0) + (stats?.totalSuperadmins ?? 0),
      icon: HiOutlineShieldCheck,
      color: 'text-vexo-purple bg-vexo-purple/10 border-vexo-purple/20',
    },
    {
      name: 'Active Coupons',
      value: stats?.totalCoupons ?? 0,
      icon: HiOutlineTag,
      color: 'text-vexo-blue bg-vexo-blue/10 border-vexo-blue/20',
    },
  ];

  const recentOrders = stats?.recentOrders ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-vexo-text-secondary text-sm mt-1">
          Real-time platform metrics, revenue trends, and governance summaries.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((s) => (
          <div key={s.name} className={`glass-card p-6 flex items-center justify-between border ${s.color}`}>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary">{s.name}</span>
              <p className="font-heading font-black text-2xl text-white">{s.value}</p>
              {s.sub && <p className="text-xs text-vexo-text-muted">{s.sub}</p>}
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-black/30">
              <s.icon size={26} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie chart */}
        <div className="glass-card p-6 bg-vexo-bg-secondary/40 backdrop-blur-md lg:col-span-1 border-vexo-border">
          <h3 className="font-heading font-bold text-lg mb-6 border-b border-vexo-border pb-3">Account Distribution</h3>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue area chart */}
        <div className="glass-card p-6 bg-vexo-bg-secondary/40 backdrop-blur-md lg:col-span-2 border-vexo-border">
          <h3 className="font-heading font-bold text-lg mb-6 border-b border-vexo-border pb-3">
            Revenue & Orders (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData ?? []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b2ff7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7b2ff7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b6b80" fontSize={11} />
                <YAxis stroke="#6b6b80" fontSize={11} tickFormatter={(v: number) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) =>
                    name === 'revenue' ? [formatPrice(value), 'Revenue'] : [value, 'Orders']
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7b2ff7"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6 border-vexo-border">
        <div className="flex items-center justify-between mb-6 border-b border-vexo-border pb-3">
          <h3 className="font-heading font-bold text-lg">Recent Orders</h3>
          <Link to="/orders" className="text-xs font-semibold text-vexo-blue hover:text-vexo-purple transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-vexo-text-muted text-center py-4">No orders yet</p>
          ) : (
            recentOrders.map((order: any) => (
              <div
                key={order._id}
                className="flex items-center justify-between pb-4 border-b border-vexo-border last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                  <p className="text-xs text-vexo-text-muted mt-0.5">
                    {order.user?.name || 'Unknown'} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-vexo-blue">{formatPrice(order.totalPrice)}</p>
                  <span className={`text-[10px] uppercase font-bold ${statusColors[order.status] || 'text-vexo-text-secondary'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
