import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 pb-12">
      <div className="container max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent-blue/10 blur-[100px] rounded-full -z-10" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 text-accent-blue/20 mx-auto mb-8 flex items-center justify-center"
          >
            <Compass size={120} />
          </motion.div>
          
          <h1 className="font-display font-bold text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-bg-card border border-border-subtle hover:bg-bg-elevated hover:border-accent-blue text-text-primary hover:text-accent-blue rounded-xl transition-all shadow-card hover:shadow-glow-blue font-medium"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
