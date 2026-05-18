import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuthStore } from '@/stores/authStore';
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
      navigate('/');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-vexo-bg flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vexo-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vexo-blue/10 rounded-full blur-[150px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-md relative z-10 border border-vexo-border bg-vexo-bg-secondary/80 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-vexo flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
            <span className="font-heading font-black text-2xl">V</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">VEXO Control Center</h1>
          <p className="text-vexo-text-secondary text-sm mt-2">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={18} />
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin Email" 
              className="input-field pl-11" 
              required 
            />
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={18} />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" 
              className="input-field pl-11" 
              required 
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 mt-2 shadow-glow-blue">
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 p-4 rounded-lg bg-vexo-bg-tertiary border border-vexo-border text-xs text-vexo-text-muted text-center">
          <p>Admin: admin@vexo.com / password123</p>
        </div>
      </motion.div>
    </div>
  );
}
