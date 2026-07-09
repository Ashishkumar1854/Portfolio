import { motion } from 'framer-motion';
import useApi from '../hooks/useApi';
import journeyIllustration from '../assets/journey_illustration.png';

const colors = [
  { text: 'text-accent-blue', bg: 'bg-accent-blue/8', border: 'border-accent-blue/15', glow: 'hover:shadow-accent-blue/10 hover:border-accent-blue/30', marker: 'bg-accent-blue' },
  { text: 'text-accent-purple', bg: 'bg-accent-purple/8', border: 'border-accent-purple/15', glow: 'hover:shadow-accent-purple/10 hover:border-accent-purple/30', marker: 'bg-accent-purple' },
  { text: 'text-accent-cyan', bg: 'bg-accent-cyan/8', border: 'border-accent-cyan/15', glow: 'hover:shadow-accent-cyan/10 hover:border-accent-cyan/30', marker: 'bg-accent-cyan' },
  { text: 'text-emerald-400', bg: 'bg-emerald-400/8', border: 'border-emerald-400/15', glow: 'hover:shadow-emerald-400/10 hover:border-emerald-400/30', marker: 'bg-emerald-400' }
];

const Journey = () => {
  const { data: journeys, loading } = useApi('/api/journey');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-32 pt-16 min-h-screen relative overflow-hidden"
    >
      {/* Immersive background glow orbs */}
      <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-accent-blue/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full -z-10" />

      <div className="container max-w-5xl">
        {/* Split Grid Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 pt-8">
          <div className="lg:col-span-7 text-left">
            <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-3 block">
              — Timeline —
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              My Journey
            </h1>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-light">
              An interactive milestone map detailing my education, SaaS products, hackathons, and automation expertise. Tracing the progress from my early engineering spark to building scalable, production-ready AI agents and full-stack systems.
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group w-full max-w-[380px]"
            >
              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/15 to-accent-purple/15 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative rounded-3xl border border-border-subtle overflow-hidden z-10 shadow-glow-blue bg-bg-card">
                <img
                  src={journeyIllustration}
                  alt="Career Roadmap Path"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative mt-20">
          {/* Glowing Gradient Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-blue via-accent-purple to-accent-cyan -translate-x-1/2 hidden md:block opacity-60" />
          <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-blue via-accent-purple to-accent-cyan md:hidden opacity-60" />

          {loading ? (
            <div className="space-y-16">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center w-full relative">
                  <div className="w-5/12 h-36 bg-bg-card/50 animate-pulse rounded-3xl hidden md:block" />
                  <div className="w-8 h-8 rounded-full bg-bg-secondary animate-pulse absolute left-1/2 -translate-x-1/2 hidden md:block" />
                  <div className="w-full md:w-5/12 h-36 bg-bg-card/50 animate-pulse rounded-3xl ml-16 md:ml-0" />
                </div>
              ))}
            </div>
          ) : journeys && journeys.length > 0 ? (
            <div className="space-y-16 md:space-y-20">
              {journeys.map((item, index) => {
                const theme = colors[index % colors.length];
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
                    className={`flex flex-col md:flex-row justify-between items-center w-full relative ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Pulsing Marker */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                      <span className={`absolute inline-flex h-8 w-8 rounded-full ${theme.marker} opacity-20 animate-ping`} />
                      <div className={`relative w-4 h-4 rounded-full ${theme.marker} border-4 border-bg-primary shadow-glow`} />
                    </div>

                    {/* Empty spacer for alignment on desktop */}
                    <div className="hidden md:block w-5/12" />

                    {/* Timeline Content Card */}
                    <div className="w-full md:w-5/12 pl-16 md:pl-0">
                      <motion.div 
                        whileHover={{ y: -4, scale: 1.01 }}
                        className={`bg-gradient-to-b from-bg-card to-bg-card/60 backdrop-blur-md border border-border-subtle p-7 md:p-8 rounded-3xl shadow-card transition-all duration-300 ${theme.glow}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${theme.text} ${theme.bg} ${theme.border}`}>
                            {item.year}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono tracking-wider uppercase">
                            Milestone #{index + 1}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-display font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-text-muted py-20 bg-bg-card/20 border border-border-subtle rounded-3xl">
              Journey timeline is currently empty.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Journey;
