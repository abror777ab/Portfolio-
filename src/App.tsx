import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Eye, Keyboard, ArrowDown, MapPin, 
  Send, Compass, Mail, Shield, Check, Terminal as TermIcon, 
  Sparkles, Layers, ArrowUpRight, Smartphone, BookOpen, User, HelpCircle
} from 'lucide-react';

import CustomCursor from './components/CustomCursor';
import HUD from './components/HUD';
import NoiseOverlay from './components/NoiseOverlay';
import OrbitStack from './components/OrbitStack';
import ProjectShowcase from './components/ProjectShowcase';
import Terminal from './components/Terminal';
import KonamiEffect from './components/KonamiEffect';
import LoadingScreen from './components/LoadingScreen';
import CinematicCanvas from './components/CinematicCanvas';
import SplitText from './components/SplitText';
import MagneticWrapper from './components/MagneticWrapper';
import AnimatedCounter from './components/AnimatedCounter';
import StorytellingAbout from './components/StorytellingAbout';
import CinematicTimeline from './components/CinematicTimeline';
import TrustServices from './components/TrustServices';
import ClientQuote from './components/ClientQuote';
import AdminPanel from './components/AdminPanel';
import BlogShowcase from './components/BlogShowcase';
import { trackEvent } from './utils/analytics';

