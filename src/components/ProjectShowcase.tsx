import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Cpu, Zap, Eye, X, CheckCircle } from 'lucide-react';
import { Project } from '../types';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'aura',
    title: 'AURA SYNTHESIZER',
    description: 'An interactive browser audio engine and spatial soundscape generator mapping diaphragmatic breathing loops to real-time vector visuals.',
    category: 'AUDIO EXPERIMENT',
    specs: ['Web Audio API', 'React 19 Hooks', 'Motion Springs', 'SVG Math Matrix'],
    tags: ['Acoustics', 'Canvas', 'Interactive'],
    date: '2026',
    stats: [
      { label: 'OSCILLATION LATENCY', value: '1.2ms' },
      { label: 'VECTOR COMPILATION', value: '144 FPS' },
      { label: 'COMPLIANCE RATIO', value: '100%' }
    ],
    accentColor: 'rgba(255, 255, 255, 0.4)'
  },
  {
    id: 'nexus',
    title: 'NEXUS TERMINAL',
    description: 'A light-speed local server monitor and remote execution hub supporting real-time process monitoring, secure socket channels, and custom terminal logs.',
    category: 'SYSTEMS PLATFORM',
    specs: ['Node.js Stream API', 'Express Router', 'WS Sockets', 'TypeScript strict'],
    tags: ['Shell', 'Real-time', 'Distributed'],
    date: '2025',
    stats: [
      { label: 'SOCKET HANDSHAKE', value: '4ms' },
      { label: 'THROUGHPUT RATIO', value: '12GB/s' },
      { label: 'SECURITY SHIELD', value: 'AES-256' }
    ],
    accentColor: 'rgba(255, 255, 255, 0.3)'
  },
  {
    id: 'chronos',
    title: 'CHRONOS SPATIAL CALENDAR',
    description: 'A spatial UI experiment representing time as concentric circles, allowing fluid calendar navigation, coordinate-based event scheduling, and local sync.',
    category: 'PRODUCT DESIGN',
    specs: ['React Context', 'LocalStorage DB', 'Physics Drag Physics', 'Tailwind CSS v4'],
    tags: ['Spatial UI', 'Chronometry', 'Ergonomic'],
    date: '2026',
    stats: [
      { label: 'DRAG FRICTION INDEX', value: '0.12' },
      { label: 'DATABASE SPEED', value: '0.05ms' },
      { label: 'AESTHETIC RANKING', value: '9.9/10' }
    ],
    accentColor: 'rgba(255, 255, 255, 0.5)'
  }
];

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // Fallback silently to static data in case of any network delay
      });
  }, []);

  return (
    <div className="w-full" id="projects-grid-section">
      {/* Luxury Curated List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            onClick={() => setActiveProject(project)}
            className="group glass-panel rounded-none p-8 border border-white/[0.05] hover:border-white/20 transition-all duration-500 flex flex-col justify-between h-[420px] relative overflow-hidden select-none"
            data-cursor="hover"
            id={`project-card-${project.id}`}
          >
            {/* Top glass reflection gradient lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

            <div>
              {/* Card Meta Row */}
              <div className="flex justify-between items-center mb-6 font-mono text-[9px] tracking-widest text-white/40">
                <span>{project.category}</span>
                <span>[{project.date}]</span>
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white mb-4 group-hover:text-glow-white transition-all duration-500">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-sans font-light text-white/60 leading-relaxed line-clamp-4">
                {project.description}
              </p>
            </div>

            {/* Tags and Visual CTA Trigger */}
            <div className="pt-6 border-t border-white/[0.05]">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span 
                    key={tag}
                    className="font-mono text-[8px] tracking-widest px-2 py-0.5 border border-white/10 bg-white/[0.01] text-white/50"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-white/40 group-hover:text-white transition-colors duration-300">
                <span className="font-mono text-[9px] tracking-widest">SPECIFICATION_HUB</span>
                <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Specification Full-screen Portal Overlay */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            id="specification-modal-portal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-4xl bg-black border border-white/15 p-6 md:p-12 relative rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Outer structural outlines */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50" />
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/10 p-2 hover:bg-white/[0.05] transition-all duration-300"
                data-cursor="magnetic"
                id="close-spec-modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Grid Contents */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mt-4">
                {/* Specs Specifications & Description (Left 7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 block mb-2">
                      PROJECT_SPECIFICATION_REPORT
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
                      {activeProject.title}
                    </h2>
                    <p className="text-sm font-sans font-light text-white/70 leading-relaxed mb-8">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Built With Grid */}
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-white/40 block mb-3">
                      BUILT_WITH_SYSTEM_PARAMS
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {activeProject.specs.map(spec => (
                        <div key={spec} className="flex items-center gap-2 font-mono text-[10px] text-white/80 py-2 border-b border-white/[0.05]">
                          <Zap className="w-3 h-3 text-white/50" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics and Stats Panel (Right 5 cols) */}
                <div className="md:col-span-5 bg-white/[0.01] border border-white/10 p-6 flex flex-col justify-between relative">
                  {/* Subtle watermarked code background */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none font-mono text-[8px] overflow-hidden select-none p-4 leading-normal">
                    {`const config = {
  latency: '1.2ms',
  rate: '144fps',
  shards: 'auto',
  engine: 'reactive',
  modules: ['audio', 'springs'],
  env: 'production'
};`}
                  </div>

                  <div className="relative z-10">
                    <span className="font-mono text-[9px] tracking-widest text-white/40 block mb-6">
                      HARDWARE_PERFORMANCE_METRICS
                    </span>

                    {/* Stats List */}
                    <div className="space-y-6">
                      {activeProject.stats.map(stat => (
                        <div key={stat.label}>
                          <span className="font-mono text-[9px] text-white/30 block tracking-widest mb-1">
                            {stat.label}
                          </span>
                          <span className="font-display text-2xl font-bold text-white tracking-tight">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.05] relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <ShieldCheck className="w-4 h-4 text-white/80" />
                      <span className="font-mono text-[9px] tracking-widest">HARDENED_BUILD_OK</span>
                    </div>
                    <span className="font-mono text-[9px] text-white/40">VER. 1.0.4</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
