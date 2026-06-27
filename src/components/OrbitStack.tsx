import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Server, Cpu, Layers, Sparkles, Orbit, Terminal as TermIcon, Shield, Database } from 'lucide-react';
import { TechItem } from '../types';

const TECH_ITEMS: TechItem[] = [
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'frontend',
    level: 92,
    years: '2 Years',
    details: 'Architecting fully type-safe component trees, strict data interfaces, and scale-ready module hierarchies.',
    coordinates: { x: -140, y: -70 },
  },
  {
    id: 'react',
    name: 'React 19',
    category: 'frontend',
    level: 90,
    years: '2.5 Years',
    details: 'Building performance-optimized dynamic virtual state layouts, custom hooks, and spring physical animations.',
    coordinates: { x: 140, y: -90 },
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS v4',
    category: 'frontend',
    level: 95,
    years: '3 Years',
    details: 'Configuring custom @theme layers, high-end responsive aesthetics, and fully bespoke glassmorphism classes.',
    coordinates: { x: -120, y: 110 },
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'backend',
    level: 82,
    years: '1.5 Years',
    details: 'Designing lightweight server microservices, file buffers, stream pipelines, and robust terminal scripts.',
    coordinates: { x: 130, y: 100 },
  },
  {
    id: 'express',
    name: 'Express',
    category: 'backend',
    level: 85,
    years: '1.5 Years',
    details: 'Formulating clean API routing, highly secure cors/rate-limiting headers, and custom server response flows.',
    coordinates: { x: 0, y: -160 },
  },
  {
    id: 'motion',
    name: 'Motion',
    category: 'tools',
    level: 88,
    years: '2 Years',
    details: 'Choreographing custom high-performance animation timelines, micro-interactions, and cinematic view entrances.',
    coordinates: { x: 0, y: 160 },
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'tools',
    level: 90,
    years: '2 Years',
    details: 'Configuring ultra-fast module bundler processes, custom plugin integrations, and modern asset optimizations.',
    coordinates: { x: -190, y: 10 },
  },
  {
    id: 'git',
    name: 'Git & Linux',
    category: 'tools',
    level: 85,
    years: '2.5 Years',
    details: 'Handling complex branch rebasing, production shell environments, automated scripts, and CI/CD parameters.',
    coordinates: { x: 195, y: -5 },
  }
];

export default function OrbitStack() {
  const [selectedItem, setSelectedItem] = useState<TechItem>(TECH_ITEMS[0]);
  const [hoveredItem, setHoveredItem] = useState<TechItem | null>(null);

  const activeItem = hoveredItem || selectedItem;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Code2 className="w-4 h-4 text-white" />;
      case 'backend': return <Server className="w-4 h-4 text-white/70" />;
      default: return <Cpu className="w-4 h-4 text-white/50" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[500px]" id="orbital-stack-container">
      {/* Visual Orbital Stage (Left 7 cols) */}
      <div className="lg:col-span-7 flex justify-center items-center relative aspect-square max-w-[460px] mx-auto w-full border border-white/[0.04] rounded-full bg-black/40 box-glow-white overflow-visible">
        
        {/* Orbital concentric rings */}
        <div className="absolute w-[360px] h-[360px] border border-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute w-[240px] h-[240px] border border-white/[0.03] rounded-full pointer-events-none" />
        <div className="absolute w-[120px] h-[120px] border border-white/[0.02] rounded-full pointer-events-none" />

        {/* Core Nucleus */}
        <div className="absolute w-20 h-20 rounded-full bg-black border border-white/20 flex flex-col justify-center items-center text-center z-10 glass-panel shadow-2xl">
          <Orbit className="w-5 h-5 text-white animate-spin [animation-duration:12s]" />
          <span className="font-mono text-[9px] tracking-widest text-white/60 mt-1">ENGINE</span>
        </div>

        {/* Orbit Nodes */}
        {TECH_ITEMS.map((item, index) => {
          const isActive = activeItem?.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className="absolute group"
              data-cursor="magnetic"
              style={{
                x: item.coordinates.x,
                y: item.coordinates.y,
              }}
              animate={{
                y: [item.coordinates.y - 6, item.coordinates.y + 6, item.coordinates.y - 6],
              }}
              transition={{
                duration: 5 + (index % 3),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              id={`node-${item.id}`}
            >
              {/* Outer Glow Ring */}
              <div className={`absolute -inset-3 rounded-full transition-all duration-500 scale-75 group-hover:scale-100 ${
                isActive 
                  ? 'bg-white/[0.04] border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                  : 'bg-transparent border border-transparent'
              }`} />

              {/* Central Circle */}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                isActive
                  ? 'bg-white text-black border-white'
                  : 'bg-black/90 text-white/70 border-white/10 group-hover:border-white/50 group-hover:text-white'
              }`}>
                {getCategoryIcon(item.category)}
              </div>

              {/* Node Mini Label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <span className="font-mono text-[8px] tracking-widest bg-black px-1.5 py-0.5 border border-white/15 text-white">
                  {item.name.toUpperCase()}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info Hub Display Details (Right 5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-center h-full" id="stack-specification-hub">
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass-panel p-8 border border-white/10 relative rounded-none overflow-hidden"
            >
              {/* Top border highlight */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40" />

              {/* Specs Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-white/40 block mb-1">
                    TECHNOLOGY_SPECIFICATION
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                    {activeItem.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 border border-white/15 text-white/70 bg-white/[0.02]">
                  {activeItem.years}
                </span>
              </div>

              {/* Experience Meter */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono text-white/50 mb-2">
                  <span>PROFICIENCY_INDEX</span>
                  <span className="text-white font-semibold">{activeItem.level}%</span>
                </div>
                <div className="h-[2px] w-full bg-white/[0.05] relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeItem.level}%` }}
                    transition={{ duration: 0.6, ease: 'circOut' }}
                    className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                  />
                </div>
              </div>

              {/* Deep Details Description */}
              <p className="text-sm text-white/70 leading-relaxed font-sans font-light mb-6">
                {activeItem.details}
              </p>

              {/* Technical Specifications Specs Sub-Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] font-mono text-[9px] text-white/40">
                <div>
                  <span className="block mb-0.5">CATEGORY:</span>
                  <span className="text-white/80">{activeItem.category.toUpperCase()}</span>
                </div>
                <div>
                  <span className="block mb-0.5">INTEGRATION_REF:</span>
                  <span className="text-white/80">0x0{activeItem.id.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