// 1. Web Audio Synthesized click synthesizer for ultra-premium cinematic experience
function playTickSound(frequency: number = 800, type: OscillatorType = 'sine', duration: number = 0.04, isMuted: boolean = false) {
  if (isMuted) return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio activation context warnings
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isKonamiActive, setIsKonamiActive] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Cascade triggers for data re-fetches
  
  // Form integration states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

  // Konami Code Tracking Sequence
  const konamiRef = useRef<string[]>([]);
  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
  ];

  useEffect(() => {
    // Track site landing / pageview in analytics
    if (!isLoading) {
      trackEvent('pageview', 'homepage');
    }
  }, [isLoading]);

  useEffect(() => {
    // Spotlight follow listener
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setSpotlightPos({ x: xPercent, y: yPercent });
    };

    // Keyboard sequence listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // Audio trigger on any click-like hotkey action
      if (['?', 'c', 'p', 's', 'k', 'Escape'].includes(e.key)) {
        playTickSound(650, 'triangle', 0.05, isMuted);
      }

      // 1. Hotkeys
      if (e.key === '?') {
        setShowShortcuts(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setIsKonamiActive(false);
      }
      if (e.key === 'c' || e.key === 'C') {
        document.getElementById('core-terminal-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'p' || e.key === 'P') {
        document.getElementById('flagship-projects-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 's' || e.key === 'S') {
        setIsMuted(prev => !prev);
      }
      if (e.key === 'k' || e.key === 'K') {
        setIsKonamiActive(true);
      }

      // 2. Konami code detector
      const currentKeys = [...konamiRef.current, e.key];
      const matchIndex = currentKeys.length - 1;
      
      if (e.key === KONAMI_CODE[matchIndex]) {
        konamiRef.current = currentKeys;
        if (konamiRef.current.length === KONAMI_CODE.length) {
          setIsKonamiActive(true);
          playTickSound(1000, 'sine', 0.15, false); // Play clear high ding on Konami success
          konamiRef.current = [];
        }
      } else {
        konamiRef.current = e.key === KONAMI_CODE[0] ? [e.key] : [];
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMuted]);

  const handleInteractiveClick = (freq: number = 800) => {
    playTickSound(freq, 'sine', 0.04, isMuted);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    
    handleInteractiveClick(900);
    setFormState('sending');
    trackEvent('click', 'submit_contact_form');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMsg,
          projectType: 'General Inquiry',
          budget: 'Not Specified'
        })
      });

      if (!res.ok) {
        throw new Error('Transmitting packet rejected.');
      }

      setFormState('success');
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      handleInteractiveClick(1200);
    } catch (err) {
      setFormState('idle');
      alert('Transmission interrupted. Check server channels and try again.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loader" onComplete={() => {
          setIsLoading(false);
          setIsMuted(false); // Enable spatial sound interactions automatically once loaded
          playTickSound(600, 'sine', 0.15, false); // Dynamic confirmation ding
        }} />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden font-sans"
        >
          {/* 1. Cinematic Background 3D Engine & HUD Layers */}
          <CinematicCanvas />
          <NoiseOverlay />
          <CustomCursor />
          <HUD />

          {/* Luxury Reactive Spotlight Overlay (Desktop Only) */}
          <div 
            className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-1000 opacity-60 hidden md:block"
            style={{
              background: `radial-gradient(circle 450px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 255, 255, 0.05) 0%, transparent 80%)`
            }}
          />

          {/* Floating Interactive Controls (Sound, Shortcut helper, Admin panel) */}
          <div className="fixed bottom-6 right-6 md:right-12 z-40 flex items-center gap-3">
            {/* Admin Bypass Control */}
            <MagneticWrapper>
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  handleInteractiveClick(1000);
                }}
                className="w-10 h-10 border border-white/10 flex items-center justify-center transition-all duration-300 rounded-none bg-black text-white/40 hover:text-white hover:border-white/30"
                data-cursor="magnetic"
                title="Secure CMS Administration Console"
                id="floating-admin-trigger"
              >
                <Shield className="w-4 h-4" />
              </button>
            </MagneticWrapper>

            {/* Toggle Sound */}
            <MagneticWrapper>
              <button
                onClick={() => {
                  setIsMuted(prev => !prev);
                  playTickSound(880, 'sine', 0.06, !isMuted);
                }}
                className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 rounded-none bg-black ${
                  isMuted ? 'border-white/10 text-white/40' : 'border-white/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                }`}
                data-cursor="magnetic"
                title="Toggle audio synth clicks [S]"
                id="toggle-synth-audio"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </MagneticWrapper>

            {/* Shortcuts Panel button */}
            <MagneticWrapper>
              <button
                onClick={() => {
                  setShowShortcuts(prev => !prev);
                  handleInteractiveClick(750);
                }}
                className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 rounded-none bg-black ${
                  showShortcuts ? 'border-white/50 text-white' : 'border-white/10 text-white/40 hover:border-white/30'
                }`}
                data-cursor="magnetic"
                title="Keyboard shortcuts menu [?]"
                id="toggle-shortcuts-drawer"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </MagneticWrapper>
          </div>

      {/* Main Structural Page Wrap */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24 py-16 relative z-20 space-y-36 md:space-y-48">
        
        {/* ================= HERO CINEMATIC HEADER ================= */}
        <section className="min-h-[85vh] flex flex-col justify-between pt-24" id="intro-hero-section">
          {/* Subtle category header */}
          <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-2">
            <span>[EXPERIENCE_LAUNCHER_014]</span>
            <span className="w-12 h-px bg-white/20" />
            <span>TASHKENT_UZB</span>
          </div>

          {/* Epic scale headings */}
          <div className="my-auto space-y-6 md:space-y-12">
            <h1 className="font-display text-5xl md:text-8xl font-black tracking-tight leading-[0.95] text-white uppercase flex flex-col items-start gap-1">
              <SplitText text="I DON'T JUST BUILD" delay={0.2} />
              <span className="text-white/40">
                <SplitText text="WEBSITES." delay={0.6} />
              </span>
              <SplitText text="I CREATE DIGITAL" delay={1.0} />
              <span className="text-white text-glow-white">
                <SplitText text="EXPERIENCES." delay={1.4} />
              </span>
            </h1>

            {/* Subtle intro statement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl border-l border-white/20 pl-6 py-1"
            >
              <p className="text-sm font-sans font-light text-white/70 leading-relaxed">
                I CREATE DIGITAL EXPERIENCES THAT PEOPLE REMEMBER. <br />
                Frontend Developer from Uzbekistan. 14 years old. Learning every day. Building without limits.
              </p>
            </motion.div>
          </div>

          {/* Bottom details bar */}
          <div className="flex justify-between items-end border-t border-white/[0.06] pt-8">
            <div className="font-mono text-[9px] tracking-widest text-white/40 space-y-1.5 uppercase">
              <div>DEVELOPER: ABROR</div>
              <div>AGE: 14 // PASSION CONSTANT</div>
            </div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-white/40 uppercase"
            >
              <span>SCROLL_DEPTH_REVEAL</span>
              <ArrowDown className="w-3.5 h-3.5 text-white/60" />
            </motion.div>
          </div>
        </section>


        {/* ================= CHAPTER I: STORY & MANIFESTO ================= */}
        <section className="space-y-24 pt-12" id="manifesto-section">
          {/* Side title */}
          <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-3 uppercase">
            <span>CH. 01 // STORY & MANIFESTO</span>
            <span className="h-px bg-white/25 w-12" />
          </div>

          <StorytellingAbout />
          <CinematicTimeline />
        </section>


        {/* ================= CHAPTER II: FLAGSHIP PROJECTS ================= */}
        <section className="space-y-12 pt-12" id="flagship-projects-anchor">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-3 uppercase">
              <span>CH. 02 // SPECIFICATIONS</span>
              <span className="h-px bg-white/25 w-12" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white/30 hidden sm:block">SELECT_ANY_FOR_METRICS</span>
          </div>

          <ProjectShowcase />
        </section>


        {/* ================= EXTRA: TRUST & SERVICES ================= */}
        <section className="pt-12" id="trust-services-section">
          <TrustServices />
        </section>


        {/* ================= CHAPTER III: TECHNICAL MATRIX ================= */}
        <section className="space-y-12 pt-12" id="tech-matrix-section">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-3 uppercase">
              <span>CH. 03 // ENGINE MATRIX</span>
              <span className="h-px bg-white/25 w-12" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white/30 hidden sm:block">HOVER_ORBITAL_NODES</span>
          </div>

          <OrbitStack />
        </section>


        {/* ================= EXTRA: CLIENT STORIES & QUOTES ================= */}
        <section className="pt-12" id="client-stories-section">
          <ClientQuote />
        </section>


        {/* ================= EXTRA: BLOG SHOWCASE (CMS) ================= */}
        <section className="pt-12" id="blog-articles-section">
          <BlogShowcase />
        </section>


        {/* ================= CHAPTER IV: CORE CONSOLE ================= */}
        <section className="space-y-12 pt-12" id="core-terminal-anchor">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-3 uppercase">
              <span>CH. 04 // DEV PROTOCOLS</span>
              <span className="h-px bg-white/25 w-12" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-white/30 hidden sm:block">QUERY_CLI_DIAGNOSTICS</span>
          </div>

          <Terminal onAdminTrigger={() => setIsAdminOpen(true)} />
        </section>


        {/* ================= CHAPTER V: SECURE TRANSMISSION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12" id="contact-nexus-section">
          {/* Text panel left */}
          <div className="lg:col-span-5 space-y-8">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 flex items-center gap-3 uppercase">
              <span>CH. 05 // NEXUS</span>
              <span className="h-px bg-white/25 w-12" />
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white uppercase leading-tight">
              LET'S BUILD SOMETHING AMAZING TOGETHER.
            </h2>
            
            <p className="text-sm font-sans font-light text-white/60 leading-relaxed">
              Whether you need a modern landing page, a creative portfolio, or a premium website, I'm ready to help turn your ideas into reality. Send a secure digital transmission directly to my mailbox.
            </p>

            <div className="space-y-4 pt-6 font-mono text-xs text-white/70">
              <div className="flex items-center gap-3 p-4 border border-white/[0.04] bg-white/[0.01]">
                <MapPin className="w-4 h-4 text-white/40" />
                <span>LOC: Tashkent, Uzbekistan</span>
              </div>
              <div className="flex items-center gap-3 p-4 border border-white/[0.04] bg-white/[0.01]">
                <Mail className="w-4 h-4 text-white/40" />
                <span>aralovsanjar14@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Form left */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleFormSubmit}
              className="glass-panel p-8 border border-white/10 space-y-6 relative rounded-none"
              id="contact-transmission-form"
            >
              {/* Border accents */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30" />

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-white/40 tracking-widest block uppercase">
                  TRANSMISSION_SENDER_NAME
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter identity label..."
                  className="w-full bg-black border border-white/10 p-3.5 text-xs font-mono text-white outline-none focus:border-white transition-colors placeholder-white/15 rounded-none"
                  data-cursor="magnetic"
                  id="form-input-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-white/40 tracking-widest block uppercase">
                  TRANSMISSION_SENDER_EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Enter address point..."
                  className="w-full bg-black border border-white/10 p-3.5 text-xs font-mono text-white outline-none focus:border-white transition-colors placeholder-white/15 rounded-none"
                  data-cursor="magnetic"
                  id="form-input-email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-white/40 tracking-widest block uppercase">
                  TRANSMISSION_PAYLOAD_BODY
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Write clear transmission context..."
                  className="w-full bg-black border border-white/10 p-3.5 text-xs font-mono text-white outline-none focus:border-white transition-colors placeholder-white/15 rounded-none resize-none"
                  data-cursor="magnetic"
                  id="form-input-message"
                />
              </div>

              {/* Form trigger submission button */}
              <MagneticWrapper className="w-full">
                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full bg-white text-black font-mono text-[10px] tracking-[0.25em] font-semibold py-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 relative flex items-center justify-center gap-2 rounded-none"
                  data-cursor="hover"
                  id="form-submit-trigger"
                >
                  {formState === 'sending' ? (
                    <span>DISPATCHING_PACKETS...</span>
                  ) : formState === 'success' ? (
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>TRANSMISSION_COMPLETED_OK</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Send className="w-3 h-3" />
                      <span>DISPATCH_TRANSMISSION</span>
                    </div>
                  )}
                </button>
              </MagneticWrapper>

              <AnimatePresence>
                {formState === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[10px] text-white/80 text-center mt-2"
                  >
                    Packet successfully synchronized. Abror will decrypt your message shortly.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>


        {/* ================= FOOTER / UNKNOWN COORDINATES ================= */}
        <footer className="border-t border-white/[0.06] pt-24 pb-24 text-center space-y-12 select-none" id="footer-section">
          {/* Massive typography header */}
          <div className="py-8">
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none text-white/10 hover:text-white/20 transition-colors duration-500 uppercase">
              THANK YOU <br />
              FOR <br />
              VISITING.
            </h2>
          </div>

          <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase max-w-md mx-auto">
            Built with passion, creativity and countless hours of learning.
          </p>

          {/* Secret coordinate compass visualizer */}
          <div className="inline-flex flex-col items-center gap-3 font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase pt-4">
            <Compass className="w-6 h-6 text-white/40 animate-spin [animation-duration:15s]" />
            <div>COORD: 41.2995° N, 69.2401° E // TASHKENT</div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-white/40 gap-4 pt-4 max-w-xl mx-auto">
            <span>© 2026 ABROR. ALL REFS RESERVED.</span>
            <span>CRAFTED IN UTMOST DISCIPLINE</span>
            <span>VER. 1.4.2 // PROD</span>
          </div>
        </footer>

      </main>

      {/* ================= KEYBOARD SHORTCUTS DRAWER OVERLAY ================= */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
            id="shortcuts-panel-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-black border border-white/15 p-8 relative rounded-none box-glow-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/45" />

              <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 block mb-2 uppercase">
                SYSTEM_ACCESS_KEYS
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-6 uppercase">
                HOTKEY_MAP
              </h3>

              {/* Shortcut Table */}
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/50">[ C ]</span>
                  <span className="text-white">Scroll directly to Console Terminal</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/50">[ P ]</span>
                  <span className="text-white">Scroll directly to Project spec sheets</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/50">[ S ]</span>
                  <span className="text-white">Toggle synthesized sound clicks</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/50">[ K ]</span>
                  <span className="text-white">Toggle Secret Protocol X-14</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-white/50">[ Esc ]</span>
                  <span className="text-white">Close active overlays / drawers</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/50">[ ? ]</span>
                  <span className="text-white">Toggle shortcuts guide panel</span>
                </div>
              </div>

              {/* Hint */}
              <p className="text-[10px] font-sans font-light text-white/40 text-center mt-6">
                Type the legendary Konami Code sequence anywhere to trigger Overdrive.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SECRET KONAMI OVERLAY ================= */}
      <AnimatePresence>
        {isKonamiActive && (
          <KonamiEffect onClose={() => setIsKonamiActive(false)} />
        )}
      </AnimatePresence>

      {/* ================= SECURE ADMIN CMS CONTROLLER OVERLAY ================= */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onRefreshData={() => setRefreshKey(prev => prev + 1)} 
      />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
