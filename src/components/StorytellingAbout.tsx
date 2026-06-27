import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function StorytellingAbout() {
  return (
    <div className="space-y-24" id="storytelling-about-root">
      
      {/* 1. WHY MY AGE IS MY STRENGTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
            STRENGTH_PERSPECTIVE_INDEX
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white uppercase leading-tight">
            WHY MY AGE IS MY <br />
            <span className="text-glow-white text-white">GREATEST STRENGTH.</span>
          </h2>
          <p className="text-sm font-sans font-light text-white/60 leading-relaxed">
            I don't look at programming as a job or homework—to me, it is the highest form of creative art. 
            Being 14 years old means my curiosity has no limits, my energy is infinite, and my mind is 
            fully receptive to fast changes.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 border border-white/[0.05] relative rounded-none hover:border-white/20 transition-all duration-300">
            <span className="font-mono text-xs text-white/40 block mb-2">[01]</span>
            <h4 className="font-display text-lg font-bold text-white mb-3">HYPER-ADAPTIVE HYPERLOOP</h4>
            <p className="text-xs font-sans font-light text-white/60 leading-relaxed">
              I absorb new technology frameworks and build system specifications with absolute speed. 
              No legacy paradigms block my imagination.
            </p>
          </div>

          <div className="glass-panel p-8 border border-white/[0.05] relative rounded-none hover:border-white/20 transition-all duration-300">
            <span className="font-mono text-xs text-white/40 block mb-2">[02]</span>
            <h4 className="font-display text-lg font-bold text-white mb-3">CREATIVITY OVER HOMEWORK</h4>
            <p className="text-xs font-sans font-light text-white/60 leading-relaxed">
              I spend countless hours optimizing and building complex layouts out of genuine passion. 
              Rigor and discipline are my daily standards.
            </p>
          </div>
        </div>
      </div>

      {/* 2. CORE BIOGRAPHY STORY */}
      <div className="border-t border-white/[0.06] pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
          [THE JOURNEY SEQUENCE]
        </div>

        <div className="lg:col-span-8 space-y-12">
          <h3 className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-white uppercase leading-snug">
            CURIOSITY BECAME PASSION. <br />
            PASSION BECAME LEARNING. <br />
            LEARNING BECAME BUILDING.
          </h3>

          <div className="space-y-6 font-sans font-light text-sm text-white/70 leading-relaxed">
            <p>
              My journey started with simple curiosity—inspecting standard websites in Tashkent and wanting 
              to understand how static HTML structures came alive. I soon realized that there is a deep, 
              undiscovered language of spatial layouts and cinematic micro-interactions.
            </p>
            <p>
              Today, I build premium digital experiences with pixel-perfect accuracy. I don't compromise 
              on quality, speed, or typography hierarchies. I believe consistency beats natural talent 
              every single day.
            </p>
          </div>
        </div>
      </div>

      {/* 3. TRUST & CLIENT PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/[0.06]">
        <div className="glass-panel p-8 border border-white/[0.03]">
          <span className="font-mono text-[9px] text-white/40 block mb-4 uppercase">VALUE_REF_01</span>
          <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">QUALITY OVER VOLUME</h4>
          <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
            I limit the number of active projects I accept to guarantee undivided attention and 
            exquisite visual detail.
          </p>
        </div>

        <div className="glass-panel p-8 border border-white/[0.03]">
          <span className="font-mono text-[9px] text-white/40 block mb-4 uppercase">VALUE_REF_02</span>
          <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">HONESTY OVER PROMISES</h4>
          <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
            Transparent communication and rigorous engineering benchmarks come before marketing claims.
          </p>
        </div>

        <div className="glass-panel p-8 border border-white/[0.03]">
          <span className="font-mono text-[9px] text-white/40 block mb-4 uppercase">VALUE_REF_03</span>
          <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">EVERY PIXEL HAS PURPOSE</h4>
          <p className="text-xs font-sans font-light text-white/50 leading-relaxed">
            Every animation curve, font choice, line height, and shadow value exists for an explicit visual goal.
          </p>
        </div>
      </div>

    </div>
  );
}
