import React from 'react';
import { motion } from 'motion/react';
import SplitText from './SplitText';

interface FunFact {
  tag: string;
  fact: string;
  meta: string;
}

const funFacts: FunFact[] = [
  { tag: "DISCOVERY", fact: "Started writing my first basic algorithms before high school.", meta: "PIONEER" },
  { tag: "LEARNING CYCLE", fact: "Spend part of every single day analyzing open source UI files.", meta: "CONTINUOUS" },
  { tag: "LAYOUT PREFERENCE", fact: "Strict believer in raw minimalism and pure typographic alignment.", meta: "CRAFT" },
  { tag: "GOAL", fact: "Dream of engineering software platforms that are used by millions of developers.", meta: "GLOBAL" },
  { tag: "AESTHETIC VIBE", fact: "Will debug simple shadow configurations for hours to reach visual perfection.", meta: "RIGOR" }
];

export default function ClientQuote() {
  return (
    <div className="space-y-36 py-12" id="client-quote-root">
      
      {/* 1. EMOTIONAL PERSPECTIVE / CLIENT MESSAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase mb-4">
            CORE_COMMITMENT_METRIC
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.05]">
            A PERSONAL <br />
            <span className="text-glow-white text-white">COMMITMENT.</span>
          </h2>
        </div>
        
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/[0.04] p-8 md:p-12 space-y-6">
          <p className="text-base md:text-lg font-sans font-light text-white/80 leading-relaxed italic">
            "I may not have decades of legacy experience. But I bring something equally valuable: 
            curiosity, absolute discipline, and fresh inspiration."
          </p>
          <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
            Every single line of code and animation transition I design receives my complete, focused attention. 
            Because every single client experience I build helps sculpt my lifelong future in technology.
          </p>
        </div>
      </div>

      {/* 2. FUN FACTS INTERACTIVE DECK */}
      <div className="space-y-12">
        <div className="space-y-4">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
            FACTUAL_ANOMALIES_INDEX
          </span>
          <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white uppercase">
            INTERACTIVE <span className="text-glow-white text-white">FUN FACTS</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funFacts.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -3 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="p-8 border border-white/[0.04] bg-white/[0.01] hover:border-white/15 transition-all duration-300 relative flex flex-col justify-between h-48 rounded-none"
            >
              <div className="space-y-3">
                <span className="font-mono text-[9px] text-white/30 tracking-widest block uppercase">
                  [{item.tag}]
                </span>
                <p className="text-xs font-sans font-light text-white/70 leading-relaxed">
                  {item.fact}
                </p>
              </div>
              <span className="font-mono text-[8px] text-white/40 block tracking-widest uppercase self-end">
                // {item.meta}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. PERSISTENT CINEMATIC QUOTE (FADES & SPLITS ON VIEW) */}
      <div className="py-24 border-t border-b border-white/[0.06] text-center space-y-6">
        <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 block uppercase">
          [ THE_ETERNAL_FORMULA ]
        </span>
        
        <div className="py-6">
          <h2 className="font-display text-4xl md:text-7xl font-black tracking-tight uppercase leading-none text-white select-none">
            <SplitText text="AGE IS TEMPORARY." delay={0.1} /> <br />
            <span className="text-white/40">
              <SplitText text="CURIOSITY IS FOREVER." delay={0.5} />
            </span>
          </h2>
        </div>
      </div>

    </div>
  );
}
