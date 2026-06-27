import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  key?: string;
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5 seconds luxury load
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentPercent = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setPercent(currentPercent);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Elegant transition pause
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-12 select-none"
      id="cinematic-loader-container"
    >
      {/* Top HUD */}
      <div className="flex justify-between font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">
        <span>INITIALIZING_CINEMATIC_CORE</span>
        <span>ABROR_SYS_014</span>
      </div>

      {/* Center Typography */}
      <div className="my-auto space-y-6 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 block mb-3 uppercase">
            CREATIVE_DEVELOPER_PORTFOLIO
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none uppercase">
            ABROR
          </h1>
        </motion.div>

        {/* Loading Bar */}
        <div className="space-y-3">
          <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ width: `${percent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-white/40 tracking-widest">
            <span>LOADING_ENVIRONMENT_ASSETS</span>
            <span className="text-white font-bold">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-between font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">
        <span>© 2026 // ESTABLISHING REAL-TIME PERSPECTIVE</span>
        <span>TASHKENT, UZ</span>
      </div>
    </motion.div>
  );
}
