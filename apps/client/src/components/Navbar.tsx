import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems, openCart } = useCartStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-vexo-bg/80 border-b border-vexo-border">
      <nav className="page-container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-vexo flex items-center justify-center
                          shadow-glow-blue group-hover:shadow-neon-blue transition-shadow duration-300">
            <span className="font-heading font-black text-sm">V</span>
          </div>
          <span className="font-heading font-bold text-xl tracking-wider">VEXO</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className="text-vexo-text-secondary hover:text-white font-medium transition-colors relative group">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-vexo group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="p-2 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all" id="search-toggle">
            <HiOutlineSearch size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist"
            aria-label="Wishlist"
            className="p-2 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all hidden md:block">
            <HiOutlineHeart size={20} />
          </Link>

          {/* Cart */}
          <button onClick={openCart}
            aria-label="Open cart"
            className="p-2 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all relative" id="cart-toggle">
            <HiOutlineShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-vexo-blue text-xs font-bold flex items-center justify-center text-vexo-bg">
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* User */}
          {isAuthenticated ? (
            <div className="relative group">
              <button
                aria-label="User menu"
                className="p-2 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all">
                <HiOutlineUser size={20} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <p className="px-3 py-2 text-sm text-vexo-text-secondary border-b border-vexo-border mb-1">{user?.name}</p>
                <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-vexo-glass rounded-lg transition-colors">Profile</Link>
                <Link to="/orders" className="block px-3 py-2 text-sm hover:bg-vexo-glass rounded-lg transition-colors">My Orders</Link>
                <Link to="/wishlist" className="block px-3 py-2 text-sm hover:bg-vexo-glass rounded-lg transition-colors">Wishlist</Link>
                <button onClick={() => logout()} className="block w-full text-left px-3 py-2 text-sm text-vexo-pink hover:bg-vexo-glass rounded-lg transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden md:block">Sign In</Link>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="p-2 md:hidden text-vexo-text-secondary hover:text-white">
            {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-vexo-border overflow-hidden">
            <form onSubmit={handleSearch} className="page-container py-4">
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." className="input-field pl-12" autoFocus id="search-input" />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden border-t border-vexo-border overflow-hidden bg-vexo-bg-secondary">
            <div className="page-container py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all">
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="my-2 border-t border-vexo-border pt-2" />
                  <p className="px-4 py-2 text-sm text-vexo-text-muted font-medium">Logged in as {user?.name}</p>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all">Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all">My Orders</Link>
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-vexo-text-secondary hover:text-white hover:bg-vexo-glass transition-all">Wishlist</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg text-vexo-pink hover:bg-vexo-glass transition-all font-medium">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full btn-primary text-center mt-2">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
