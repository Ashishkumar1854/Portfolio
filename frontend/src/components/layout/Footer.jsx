import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle pt-16 pb-8 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-display font-bold text-text-primary tracking-tight mb-4 inline-block">
              Ashish<span className="text-accent-blue">.</span>
            </Link>
            <p className="text-text-secondary max-w-sm mb-6">
              Building premium, scalable, and dynamic web experiences. Bridging the gap between design and engineering.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Ashish1854" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://linkedin.com/in/ashishkumar" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-blue transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="mailto:contact@ashishportfolio.aigateway.in" className="text-text-muted hover:text-accent-blue transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-accent-blue transition-colors">About Me</Link></li>
              <li><Link to="/projects" className="hover:text-accent-blue transition-colors">Projects</Link></li>
              <li><Link to="/skills" className="hover:text-accent-blue transition-colors">Skills</Link></li>
              <li><Link to="/blog" className="hover:text-accent-blue transition-colors">Blog</Link></li>
              <li><Link to="/resources" className="hover:text-accent-blue transition-colors">Resources</Link></li>
              <li>
                <a 
                  href={import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-accent-blue transition-colors"
                >
                  Join Community
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Let's Connect</h4>
            <p className="text-sm text-text-secondary mb-4">
              Open for opportunities and collaborations. Let's build something amazing together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/hire" className="inline-block px-4 py-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-md hover:bg-accent-blue hover:text-white transition-all text-sm font-medium">
                Hire Me
              </Link>
              <a 
                href={import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500 hover:text-white transition-all text-sm font-medium"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Ashish Kumar. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-text-secondary transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
