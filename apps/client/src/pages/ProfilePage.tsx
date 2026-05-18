import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineShoppingBag, HiOutlineHeart, HiOutlineCog, HiOutlineLogout,
  HiOutlineLocationMarker, HiOutlinePlus, HiOutlineTrash, HiOutlineUser,
  HiOutlineLockClosed, HiOutlineMail, HiOutlinePhone, HiOutlineCheck,
  HiOutlineX, HiOutlineChevronRight,
} from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Tab types ────────────────────────────────────────────────
type Tab = 'overview' | 'addresses' | 'settings';

// ─── Address Form Component ──────────────────────────────────
function AddressForm({ onClose, onSaved }: { onClose: () => void; onSaved: (addrs: any[]) => void }) {
  const [form, setForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: 'India', isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/auth/address', form);
      toast.success('Address added!');
      onSaved(data.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <form onSubmit={submit} className="glass-card p-6 mt-4 border-vexo-blue/30">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-base">New Address</h3>
          <button type="button" onClick={onClose} className="text-vexo-text-muted hover:text-white transition-colors"><HiOutlineX size={20} /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Full Name *" className="input-field" required />
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone Number *" className="input-field" required />
          <input value={form.addressLine1} onChange={e => set('addressLine1', e.target.value)} placeholder="Address Line 1 *" className="input-field sm:col-span-2" required />
          <input value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)} placeholder="Address Line 2 (optional)" className="input-field sm:col-span-2" />
          <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City *" className="input-field" required />
          <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="State *" className="input-field" required />
          <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="PIN Code *" className="input-field" required />
          <input value={form.country} onChange={e => set('country', e.target.value)} placeholder="Country *" className="input-field" required />
        </div>
        <label className="flex items-center gap-2 mt-4 cursor-pointer text-sm text-vexo-text-secondary hover:text-white transition-colors">
          <input type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)} className="accent-[#00d4ff] w-4 h-4" />
          Set as default address
        </label>
        <div className="flex gap-3 mt-5">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Address'}</button>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Main Profile Page ───────────────────────────────────────
