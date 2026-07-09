import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, heading, subtext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-16 text-center"
    >
      {eyebrow && (
        <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-3 block">
          — {eyebrow} —
        </span>
      )}
      <h2 className="font-display text-display font-bold text-text-primary">
        {heading}
      </h2>
      {subtext && (
        <p className="text-text-secondary mt-4 max-w-xl mx-auto">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
