import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Successfully logged out.');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiOutlineChartBar },
    { name: 'Administrators', path: '/admins', icon: HiOutlineShieldCheck },
    { name: 'User Directory', path: '/users', icon: HiOutlineUserGroup },
    { name: 'Orders', path: '/orders', icon: HiOutlineShoppingBag },
    { name: 'Products', path: '/products', icon: HiOutlineCube },
    { name: 'Coupons', path: '/coupons', icon: HiOutlineTag },
  ];

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="p-6 border-b border-vexo-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-vexo flex items-center justify-center font-heading font-black text-white text-sm shadow-glow-blue/20">
          Ω
        </div>
        <div>
          <h1 className="font-heading font-black text-sm tracking-wider text-white">VEXO SUPER</h1>
          <span className="text-[10px] uppercase font-bold text-vexo-purple tracking-widest">Platform Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-vexo text-white shadow-glow-blue/15'
                  : 'text-vexo-text-secondary hover:bg-vexo-glass hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-vexo-border bg-vexo-bg-secondary/40 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-white shadow-glow-blue/20">
            {user?.name?.[0] || 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Super Admin'}</p>
            <p className="text-xs text-vexo-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-vexo-border text-vexo-pink bg-vexo-pink/5 hover:bg-vexo-pink/15 transition-all text-xs font-semibold"
        >
          <HiOutlineLogout size={16} /> Logout Session
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-vexo-bg text-white flex font-body">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-vexo-border bg-vexo-bg-secondary hidden md:flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full border-r border-vexo-border bg-vexo-bg-secondary flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end p-3 border-b border-vexo-border">
              <button onClick={() => setMobileOpen(false)} className="text-vexo-text-secondary hover:text-white p-1">
                <HiOutlineX size={22} />
              </button>
            </div>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-vexo-border bg-vexo-bg-secondary/30 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <button onClick={() => setMobileOpen(true)} className="text-vexo-text-secondary hover:text-white md:hidden">
            <HiOutlineMenu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-vexo-text-secondary">
            <span>System Status:</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-vexo-green bg-vexo-green/10 px-2 py-0.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-vexo-green animate-pulse" />
              Active Online
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-vexo-text-muted hidden sm:inline-block">
              Authorization Level:
            </span>
            <span className="badge bg-vexo-purple/20 text-vexo-purple uppercase font-bold text-[10px] tracking-wider border border-vexo-purple/30">
              Level 1 (Superadmin)
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
