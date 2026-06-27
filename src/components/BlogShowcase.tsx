import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, ArrowUpRight, X, Clock, Tag } from 'lucide-react';
import { BlogArticle } from '../types';
import { trackEvent } from '../utils/analytics';

export default function BlogShowcase() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (e) {
      console.error('Failed to resolve blog CMS articles streams:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleReadArticle = (art: BlogArticle) => {
    setActiveArticle(art);
    // Track reading session event in database telemetry logs
    trackEvent('project_view', `read_article: ${art.slug}`);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center font-mono text-[10px] tracking-widest text-white/40 uppercase">
        <Clock className="w-4 h-4 animate-spin mr-2" />
        <span>PARSING_CMS_ARTICLES...</span>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="w-full py-12" id="blog-showcase-container">
      {/* Chapter Title */}
      <div className="mb-16 space-y-4">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
          CH. 05 // DIGITAL INSIGHTS & ARCHITECTURE
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          CREATIVE <span className="text-glow-white text-white">INSIGHTS</span>
        </h2>
        <p className="text-xs font-sans font-light text-white/40 max-w-lg uppercase">
          Analytical publications exploring coordinate mathematics, layout timing, and high-performance frontend compilation layers.
        </p>
      </div>

      {/* Articles Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: idx * 0.15 }}
            onClick={() => handleReadArticle(article)}
            className="group border border-white/[0.05] bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] p-8 relative flex flex-col justify-between min-h-[320px] transition-all duration-500 cursor-pointer rounded-none select-none"
            data-cursor="hover"
            id={`blog-card-${article.slug}`}
          >
            {/* Ambient subtle glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none" />

            <div>
              {/* Meta information Row */}
              <div className="flex justify-between items-center mb-6 font-mono text-[8px] tracking-[0.2em] text-white/40 uppercase">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-white/30" />
                  <span>{article.category}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-white/30" />
                  <span>{article.readingTime} MINS_READ</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-white mb-4 group-hover:text-glow-white transition-all duration-300">
                {article.title}
              </h3>

              {/* Summary */}
              <p className="text-sm font-sans font-light text-white/60 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            {/* Read CTA Trigger footer */}
            <div className="pt-6 border-t border-white/[0.05] mt-6 flex justify-between items-center text-white/40 group-hover:text-white transition-colors duration-300 font-mono text-[9px] tracking-widest uppercase">
              <span>EXPLORE_PUBLICATION_TRANSMISSION</span>
              <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-screen Article overlay modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 md:p-8"
            id="blog-reader-modal"
          >
            <motion.div
              initial={{ scale: 0.96, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl bg-black border border-white/15 p-6 md:p-12 relative rounded-none overflow-hidden h-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Core header marker stripe */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40" />

              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/10 p-2 hover:bg-white/[0.05] transition-all rounded-none"
                data-cursor="magnetic"
                id="close-blog-reader"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-1 pr-2 space-y-8 mt-6">
                <div>
                  <div className="flex items-center gap-4 font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase mb-4">
                    <span>{activeArticle.category}</span>
                    <span>•</span>
                    <span>{activeArticle.readingTime} MIN READ</span>
                    <span>•</span>
                    <span>{new Date(activeArticle.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h2 className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-glow-white text-white uppercase leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>

                {activeArticle.coverImage && (
                  <div className="w-full h-48 md:h-72 overflow-hidden border border-white/[0.08]">
                    <img 
                      src={activeArticle.coverImage} 
                      alt={activeArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-75 contrast-110 hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                )}

                {/* Rendered article content */}
                <div className="prose prose-invert max-w-none text-white/75 font-sans font-light text-sm md:text-base leading-relaxed space-y-6">
                  {activeArticle.content.split('\n\n').map((block, idx) => {
                    // Primitive code rendering
                    if (block.startsWith('```')) {
                      const lines = block.split('\n');
                      const code = lines.slice(1, -1).join('\n');
                      return (
                        <pre key={idx} className="bg-white/[0.02] border border-white/[0.06] p-4 font-mono text-xs text-white/80 overflow-x-auto rounded-none leading-normal">
                          <code>{code}</code>
                        </pre>
                      );
                    }
                    // Heading 2 rendering
                    if (block.startsWith('## ')) {
                      return (
                        <h3 key={idx} className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-tight pt-4">
                          {block.replace('## ', '')}
                        </h3>
                      );
                    }
                    // General paragraph
                    return <p key={idx} className="whitespace-pre-wrap">{block}</p>;
                  })}
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6 mt-6 flex justify-between items-center font-mono text-[9px] text-white/30 uppercase">
                <span>SECTOR_INSIGHTS_STREAMS</span>
                <span>SYSTEM_ONLINE_LOCK</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
