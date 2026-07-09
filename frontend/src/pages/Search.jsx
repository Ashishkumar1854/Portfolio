import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, FileText, Download, ArrowRight, BriefcaseBusiness, Layers } from 'lucide-react';
import api from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState({ blogs: [], resources: [], caseStudies: [], services: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    } else {
      setResults({ blogs: [], resources: [], caseStudies: [], services: [] });
    }
  }, [queryParam]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(data);
    } catch (error) {
      console.error('Global search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  const totalResults = (results.blogs?.length || 0) + (results.resources?.length || 0) + (results.caseStudies?.length || 0) + (results.services?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen bg-bg-primary text-text-primary"
    >
      <div className="container max-w-5xl mx-auto px-4">
        <SectionHeading
          eyebrow="Global Search"
          heading="Find What You Need"
          subtext="Search across case studies, blog articles, resources, and automation templates."
        />

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-16">
          <input
            type="text"
            placeholder="Type search keywords (e.g. n8n, AI Agent, Next.js)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-bg-card/45 border border-border-subtle hover:border-border-active focus:border-accent-blue rounded-2xl py-4 pl-12 pr-28 text-base text-text-primary outline-none transition-all shadow-glow-blue/5 backdrop-blur-sm"
          />
          <span className="absolute inset-y-0 left-4 flex items-center text-text-muted">
            <SearchIcon size={20} />
          </span>
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-accent-blue hover:bg-blue-500 text-white text-sm font-semibold px-6 rounded-xl transition-all shadow-glow-blue cursor-pointer"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-text-muted">
            <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Searching the database...
          </div>
        ) : queryParam ? (
          <div className="space-y-12">
            
            {/* Search Summary */}
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
              <span className="text-sm text-text-secondary">
                Found <strong className="text-accent-blue">{totalResults}</strong> results matching "{queryParam}"
              </span>
            </div>

            {totalResults === 0 && (
              <div className="text-center py-16 bg-bg-card/20 border border-border-subtle rounded-3xl text-text-muted">
                No matching results found. Try using different keywords.
              </div>
            )}

            {/* Services Section */}
            {results.services?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Layers size={18} className="text-accent-blue" />
                  Services ({results.services.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.services.map((service) => (
                    <AnimatedCard key={service._id} className="p-6 flex flex-col justify-between h-full hover:border-accent-blue/30">
                      <div>
                        <span className="text-[10px] bg-accent-blue/10 border border-accent-blue/20 text-accent-blue px-2 py-0.5 rounded font-mono uppercase">
                          {service.category || 'Service'}
                        </span>
                        <h3 className="font-bold text-text-primary text-base mt-2 hover:text-accent-blue transition-colors">
                          <Link to={`/services/${service.slug || service._id}`}>{service.title}</Link>
                        </h3>
                        {(service.shortDescription || service.excerpt || service.overview) && (
                          <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                            {service.shortDescription || service.excerpt || service.overview}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-text-muted mt-5 border-t border-border-subtle/50 pt-3 font-mono">
                        <span>{service.pricingText || service.pricing || 'Custom scope'}</span>
                        <Link to={`/services/${service.slug || service._id}`} className="text-accent-blue flex items-center gap-0.5 font-bold">
                          View Service <ArrowRight size={10} />
                        </Link>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Section */}
            {results.resources?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Download size={18} className="text-accent-cyan" />
                  Automation & Template Resources ({results.resources.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.resources.map((res) => (
                    <AnimatedCard key={res._id} className="p-6 flex flex-col justify-between h-full hover:border-accent-cyan/30">
                      <div>
                        <span className="text-[10px] bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded font-mono uppercase">
                          {res.category}
                        </span>
                        <h3 className="font-bold text-text-primary text-base mt-2 hover:text-accent-cyan transition-colors">
                          <Link to={`/resources/${res.slug}`}>{res.title}</Link>
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                          {res.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-text-muted mt-5 border-t border-border-subtle/50 pt-3 font-mono">
                        <span>{res.downloads} downloads</span>
                        <Link to={`/resources/${res.slug}`} className="text-accent-cyan flex items-center gap-0.5 font-bold">
                          Get File <ArrowRight size={10} />
                        </Link>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs Section */}
            {results.blogs?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                  <FileText size={18} className="text-accent-purple" />
                  Blog Posts & Articles ({results.blogs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.blogs.map((blog) => (
                    <AnimatedCard key={blog._id} className="p-6 flex flex-col justify-between h-full hover:border-accent-purple/30">
                      <div>
                        <span className="text-[10px] bg-accent-purple/10 border border-accent-purple/20 text-accent-purple px-2 py-0.5 rounded font-mono uppercase">
                          Blog
                        </span>
                        <h3 className="font-bold text-text-primary text-base mt-2 hover:text-accent-purple transition-colors">
                          <Link to={`/blog/${blog.slug || blog._id}`}>{blog.title}</Link>
                        </h3>
                        {(blog.excerpt || blog.subtitle) && (
                          <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                            {blog.excerpt || blog.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-text-muted mt-5 border-t border-border-subtle/50 pt-3 font-mono">
                        <span>Published {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <Link to={`/blog/${blog.slug || blog._id}`} className="text-accent-purple flex items-center gap-0.5 font-bold">
                          Read Article <ArrowRight size={10} />
                        </Link>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            )}

            {/* Case Studies Section */}
            {results.caseStudies?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                  <BriefcaseBusiness size={18} className="text-accent-blue" />
                  Case Studies ({results.caseStudies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.caseStudies.map((item) => (
                    <AnimatedCard key={item._id} className="p-6 flex flex-col justify-between h-full hover:border-accent-blue/30">
                      <div>
                        <span className="text-[10px] bg-accent-blue/10 border border-accent-blue/20 text-accent-blue px-2 py-0.5 rounded font-mono uppercase">
                          {item.industry || item.category || 'Case Study'}
                        </span>
                        <h3 className="font-bold text-text-primary text-base mt-2 hover:text-accent-blue transition-colors">
                          <Link to={`/case-studies/${item.slug || item._id}`}>{item.title}</Link>
                        </h3>
                        {(item.excerpt || item.subtitle || item.overview) && (
                          <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                            {item.excerpt || item.subtitle || item.overview}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-text-muted mt-5 border-t border-border-subtle/50 pt-3 font-mono">
                        <span>{item.readingTime || 1} min read</span>
                        <Link to={`/case-studies/${item.slug || item._id}`} className="text-accent-blue flex items-center gap-0.5 font-bold">
                          View Study <ArrowRight size={10} />
                        </Link>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-16 bg-bg-card/10 border border-border-subtle rounded-3xl text-text-muted">
            Enter a search term above to search our resources and blogs.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
