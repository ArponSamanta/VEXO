import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Access Granted. Welcome, Super Administrator.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-vexo-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Glowing Spheres in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-vexo-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-vexo-blue/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-vexo shadow-glow-purple/40 mb-4 animate-pulse">
            <span className="font-heading font-black text-3xl tracking-wider text-white">V</span>
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tight bg-gradient-vexo bg-clip-text text-transparent">
            VEXO SUPER ADMIN
          </h1>
          <p className="text-vexo-text-secondary text-sm mt-2">
            Secure Platform Control & Governance
          </p>
        </div>

        <div className="glass-card p-8 bg-vexo-bg-secondary/40 backdrop-blur-xl shadow-2xl relative border-vexo-purple/20">
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-vexo-purple to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-vexo-text-secondary">
                Secure Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-vexo-text-muted">
                  <HiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  className="input-field pl-11"
                  required
                  placeholder="superadmin@vexo.com"
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
                  className="input-field pl-11"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center font-heading font-bold text-sm tracking-wide gap-2 bg-gradient-to-r from-vexo-purple to-vexo-blue hover:shadow-glow-purple"
            >
              {isLoading ? 'Decrypting Credentials...' : 'Authenticate'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-vexo-bg-tertiary border border-vexo-border text-xs text-vexo-text-muted text-center">
          <p>Super Admin: superadmin@vexo.com / password123</p>
        </div>

        <p className="text-center text-xs text-vexo-text-muted mt-4">
          Access restricted to level-1 platform governance authorities.
        </p>
      </div>
    </div>
  );
}
