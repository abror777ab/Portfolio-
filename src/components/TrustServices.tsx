import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Tv, 
  Zap, 
  Compass, 
  TrendingUp, 
  MessageSquare, 
  Cpu, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

const services: ServiceItem[] = [
  {
    title: "LUXURY LANDING PAGES",
    description: "High-end visual marketing pages structured with generous negative space, breathtaking display typography, and smooth cinematic entries designed to capture lead attention instantly.",
    icon: <Sparkles className="w-4 h-4 text-white" />,
    tag: "MARKETING_SYSTEM_01"
  },
  {
    title: "INTERACTIVE EXPERIENCES",
    description: "Bypassing the ordinary grid layout with micro-synthesizer sound triggers, custom 3D canvas objects, and spring-damper physics loops responding to cursor and scroll patterns.",
    icon: <Tv className="w-4 h-4 text-white" />,
    tag: "INTERACTION_SYSTEM_02"
  },
  {
    title: "MODERN PORTFOLIOS",
    description: "Custom identity cards and developer profiles with fast responsiveness, optimized page-load targets, and storytelling elements celebrating personal authenticity.",
    icon: <Compass className="w-4 h-4 text-white" />,
    tag: "IDENTITY_SYSTEM_03"
  },
  {
    title: "WEBSITE REDESIGN & OPTIMIZATION",
    description: "Re-engineering old slower web systems to modern Tailwind layout configurations, ensuring 60-120 FPS render targets, elegant light-theme transitions, and clean files.",
    icon: <TrendingUp className="w-4 h-4 text-white" />,
    tag: "PERFORMANCE_SYSTEM_04"
  }
];

interface SkillItem {
  name: string;
  confidence: string;
  meta: string;
}

const skills: SkillItem[] = [
  { name: "HTML5", confidence: "EXPERT STRUCTURAL FOUNDATION", meta: "VALIDATED" },
  { name: "CSS3 / TAILWIND", confidence: "PIXEL-PERFECT LAYOUT SYSTEMS", meta: "SCALABLE DESIGN" },
  { name: "JAVASCRIPT / TS", confidence: "INTERACTIVE REAL-TIME COMPUTATIONS", meta: "TYPE-SAFE" },
  { name: "REACT 18+", confidence: "DYNAMIC REACTIVE STATE ENGINES", meta: "MODULAR CODE" },
  { name: "MOTION / GSAP", confidence: "CINEMATIC SPRING TRANSITION LOOPS", meta: "GPU-ACCELERATED" },
  { name: "THREE.JS / CANVAS", confidence: "INTERACTIVE 3D PERSPECTIVE DESIGNS", meta: "TRIGONOMETRY" },
  { name: "GIT / VERSION CONTROL", confidence: "CLEAN REPOSITORY TIMELINES", meta: "COLLABORATIVE" },
  { name: "PERFORMANCE CORE", confidence: "60 FPS DEBOUNCED RENDER TARGETS", meta: "LAZY LOAD" }
];

export default function TrustServices() {
  return (
    <div className="space-y-32" id="trust-services-root">
      
      {/* 1. SERVICES SYSTEM */}
      <div className="space-y-16">
        <div className="space-y-4">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
            SERVICES_PROPOSAL_CATALOG
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            PREMIUM <span className="text-glow-white text-white">SERVICES</span>
          </h2>
          <p className="text-xs font-mono text-white/40 uppercase max-w-md">
            Engineered with extreme care. Every visual asset is handcrafted to tell a unique client story.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="glass-panel p-8 border border-white/[0.04] bg-white/[0.01] hover:border-white/10 transition-colors relative flex flex-col justify-between group rounded-none"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black group-hover:border-white/30 transition-colors">
                    {svc.icon}
                  </div>
                  <span className="font-mono text-[9px] text-white/30 tracking-widest">
                    {svc.tag}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white tracking-wide uppercase group-hover:text-glow-white transition-all duration-300">
                    {svc.title}
                  </h3>
                  <p className="text-xs md:text-sm font-sans font-light text-white/60 leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>
              <div className="border-t border-white/[0.05] mt-8 pt-4 flex justify-between items-center text-white/40 group-hover:text-white transition-colors">
                <span className="font-mono text-[9px] tracking-widest">[INQUIRE]</span>
                <Maximize2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. CONFIDENCE SKILLS */}
      <div className="space-y-16">
        <div className="space-y-4">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
            ENGINEERING_CONFIDENCE_SYSTEM
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            SKILL <span className="text-glow-white text-white">BENCHMARKS</span>
          </h2>
          <p className="text-xs font-mono text-white/40 uppercase max-w-md">
            Describing true capability through validated confidence benchmarks, rather than superficial percentages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="p-6 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/40" />
                  <h4 className="font-display text-base font-bold text-white tracking-wide uppercase">
                    {skill.name}
                  </h4>
                </div>
                <p className="text-xs font-mono tracking-wider text-white/40">
                  {skill.confidence}
                </p>
              </div>
              <span className="font-mono text-[9px] border border-white/10 px-2 py-1 text-white/50 tracking-widest self-start md:self-center">
                {skill.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRUST SECTION (WHY WORK WITH ME?) */}
      <div className="space-y-16 pt-12 border-t border-white/[0.06]">
        <div className="space-y-4">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
            COLLABORATION_PARADIGM
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            WHY WORK <span className="text-glow-white text-white">WITH ME?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 border border-white/[0.03] hover:border-white/10 transition-colors">
            <MessageSquare className="w-5 h-5 text-white/60 mb-4" />
            <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">RAPID TRANSPARENCY</h4>
            <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
              Active diagnostic communications. No hidden code gaps or delayed transmission replies.
            </p>
          </div>

          <div className="p-8 border border-white/[0.03] hover:border-white/10 transition-colors">
            <Cpu className="w-5 h-5 text-white/60 mb-4" />
            <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">LATEST TECHNOLOGY</h4>
            <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
              Clean files running modern React mechanisms, spring mechanics, and custom shader styles.
            </p>
          </div>

          <div className="p-8 border border-white/[0.03] hover:border-white/10 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-white/60 mb-4" />
            <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">RELIABLE RECONCILIATION</h4>
            <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
              Every design feature fits exactly on mobile layouts. No layout overflows or visual clutter.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
