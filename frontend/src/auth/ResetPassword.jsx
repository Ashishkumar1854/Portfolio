import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (isFinished) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFinished, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const success = await resetPassword(token, password);
    setIsSubmitting(false);

    if (success) {
      setIsFinished(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg-primary">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 md:p-10 z-10"
      >
        {!isFinished ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 rounded-xl flex items-center justify-center text-accent-blue mb-4"
              >
                <Lock size={28} />
              </motion.div>
              <h2 className="text-3xl font-display font-semibold text-text-primary text-center">Reset Password</h2>
              <p className="text-text-secondary text-sm text-center mt-2">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-text-secondary text-sm font-medium">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <Lock size={18} />
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-10 pr-12 py-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-text-secondary text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <Lock size={18} />
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-10 pr-12 py-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-blue hover:bg-blue-600 disabled:bg-accent-blue/50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 flex items-center justify-center gap-2 group mt-8 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Update Password
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-4"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <h2 className="text-2xl font-display font-semibold text-text-primary">Password Reset!</h2>
            <p className="text-text-secondary text-sm mt-3 px-2">
              Your password has been successfully updated. You will be redirected to the login page in{' '}
              <span className="text-text-primary font-medium">{countdown}s</span>.
            </p>
            <Link 
              to="/login"
              className="w-full bg-accent-blue hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 flex items-center justify-center gap-2 mt-8 cursor-pointer"
            >
              Login Now
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
