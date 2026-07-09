import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // After login: go back to where they came from, or dashboard, or admin
  const from = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result) {
      // result is the user object
      if (from) {
        navigate(from, { replace: true });
      } else if (result.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg-primary">
      {/* Decorative orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple/8 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Card */}
        <div className="bg-bg-card/50 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl p-7 sm:p-10">
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/25 rounded-2xl flex items-center justify-center text-accent-blue mb-5"
            >
              <Zap size={24} fill="currentColor" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary text-center">Welcome back</h1>
            <p className="text-text-secondary text-sm text-center mt-2 leading-relaxed">
              {from ? 'Sign in to continue downloading resources.' : 'Sign in to your account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-text-secondary text-sm font-medium">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-primary/60 border border-border-subtle hover:border-border-active rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-text-secondary text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs text-accent-blue hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-primary/60 border border-border-subtle hover:border-border-active rounded-xl pl-10 pr-12 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-blue hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-glow-blue flex items-center justify-center gap-2 group mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-7 pt-6 border-t border-border-subtle text-center text-sm text-text-secondary">
            New here?{' '}
            <Link
              to="/register"
              state={from ? { from } : undefined}
              className="text-accent-blue hover:underline font-medium transition-colors"
            >
              Create a free account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
