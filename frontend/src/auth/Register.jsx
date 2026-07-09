import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DEFAULT_BENEFITS = [
  { _id: '1', title: 'AI Agent Discussions', description: 'Deep dives into auto-GPT, LangChain, and agency agents.' },
  { _id: '2', title: 'n8n Workflows', description: 'Ready-to-use JSON import nodes and automation flows.' },
  { _id: '3', title: 'SaaS Building', description: 'Guides, checklists, and boilerplates for software development.' },
  { _id: '4', title: 'Free Templates', description: 'Downloadable checklists, databases, and schemas.' },
  { _id: '5', title: 'Exclusive Resources', description: 'Access premium assets locked behind membership.' },
  { _id: '6', title: 'Industry Updates', description: 'Stay ahead with newsletters about automation & tech.' }
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  // Notification Preference Checkboxes
  const [prefBlogs, setPrefBlogs] = useState(true);
  const [prefResources, setPrefResources] = useState(true);
  const [prefCaseStudies, setPrefCaseStudies] = useState(true);
  const [prefAnnouncements, setPrefAnnouncements] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const { data } = await api.get('/api/benefits');
        setBenefits(data.length > 0 ? data : DEFAULT_BENEFITS);
      } catch {
        setBenefits(DEFAULT_BENEFITS);
      }
    };
    fetchBenefits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    const extraData = {
      emailNotifications: true,
      newsletterSubscribed,
      followingAuthor: true,
      notificationPreferences: {
        blogs: prefBlogs,
        resources: prefResources,
        caseStudies: prefCaseStudies,
        announcements: prefAnnouncements
      }
    };

    const success = await register(name, email, password, extraData);
    setIsSubmitting(false);
    if (success) {
      navigate(from || '/dashboard', { replace: true });
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
        className="w-full max-w-4xl bg-bg-card/45 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl p-6 md:p-10 z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
      >
        
        {/* Left Column: Community Benefits Showcase */}
        <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
          <div>
            <div className="flex items-center gap-2 text-accent-blue text-xs font-mono uppercase tracking-wider mb-2">
              🚀 Community Hub
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary leading-tight">
              Join the Circle
            </h2>
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">
              Unlock access to exclusive tools, n8n blueprints, and collaborate with automation builders.
            </p>

            {/* List of Benefits */}
            <div className="mt-8 space-y-4">
              {benefits.slice(0, 6).map((benefit) => (
                <div key={benefit._id} className="flex items-start gap-3">
                  <div className="text-accent-blue mt-0.5">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">{benefit.title}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block mt-8 pt-4 border-t border-white/5 text-[10px] text-text-muted font-mono">
            Ashish Portfolio © 2026. Join 1,200+ automation developers.
          </div>
        </div>

        {/* Right Column: Register Form + Preferences */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Create Your Account</h3>
            <p className="text-xs text-text-secondary mt-1">Configure your content alerts and newsletters preferences below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-text-secondary text-xs font-semibold">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <User size={16} />
                </span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-text-secondary text-xs font-semibold">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-text-secondary text-xs font-semibold">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-bg-primary/50 border border-border-subtle hover:border-text-muted rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Content Preference Checkboxes */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">
                Notification Preferences
              </label>
              
              <div className="grid grid-cols-2 gap-2.5 bg-bg-primary/30 p-3.5 border border-border-subtle rounded-2xl">
                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={prefBlogs} 
                    onChange={e => setPrefBlogs(e.target.checked)} 
                    className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-blue accent-accent-blue cursor-pointer"
                  />
                  Blogs
                </label>

                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={prefResources} 
                    onChange={e => setPrefResources(e.target.checked)} 
                    className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-blue accent-accent-blue cursor-pointer"
                  />
                  Resources
                </label>

                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={prefCaseStudies} 
                    onChange={e => setPrefCaseStudies(e.target.checked)} 
                    className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-blue accent-accent-blue cursor-pointer"
                  />
                  Case Studies
                </label>

                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={prefAnnouncements} 
                    onChange={e => setPrefAnnouncements(e.target.checked)} 
                    className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-blue accent-accent-blue cursor-pointer"
                  />
                  Announcements
                </label>

                <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={newsletterSubscribed} 
                    onChange={e => setNewsletterSubscribed(e.target.checked)} 
                    className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-blue accent-accent-blue cursor-pointer"
                  />
                  Product Updates
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-blue hover:bg-blue-600 disabled:bg-accent-blue/50 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-glow-blue flex items-center justify-center gap-2 group cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-text-secondary pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-blue hover:text-blue-400 font-semibold hover:underline transition-all">
              Login
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;
