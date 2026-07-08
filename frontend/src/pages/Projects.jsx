import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, ExternalLink } from 'lucide-react';
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
  const projectImage = (project) => project.thumbnail || project.imageUrl || project.ogImage;
  const projectTech = (project) => project.techStack?.length ? project.techStack : project.tech || [];
  const projectDescription = (project) => project.shortDescription || project.problem || project.overview;
  const badgeClass = 'inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated/80 px-3.5 py-1.5 text-[11px] font-mono text-text-muted shadow-sm transition-colors';
  const gridClass = filteredProjects.length === 1
    ? 'mx-auto grid max-w-3xl grid-cols-1 gap-8'
    : filteredProjects.length === 2
      ? 'mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-8'
      : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 2xl:gap-10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="relative pb-28 pt-14 min-h-screen overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent-blue/5 via-accent-purple/5 to-transparent pointer-events-none" />
      <div className="container relative">
        <SectionHeading 
          eyebrow="Portfolio"
          heading="My Projects"
          subtext="Explore my latest work, from full-stack applications to AI integrations."
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-accent-blue/40 ${
                activeFilter === cat 
                  ? 'bg-accent-purple text-white shadow-glow-purple border border-accent-purple/40' 
                  : 'bg-bg-card/80 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active hover:bg-bg-elevated/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[34rem] bg-bg-card animate-pulse rounded-[2rem]" />
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
              className={gridClass}
            >
              {filteredProjects.map((project, index) => (
                <AnimatedCard key={project._id} delay={index * 0.05} className="relative flex flex-col group h-full rounded-[2rem] border-white/10 bg-bg-card/90 hover:border-accent-blue/40 hover:shadow-[0_28px_90px_rgba(79,142,255,0.18)] transition-all duration-300 ease-out">
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <div className="p-4 pb-0">
                    <div className="aspect-[2.14/1] overflow-hidden relative rounded-[1.6rem] border border-border-subtle bg-gradient-to-br from-bg-primary via-bg-elevated/50 to-bg-primary shadow-inner">
                      {projectImage(project) ? (
                        <img
                          src={projectImage(project)}
                          alt={project.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-center scale-[0.985] transition-transform duration-300 ease-out group-hover:scale-100"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-accent-blue/10 via-bg-elevated to-accent-purple/10 flex items-center justify-center">
                          <Code2 size={38} className="text-text-muted/40" />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    <div className="absolute top-7 right-7 flex gap-2">
                        {project.featured && (
                          <span className="inline-flex items-center rounded-full border border-accent-purple/30 bg-accent-purple/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-purple shadow-lg shadow-accent-purple/10 backdrop-blur">
                            Featured
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="p-7 pt-6 flex flex-col flex-grow">
                    <div className="mb-5">
                      <div className="flex flex-wrap items-center gap-2.5 mb-4">
                        <span className="inline-flex items-center rounded-full border border-accent-blue/25 bg-accent-blue/10 px-3.5 py-1.5 text-[11px] font-mono text-accent-blue shadow-sm">
                          {project.category}
                        </span>
                        {project.projectType && (
                          <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-primary/70 px-3.5 py-1.5 text-[11px] font-mono text-text-muted shadow-sm">
                            {project.projectType}
                          </span>
                        )}
                      </div>
                      {project.slug ? (
                        <Link to={`/projects/${project.slug}`} className="block text-2xl md:text-[1.7rem] font-display font-bold leading-tight text-text-primary hover:text-accent-blue transition-colors duration-300">
                          {project.title}
                        </Link>
                      ) : (
                        <h3 className="text-2xl md:text-[1.7rem] font-display font-bold leading-tight text-text-primary">{project.title}</h3>
                      )}
                    </div>
                    <p className="text-text-secondary text-[15px] leading-7 mb-7 flex-grow line-clamp-3">{projectDescription(project)}</p>
                    <div className="flex flex-wrap gap-2.5 mt-auto">
                      {projectTech(project).slice(0, 6).map(t => (
                        <span key={t} className={`${badgeClass} group-hover:border-accent-blue/20`}>
                          {t}
                        </span>
                      ))}
                      {projectTech(project).length > 6 && (
                        <span className={badgeClass}>+{projectTech(project).length - 6}</span>
                      )}
                    </div>
                    <div className="mt-7 flex items-center justify-between gap-3 border-t border-border-subtle/70 pt-5">
                      {project.slug ? (
                        <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-4 py-2.5 text-sm font-bold text-white shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:gap-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/30">
                          View Project <ArrowRight size={15} />
                        </Link>
                      ) : <span />}
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`} className="w-11 h-11 rounded-full bg-bg-primary/85 backdrop-blur border border-border-subtle flex items-center justify-center text-text-secondary shadow-sm hover:text-accent-blue hover:border-accent-blue/40 hover:-translate-y-0.5 transition-all duration-300">
                            <FaGithub size={16} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`} className="w-11 h-11 rounded-full bg-bg-primary/85 backdrop-blur border border-border-subtle flex items-center justify-center text-text-secondary shadow-sm hover:text-accent-blue hover:border-accent-blue/40 hover:-translate-y-0.5 transition-all duration-300">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
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
