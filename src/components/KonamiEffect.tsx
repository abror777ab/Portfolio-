import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ShieldCheck, Zap, X, Cpu } from 'lucide-react';

interface KonamiEffectProps {
  onClose: () => void;
}

export default function KonamiEffect({ onClose }: KonamiEffectProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 md:p-8 overflow-y-auto select-none"
      id="konami-overlay-frame"
    >
      {/* Ambient background particles (simulated via stylized divs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl bottom-10 right-10 animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
        className="w-full max-w-2xl bg-black border border-white/20 p-8 md:p-12 relative rounded-none text-center box-glow-strong"
      >
        {/* Top visual borders */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" />
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/10 p-2 hover:bg-white/[0.05] transition-all duration-300"
          data-cursor="magnetic"
          id="close-konami-modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Override badge */}
        <div className="mx-auto w-16 h-16 rounded-full border border-white flex items-center justify-center bg-white text-black mb-8 box-glow-white">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 block mb-3">
          SECRET_PROTOCOL_014_ACTIVE
        </span>

        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6 uppercase text-glow-white">
          OVERDRIVE ENGAGED
        </h2>

        <p className="text-sm font-sans font-light text-white/70 leading-relaxed max-w-md mx-auto mb-8">
          "Congratulations, curious traveler. You successfully entered the legendary Konami cheat code sequence. You have been granted Developer Mode clearance."
        </p>

        {/* Interactive Stats Log Frame */}
        <div className="border border-white/10 bg-white/[0.01] p-6 text-left font-mono text-xs text-white/80 space-y-3 mb-8 max-w-lg mx-auto">
          <div className="flex justify-between border-b border-white/[0.05] pb-2">
            <span>METRIC:</span>
            <span>VALUE:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">GUEST_ACCESS_LEVEL:</span>
            <span className="text-white font-bold">LEVEL_01 // HIGH_PRIVILEGE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">DIGITAL_CLONE_INTELLIGENCE:</span>
            <span className="text-white">COGNITIVE_ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">CURIOUS_RATING:</span>
            <span className="text-white">100% MAXIMUM</span>
          </div>
        </div>

        {/* Private Note from Abror */}
        <div className="border-t border-white/[0.08] pt-8">
          <div className="flex items-center justify-center gap-3 font-mono text-[9px] tracking-widest text-white/50 uppercase">
            <Cpu className="w-3.5 h-3.5 text-white/60 animate-pulse" />
            <span>PERSONAL_NOTE_ABROR</span>
          </div>
          <p className="text-xs font-sans font-light text-white/50 leading-relaxed mt-4 max-w-md mx-auto italic">
            "Thank you for exploring until the end and finding this easter egg! Building software is my biggest passion, and having people like you inspect my craft gives me immense inspiration."
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
