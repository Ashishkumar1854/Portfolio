import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, FileText, Mail, MessageSquare, PlusCircle, 
  ArrowRight, ShieldCheck, TrendingUp, Users, Activity, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';

const Dashboard = () => {
  const { data: projects } = useApi('/api/projects');
  const { data: blogs } = useApi('/api/blogs');
  const { data: hireRequests } = useApi('/api/hire');
  const { data: testimonials } = useApi('/api/testimonials');

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: <Briefcase size={22} />, color: 'text-accent-blue', bg: 'bg-accent-blue/10', trend: '+12% this month' },
    { label: 'Published Blogs', value: blogs?.length || 0, icon: <FileText size={22} />, color: 'text-accent-purple', bg: 'bg-accent-purple/10', trend: '+4 new posts' },
    { label: 'Hire Requests', value: hireRequests?.length || 0, icon: <Mail size={22} />, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', trend: '+2 pending action' },
    { label: 'Testimonials', value: testimonials?.length || 0, icon: <MessageSquare size={22} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', trend: '100% positive' },
  ];

  const quickActions = [
    { label: 'Add Project', path: '/admin/projects', icon: <Briefcase size={16} />, color: 'hover:border-accent-blue/40' },
    { label: 'Create Service', path: '/admin/services', icon: <PlusCircle size={16} />, color: 'hover:border-accent-cyan/40' },
    { label: 'Write Blog', path: '/admin/blogs', icon: <FileText size={16} />, color: 'hover:border-accent-purple/40' },
    { label: 'Edit About Profile', path: '/admin/about', icon: <Activity size={16} />, color: 'hover:border-yellow-400/40' },
  ];

  // Mock data for the visual reporting chart
  const weeklyLeads = [
    { day: 'Mon', count: 4, height: '40%' },
    { day: 'Tue', count: 6, height: '60%' },
    { day: 'Wed', count: 8, height: '80%' },
    { day: 'Thu', count: 5, height: '50%' },
    { day: 'Fri', count: 10, height: '100%' },
    { day: 'Sat', count: 3, height: '30%' },
    { day: 'Sun', count: 7, height: '70%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Welcome Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-accent-blue/15 via-accent-purple/15 to-transparent border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent-blue text-sm font-mono tracking-wider uppercase mb-1">
            <ShieldCheck size={16} /> Admin Console
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Welcome Back, Ashish!</h1>
          <p className="text-text-secondary text-sm mt-1">Here is a professional summary of your digital portfolio's performance and inquiries.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/" 
            target="_blank" 
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-text-primary text-sm font-medium rounded-xl transition-all"
          >
            Live Site <ExternalLink size={14} />
          </Link>
        </div>
      </div>
      
      {/* 4 Cards Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-bg-card/50 backdrop-blur-md border border-border-subtle hover:border-white/10 p-6 rounded-2xl shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-all`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-display font-bold text-text-primary group-hover:scale-105 transition-transform">
                {stat.value}
              </span>
            </div>
            <h3 className="text-text-secondary font-medium text-sm">{stat.label}</h3>
            <div className="flex items-center gap-1 text-[11px] text-text-muted mt-2 font-mono">
              <TrendingUp size={12} className="text-accent-green" />
              <span>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Reports & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Report Chart (2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
                <Activity size={18} className="text-accent-blue" />
                Inquiry Volume Report
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Mock analytics for weekly lead capturing</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-full font-mono">Weekly</span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-border-subtle gap-4">
            {weeklyLeads.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center group cursor-pointer">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-bg-primary text-text-primary text-[10px] py-1 px-2 rounded border border-border-subtle mb-2 font-mono">
                  {item.count} Leads
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-accent-blue/40 to-accent-blue rounded-t-lg transition-all group-hover:to-accent-cyan"
                  style={{ height: item.height }}
                />
                <span className="text-xs text-text-muted mt-3 font-mono">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border-subtle/50 text-center">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider block font-mono">Conversion</span>
              <span className="text-lg font-bold text-accent-green font-display mt-0.5 block">84.2%</span>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider block font-mono">Avg Budget</span>
              <span className="text-lg font-bold text-text-primary font-display mt-0.5 block">₹45k</span>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider block font-mono">Response Time</span>
              <span className="text-lg font-bold text-accent-purple font-display mt-0.5 block">&lt; 12h</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Metrics (1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl">
            <h2 className="text-md font-display font-bold text-text-primary mb-4">Quick Management</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((act) => (
                <Link
                  key={act.label}
                  to={act.path}
                  className={`flex flex-col items-center gap-2 p-4 bg-bg-elevated border border-border-subtle rounded-xl text-center text-xs font-semibold text-text-secondary hover:text-text-primary transition-all hover:bg-bg-elevated/80 border-transparent ${act.color}`}
                >
                  <div className="p-2 rounded-lg bg-bg-primary text-text-secondary">
                    {act.icon}
                  </div>
                  {act.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Performance status */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl flex-grow flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
              <div>
                <h4 className="text-sm font-semibold text-text-primary">System Live & Connected</h4>
                <p className="text-xs text-text-muted">MongoDB Cluster: Connected</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Row: Recent Inquiries */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
              <Mail size={18} className="text-accent-cyan" />
              Inbound Client Requests
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Recent leads requiring tracking or confirmation</p>
          </div>
          <Link 
            to="/admin/hire-requests" 
            className="text-xs text-accent-blue hover:underline flex items-center gap-1 font-semibold"
          >
            All Requests <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {hireRequests?.slice(0, 3).map((req) => (
            <div key={req._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-bg-elevated border border-border-subtle rounded-xl hover:border-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center font-bold text-accent-blue">
                  {req.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">{req.name}</h4>
                  <p className="text-xs text-text-muted">{req.email} • <span className="font-mono text-text-secondary">{req.budget}</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right sm:block hidden">
                  <span className="text-xs text-text-secondary block font-semibold">{req.serviceType}</span>
                  <span className="text-[10px] text-text-muted font-mono">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold tracking-wide uppercase ${
                  req.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                  req.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
          {(!hireRequests || hireRequests.length === 0) && (
            <div className="text-text-muted text-center py-8">No requests yet. Send a mock request from your Portfolio page to check it!</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
