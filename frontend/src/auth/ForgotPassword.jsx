import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await forgotPassword(email);
    setIsSubmitting(false);
    if (success) {
      setIsSent(true);
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
        {!isSent ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 rounded-xl flex items-center justify-center text-accent-blue mb-4"
              >
                <KeyRound size={28} />
              </motion.div>
              <h2 className="text-3xl font-display font-semibold text-text-primary text-center">Forgot Password</h2>
              <p className="text-text-secondary text-sm text-center mt-2 px-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-text-secondary text-sm font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <Mail size={18} />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all"
                    required
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
                  'Send Reset Link'
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
            <h2 className="text-2xl font-display font-semibold text-text-primary">Check Your Email</h2>
            <p className="text-text-secondary text-sm mt-3 px-2">
              If an account exists for <span className="text-text-primary font-medium">{email}</span>, we have sent instructions to reset your password.
            </p>
            <div className="w-full mt-8 bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-text-muted">
              Didn't receive the email? Check your spam folder or try requesting another link.
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
