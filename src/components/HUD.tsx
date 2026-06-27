import React, { useEffect, useState, useRef } from 'react';

export default function HUD() {
  const [uzTime, setUzTime] = useState('');
  const [fps, setFps] = useState(60);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const lastTimeRef = useRef(performance.now());
  const framesRef = useRef(0);

  useEffect(() => {
    // 1. Time synchronizer (Asia/Tashkent TimeZone)
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tashkent',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setUzTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // 2. Real FPS Counter using requestAnimationFrame
    let animationId: number;
    const calcFps = () => {
      framesRef.current++;
      const now = performance.now();
      if (now >= lastTimeRef.current + 1000) {
        setFps(Math.round((framesRef.current * 1000) / (now - lastTimeRef.current)));
        framesRef.current = 0;
        lastTimeRef.current = now;
      }
      animationId = requestAnimationFrame(calcFps);
    };
    animationId = requestAnimationFrame(calcFps);

    // 3. Scroll depth tracker
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(Math.round((window.scrollY / totalHeight) * 100));
      }
    };

    // 4. Mouse position coordinates
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Structural Minimal Grid Borders */}
      <div className="fixed inset-4 border border-white/[0.04] pointer-events-none z-40" id="hud-frame" />
      <div className="fixed top-0 bottom-0 left-12 border-l border-white/[0.03] pointer-events-none z-40 hidden md:block" />
      <div className="fixed top-0 bottom-0 right-12 border-r border-white/[0.03] pointer-events-none z-40 hidden md:block" />

      {/* Floating HUD elements */}
      <div className="fixed top-6 left-8 md:left-16 pointer-events-none z-40 font-mono text-[10px] tracking-widest text-white/40 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>ABROR // SYS.LIVE</span>
        </div>
        <div className="hidden lg:block">LOC: TASHKENT, UZ</div>
        <div className="hidden xl:block">SYSTEM_STATUS: STANDBY</div>
      </div>

      <div className="fixed top-6 right-8 md:right-16 pointer-events-none z-40 font-mono text-[10px] tracking-widest text-white/40 flex items-center gap-6">
        <div className="hidden sm:block">FPS: <span className="text-white">{fps}</span></div>
        <div>UZT: <span className="text-white">{uzTime || '00:00:00'}</span></div>
      </div>

      {/* Left Vertical HUD Info (Interactive scrolling & coordinates) */}
      <div className="fixed bottom-8 left-6 md:left-16 pointer-events-none z-40 font-mono text-[9px] tracking-[0.2em] text-white/30 [writing-mode:vertical-lr] select-none hidden md:flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>X: {mousePos.x} PX</span>
          <span className="w-4 h-px bg-white/20 my-1" />
          <span>Y: {mousePos.y} PX</span>
        </div>
        <div>INDEX_REF_014 // AGE:14</div>
      </div>

      {/* Right Vertical Scroll Depth */}
      <div className="fixed bottom-8 right-6 md:right-16 pointer-events-none z-40 font-mono text-[9px] tracking-[0.2em] text-white/30 [writing-mode:vertical-lr] select-none hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>SCROLL_DEPTH</span>
          <span className="w-4 h-px bg-white/20 my-1" />
          <span className="text-white/80 font-bold">{scrollPercent}%</span>
        </div>
      </div>
    </>
  );
}