export default function ProfilePage() {
  const { isAuthenticated, user, logout, fetchUser } = useAuthStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<any[]>(user?.addresses || []);

  // Settings state
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: (user as any)?.phone || '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="section-heading mb-4">Profile</h1>
        <p className="text-vexo-text-muted mb-6">Sign in to view your profile</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  // ── Handlers ──
  const handleDeleteAddress = async (id: string) => {
    try {
      const { data } = await api.delete(`/auth/address/${id}`);
      setAddresses(data.data);
      await fetchUser();
      toast.success('Address removed');
    } catch { toast.error('Failed to remove address'); }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.put('/auth/profile', profileForm);
      await fetchUser();
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setProfileSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally { setPwSaving(false); }
  };

  const onAddressSaved = async (addrs: any[]) => {
    setAddresses(addrs);
    await fetchUser();
  };

  // ── Tab Config ──
  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: HiOutlineUser },
    { key: 'addresses', label: 'Addresses', icon: HiOutlineLocationMarker },
    { key: 'settings', label: 'Settings', icon: HiOutlineCog },
  ];

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-vexo flex items-center justify-center text-3xl font-heading font-black shadow-neon-blue">
            {user.name[0]}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-heading text-2xl font-bold">{user.name}</h1>
            <p className="text-vexo-text-secondary">{user.email}</p>
            <span className="badge bg-vexo-blue/20 text-vexo-blue mt-2 inline-block capitalize">{user.role}</span>
          </div>
          <button onClick={() => logout()} className="btn-secondary flex items-center gap-2 text-vexo-pink border-vexo-pink/30 hover:bg-vexo-pink/10">
            <HiOutlineLogout size={18} /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === t.key ? 'bg-gradient-vexo text-white shadow-glow-blue' : 'bg-vexo-glass border border-vexo-border text-vexo-text-secondary hover:text-white hover:border-vexo-border-hover'}`}>
              <t.icon size={18} />{t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ─── OVERVIEW TAB ─── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: HiOutlineShoppingBag, label: 'My Orders', path: '/orders', desc: 'Track and manage orders' },
                  { icon: HiOutlineHeart, label: 'Wishlist', path: '/wishlist', desc: 'Your saved products' },
                ].map(item => (
                  <Link key={item.label} to={item.path} className="glass-card-hover p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-vexo-blue/10 flex items-center justify-center shrink-0">
                      <item.icon size={24} className="text-vexo-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold">{item.label}</p>
                      <p className="text-sm text-vexo-text-muted">{item.desc}</p>
                    </div>
                    <HiOutlineChevronRight className="text-vexo-text-muted shrink-0" size={18} />
                  </Link>
                ))}
                <button onClick={() => setTab('addresses')} className="glass-card-hover p-6 flex items-center gap-4 text-left w-full">
                  <div className="w-12 h-12 rounded-xl bg-vexo-purple/10 flex items-center justify-center shrink-0">
                    <HiOutlineLocationMarker size={24} className="text-vexo-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold">Addresses</p>
                    <p className="text-sm text-vexo-text-muted">{addresses.length} saved address{addresses.length !== 1 && 'es'}</p>
                  </div>
                  <HiOutlineChevronRight className="text-vexo-text-muted shrink-0" size={18} />
                </button>
                <button onClick={() => setTab('settings')} className="glass-card-hover p-6 flex items-center gap-4 text-left w-full">
                  <div className="w-12 h-12 rounded-xl bg-vexo-green/10 flex items-center justify-center shrink-0">
                    <HiOutlineCog size={24} className="text-vexo-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold">Settings</p>
                    <p className="text-sm text-vexo-text-muted">Account preferences</p>
                  </div>
                  <HiOutlineChevronRight className="text-vexo-text-muted shrink-0" size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── ADDRESSES TAB ─── */}
          {tab === 'addresses' && (
            <motion.div key="addresses" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-lg">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                      <HiOutlinePlus size={16} /> Add New
                    </button>
                  )}
                </div>

                <AnimatePresence>{showAddressForm && <AddressForm onClose={() => setShowAddressForm(false)} onSaved={onAddressSaved} />}</AnimatePresence>

                {addresses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {addresses.map((addr: any) => (
                      <motion.div key={addr._id} layout className="p-5 bg-vexo-bg-tertiary/50 rounded-xl border border-vexo-border hover:border-vexo-border-hover transition-all group relative">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm">{addr.fullName}</p>
                              {addr.isDefault && <span className="badge bg-vexo-green/20 text-vexo-green text-[10px]">Default</span>}
                            </div>
                            <p className="text-sm text-vexo-text-secondary leading-relaxed">
                              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                              {addr.city}, {addr.state} {addr.postalCode}<br />
                              {addr.country}
                            </p>
                            <p className="text-xs text-vexo-text-muted mt-2 flex items-center gap-1"><HiOutlinePhone size={12} /> {addr.phone}</p>
                          </div>
                          <button onClick={() => handleDeleteAddress(addr._id)} className="text-vexo-text-muted hover:text-vexo-pink transition-colors opacity-0 group-hover:opacity-100 p-1" title="Delete address">
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : !showAddressForm && (
                  <div className="text-center py-10">
                    <HiOutlineLocationMarker size={48} className="mx-auto text-vexo-text-muted mb-3 opacity-40" />
                    <p className="text-vexo-text-muted text-sm mb-4">No addresses saved yet</p>
                    <button onClick={() => setShowAddressForm(true)} className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-1.5">
                      <HiOutlinePlus size={16} /> Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              {/* Edit Profile */}
              <div className="glass-card p-6">
                <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2"><HiOutlineUser size={20} className="text-vexo-blue" /> Edit Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                        <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="input-field pl-10" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">Phone</label>
                      <div className="relative">
                        <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                        <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="Enter phone number" className="input-field pl-10" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">Email</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                      <input value={user.email} disabled className="input-field pl-10 opacity-50 cursor-not-allowed" />
                    </div>
                    <p className="text-[11px] text-vexo-text-muted mt-1">Email cannot be changed</p>
                  </div>
                  <button type="submit" disabled={profileSaving} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                    <HiOutlineCheck size={16} />{profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="glass-card p-6">
                <h2 className="font-heading font-bold text-lg mb-5 flex items-center gap-2"><HiOutlineLockClosed size={20} className="text-vexo-purple" /> Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">Current Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                      <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter current password" className="input-field pl-10" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">New Password</label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                        <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Min 6 characters" className="input-field pl-10" required minLength={6} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary mb-1.5 block">Confirm New Password</label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={16} />
                        <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter password" className="input-field pl-10" required minLength={6} />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={pwSaving} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
                    <HiOutlineLockClosed size={16} />{pwSaving ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
