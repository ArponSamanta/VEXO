import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineViewGrid, 
  HiOutlineCube, 
  HiOutlineShoppingCart, 
  HiOutlineUsers, 
  HiOutlineTag, 
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  { name: 'Dashboard', path: '/', icon: HiOutlineViewGrid },
  { name: 'Products', path: '/products', icon: HiOutlineCube },
  { name: 'Orders', path: '/orders', icon: HiOutlineShoppingCart },
  { name: 'Customers', path: '/customers', icon: HiOutlineUsers },
  { name: 'Coupons', path: '/coupons', icon: HiOutlineTag },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-vexo-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-vexo flex items-center justify-center mr-3">
          <span className="font-heading font-black text-sm">V</span>
        </div>
        <span className="font-heading font-bold text-xl tracking-wider text-white">VEXO Admin</span>
        
        {/* Close button inside sidebar for mobile */}
        <button onClick={() => setMobileMenuOpen(false)} className="ml-auto md:hidden text-vexo-text-secondary hover:text-white">
          <HiOutlineX size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-vexo-blue/10 text-vexo-blue' 
                  : 'text-vexo-text-secondary hover:bg-vexo-glass hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-vexo-blue' : 'text-vexo-text-muted'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-vexo-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-vexo-bg-tertiary flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-vexo-text-muted capitalize">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={() => { logout(); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-vexo-pink hover:bg-vexo-pink/10 rounded-lg transition-colors"
        >
          <HiOutlineLogout size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-vexo-bg overflow-hidden relative">
      
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {(mobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { x: '-100%' } : { x: 0 }}
            animate={{ x: 0 }}
            exit={typeof window !== 'undefined' && window.innerWidth < 768 ? { x: '-100%' } : { x: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-vexo-bg-secondary border-r border-vexo-border flex flex-col
                        md:relative md:flex ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col w-full h-full min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden shrink-0 h-16 bg-vexo-bg-secondary border-b border-vexo-border flex items-center px-4 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 mr-3 text-vexo-text-secondary hover:text-white focus:outline-none">
            <HiOutlineMenu size={24} />
          </button>
          <span className="font-heading font-bold text-lg text-white">VEXO Admin</span>
        </header>
        
        <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
