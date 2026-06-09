import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`
        bg-bg-card/80 backdrop-blur-glass
        border border-border-subtle
        rounded-2xl overflow-hidden
        shadow-card hover:shadow-card-hover
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
