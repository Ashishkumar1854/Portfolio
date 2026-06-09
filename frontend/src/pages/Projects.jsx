import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';
import useApi from '../hooks/useApi';

const Projects = () => {
  const { data: projects, loading } = useApi('/api/projects');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Full-Stack', 'AI/ML', 'Other'];

  const filteredProjects = projects?.filter(
    p => activeFilter === 'All' ? true : p.category === activeFilter
  ) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen"
    >
      <div className="container">
        <SectionHeading 
          eyebrow="Portfolio"
          heading="My Projects"
          subtext="Explore my latest work, from full-stack applications to AI integrations."
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat 
                  ? 'bg-accent-purple text-white shadow-glow-purple' 
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-bg-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <AnimatedCard key={project._id} delay={index * 0.05} className="flex flex-col group">
                  <div className="h-56 overflow-hidden relative border-b border-border-subtle">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-bg-primary/80 backdrop-blur border border-border-subtle flex items-center justify-center text-text-primary hover:text-accent-blue transition-colors">
                          <FaGithub size={16} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-bg-primary/80 backdrop-blur border border-border-subtle flex items-center justify-center text-text-primary hover:text-accent-blue transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-display font-bold text-text-primary">{project.title}</h3>
                      {project.featured && (
                        <span className="text-[10px] font-mono px-2 py-1 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mb-6 flex-grow">{project.problem}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tech.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded-md text-text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center text-text-muted h-64 flex items-center justify-center">
            No projects found for {activeFilter}.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
