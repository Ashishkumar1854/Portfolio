import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import useApi from '../hooks/useApi';

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-4">— {title} —</h2>
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
      {children}
    </div>
  </section>
);

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cs, loading, error } = useApi(`/api/case-studies/${id}`);

  if (loading) {
    return (
      <div className="container py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-bg-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !cs) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Case study not found</h2>
        <Link to="/case-studies" className="text-accent-blue hover:underline">← Back to Case Studies</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-8"
    >
      <div className="container max-w-5xl mx-auto">

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-10 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Case Studies</span>
        </button>

        {/* Hero */}
        <div className="mb-12">
          {cs.imageUrl && (
            <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-glow-blue">
              <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {cs.featured && (
              <span className="px-3 py-1 bg-accent-blue text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                Featured
              </span>
            )}
            <span className="px-3 py-1 bg-bg-elevated border border-border-subtle text-text-muted text-xs rounded-full font-mono">
              {cs.category}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            {cs.title}
          </h1>
          {cs.subtitle && (
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">{cs.subtitle}</p>
          )}

          {/* Tech stack */}
          {cs.techStack && cs.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {cs.techStack.map(t => (
                <span key={t} className="px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-full text-xs font-mono text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content sections */}
        {cs.overview && (
          <Section title="Overview">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.overview}</p>
          </Section>
        )}

        {cs.problem && (
          <Section title="Problem">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.problem}</p>
          </Section>
        )}

        {cs.research && (
          <Section title="Research">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.research}</p>
          </Section>
        )}

        {cs.architecture && (
          <Section title="Architecture">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.architecture}</p>
          </Section>
        )}

        {cs.implementation && (
          <Section title="Implementation">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.implementation}</p>
          </Section>
        )}

        {cs.results && (
          <Section title="Results">
            <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-6">
              <p className="text-text-primary leading-relaxed whitespace-pre-wrap font-medium">{cs.results}</p>
            </div>
          </Section>
        )}

        {cs.lessonsLearned && (
          <Section title="Lessons Learned">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{cs.lessonsLearned}</p>
          </Section>
        )}

        {/* Screenshots gallery */}
        {cs.screenshots && cs.screenshots.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-4">— Screenshots —</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cs.screenshots.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border-subtle shadow-card group">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      loading="lazy"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-bg-card border border-border-subtle rounded-3xl p-10 md:p-14 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Want a similar solution?
          </h3>
          <p className="text-text-secondary mb-8">Let's discuss your project and build something impactful together.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/hire"
              className="px-8 py-4 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-glow-blue flex items-center gap-2"
            >
              Book a Discovery Call <ArrowRight size={17} />
            </Link>
            <Link
              to="/case-studies"
              className="px-8 py-4 border border-border-subtle hover:border-border-active text-text-secondary hover:text-text-primary rounded-xl font-semibold transition-all"
            >
              View All Case Studies
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyDetail;
