import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-vexo-blue/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-vexo-purple/10 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-vexo flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
            <span className="font-heading font-black text-lg">V</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">Welcome Back</h1>
          <p className="text-vexo-text-secondary text-sm mt-1">Sign in to your VEXO account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" className="input-field pl-11" required id="login-email" />
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={18} />
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" className="input-field pl-11 pr-11" required id="login-password" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-vexo-text-muted hover:text-white">
              {showPass ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5" id="login-submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-vexo-text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-vexo-blue hover:underline">Create one</Link>
        </p>

        <div className="mt-6 p-4 rounded-lg bg-vexo-bg-tertiary/50 text-xs text-vexo-text-muted">
          <p className="font-medium text-vexo-text-secondary mb-1">Demo Credentials:</p>
          <p>Customer: john@example.com / password123</p>
        </div>
      </motion.div>
    </div>
  );
}
