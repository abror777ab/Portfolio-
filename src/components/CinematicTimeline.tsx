import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
}

const FALLBACK_TIMELINE: TimelineEvent[] = [
  {
    year: "2020",
    title: "CHILDHOOD CURIOSITY",
    subtitle: "THE DISCOVERY",
    description: "Inspecting default web files. Fascinated by code, logic flow, and how layout render trees work on static monitors."
  },
  {
    year: "2021",
    title: "THE FIRST SPARK",
    subtitle: "HTML & BASIC STYLING",
    description: "Crafting the first dynamic static pages. Learning the initial relationship between document layout tags and basic CSS declarations."
  },
  {
    year: "2022",
    title: "JAVASCRIPT MECHANICS",
    subtitle: "FUNCTIONAL SYSTEM DESIGNS",
    description: "Unlocking actual computational logic. Building mathematical calculators, game systems, and simple local engines."
  },
  {
    year: "2023",
    title: "RESPONSIVE LAYOUTS",
    subtitle: "EVERY SCREEN MATTERS",
    description: "Designing layout models that resize automatically without flickering. Mastering Tailwind CSS flow and grid models."
  },
  {
    year: "2024",
    title: "REACT SYSTEM STACKS",
    subtitle: "DYNAMIC COMPONENT ENGINEERING",
    description: "Integrating reactive state machines, modular components, and building multi-screen visual flow prototypes."
  },
  {
    year: "2025",
    title: "CINEMATIC WEB & 3D SPACE",
    subtitle: "LATEST PERSPECTIVES",
    description: "Integrating canvas, custom math matrices, and modern animations to turn basic websites into memorable digital experiences."
  },
  {
    year: "2026",
    title: "REAL CLIENTS & SYSTEMS",
    subtitle: "PROFESSIONAL SOLUTIONS",
    description: "Accepting select high-end freelance contracts. Crafting clean, fast, custom applications built with absolute discipline."
  },
  {
    year: "BEYOND",
    title: "FUTURE STARTUP ENGINE",
    subtitle: "THE HORIZON",
    description: "Assembling a global creative design and software engineering agency focused purely on aesthetic luxury software."
  }
];

export default function CinematicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(FALLBACK_TIMELINE);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data && data.length > 0) {
          setTimeline(data);
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, []);

  return (
    <div className="relative py-12" id="cinematic-timeline-root">
      
      {/* Cinematic Heading */}
      <div className="mb-16 space-y-4">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
          SEQUENTIAL_LOG_INDEX
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          THE CINEMATIC <span className="text-glow-white text-white">TIMELINE</span>
        </h2>
        <p className="text-xs font-sans font-light text-white/40 max-w-lg uppercase">
          A continuous sequence tracking the transformation of childhood curiosity into high-performance software.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 space-y-12">
        
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
            className="relative group"
          >
            {/* Timeline node bullet */}
            <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-5 h-5 bg-black border border-white/20 group-hover:border-white group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white/40 group-hover:bg-white transition-colors" />
            </div>

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-white/40 tracking-wider">[{item.year}]</span>
                <h3 className="font-display text-lg font-black text-white tracking-wide uppercase group-hover:text-glow-white transition-all duration-300">
                  {item.title}
                </h3>
              </div>
              <span className="font-mono text-[9px] tracking-widest text-white/30 block uppercase">
                {item.subtitle}
              </span>
              <p className="text-xs md:text-sm font-sans font-light text-white/60 max-w-xl leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}

      </div>

    </div>
  );
}
