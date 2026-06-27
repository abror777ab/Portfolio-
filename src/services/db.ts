import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { 
  Project, 
  TechItem, 
  TimelineEvent, 
  ContactMessage, 
  BlogArticle, 
  ServiceItem, 
  TestimonialItem, 
  AnalyticsEvent, 
  SystemSettings 
} from '../types';

const DB_FILE = path.join(process.cwd(), 'db.json');

export interface DatabaseState {
  projects: Project[];
  skills: TechItem[];
  timeline: TimelineEvent[];
  messages: ContactMessage[];
  blog: BlogArticle[];
  testimonials: TestimonialItem[];
  services: ServiceItem[];
  analytics: AnalyticsEvent[];
  settings: SystemSettings;
  admin: {
    username: string;
    passwordHash: string;
  };
}

// Secure default hashed password for 'admin' (password is 'abror2026')
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('abror2026', 10);

const DEFAULT_STATE: DatabaseState = {
  projects: [
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
  ],
  skills: [
    {
      id: 'react',
      name: 'REACT 19 / VITE',
      category: 'frontend',
      level: 95,
      years: '3 Years',
      details: 'Advanced component systems, fiber tree structures, and performance scheduling.',
      coordinates: { x: 35, y: -25 }
    },
    {
      id: 'typescript',
      name: 'TYPESCRIPT (STRICT)',
      category: 'frontend',
      level: 92,
      years: '2 Years',
      details: 'Strict safety contracts, generative mapped interfaces, and complex generic models.',
      coordinates: { x: -40, y: 15 }
    },
    {
      id: 'nodejs',
      name: 'NODE.JS / EXPRESS',
      category: 'backend',
      level: 88,
      years: '2 Years',
      details: 'Scalable routing middleware architectures, real-time streams, and socket channels.',
      coordinates: { x: 25, y: 35 }
    },
    {
      id: 'tailwind',
      name: 'TAILWIND CSS V4',
      category: 'frontend',
      level: 98,
      years: '3 Years',
      details: 'Fluid responsive breakpoints, custom theme layers, and GPU hardware animations.',
      coordinates: { x: -30, y: -30 }
    },
    {
      id: 'framer',
      name: 'MOTION ENGINE',
      category: 'frontend',
      level: 90,
      years: '2 Years',
      details: 'Inertial coordinate dragging, spatial springs, layout transition vectors.',
      coordinates: { x: 5, y: -45 }
    },
    {
      id: 'webaudio',
      name: 'WEB AUDIO API',
      category: 'tools',
      level: 85,
      years: '1 Year',
      details: 'Real-time custom sine oscillator generation, dynamic envelopes, and audio decibel tracking.',
      coordinates: { x: -45, y: -10 }
    }
  ],
  timeline: [
    {
      id: 'tl-1',
      year: '2020',
      title: 'CHILDHOOD CURIOSITY',
      subtitle: 'THE DISCOVERY',
      description: 'Inspecting default web files. Fascinated by code, logic flow, and how layout render trees work on static monitors.'
    },
    {
      id: 'tl-2',
      year: '2021',
      title: 'THE FIRST SPARK',
      subtitle: 'HTML & BASIC STYLING',
      description: 'Crafting the first dynamic static pages. Learning the initial relationship between document layout tags and basic CSS declarations.'
    },
    {
      id: 'tl-3',
      year: '2022',
      title: 'JAVASCRIPT MECHANICS',
      subtitle: 'FUNCTIONAL SYSTEM DESIGNS',
      description: 'Unlocking actual computational logic. Building mathematical calculators, game systems, and simple local engines.'
    },
    {
      id: 'tl-4',
      year: '2023',
      title: 'RESPONSIVE LAYOUTS',
      subtitle: 'EVERY SCREEN MATTERS',
      description: 'Designing layout models that resize automatically without flickering. Mastering Tailwind CSS flow and grid models.'
    },
    {
      id: 'tl-5',
      year: '2024',
      title: 'REACT SYSTEM STACKS',
      subtitle: 'DYNAMIC COMPONENT ENGINEERING',
      description: 'Integrating reactive state machines, modular components, and building multi-screen visual flow prototypes.'
    },
    {
      id: 'tl-6',
      year: '2025',
      title: 'CINEMATIC WEB & 3D SPACE',
      subtitle: 'LATEST PERSPECTIVES',
      description: 'Integrating canvas, custom math matrices, and modern animations to turn basic websites into memorable digital experiences.'
    },
    {
      id: 'tl-7',
      year: '2026',
      title: 'REAL CLIENTS & SYSTEMS',
      subtitle: 'PROFESSIONAL SOLUTIONS',
      description: 'Accepting select high-end freelance contracts. Crafting clean, fast, custom applications built with absolute discipline.'
    },
    {
      id: 'tl-8',
      year: 'BEYOND',
      title: 'FUTURE STARTUP ENGINE',
      subtitle: 'THE HORIZON',
      description: 'Assembling a global creative design and software engineering agency focused purely on aesthetic luxury software.'
    }
  ],
  messages: [
    {
      id: 'msg-seed-1',
      name: 'Vercel Partner',
      email: 'partner@vercel.com',
      company: 'Vercel',
      budget: '$5k - $10k',
      projectType: 'High-End Interactive Page',
      message: 'Excellent portfolio aesthetic! We would love to collaborate on a new template showing off modern React 19 motion controls and server mechanics.',
      createdAt: new Date().toISOString(),
      read: false
    }
  ],
  blog: [
    {
      id: 'art-1',
      title: 'ARCHITECTING THE PERFECT SPOTLIGHT INTERACTION',
      slug: 'perfect-spotlight-interaction',
      summary: 'An analytical deep dive into rendering fluid custom coordinate spotlights in modern web viewports without introducing layer repaints.',
      content: `## The Mechanics of Cursor Spotlights

In high-end creative design systems, the mouse cursor is more than a pointer—it is a sensory bridge. Adding an ambient canvas spotlight that smoothly follows coordinates coordinates can elevate a boring screen into an interactive spatial playground.

### The Repaint Trap
Most naive implementations of spotlights update the background coordinates inside a \`mousemove\` event listener using state variables, like this:

\`\`\`tsx
// ❌ BAD PATTERN (causes massive layout recalculation and repaints)
const [position, setPosition] = useState({ x: 0, y: 0 });
return <div style={{ background: \`radial-gradient(... at \${position.x}px \${position.y}px)\` }} />;
\`\`\`

Because this triggers a React state rerender on **every single pixel move**, it causes severe layout layout bottlenecks, tanking frames to 30 FPS on high-refresh 144Hz displays.

### The GPU Acceleration Solution
Instead, use **CSS Custom Properties** updated directly on a persistent ref element, combined with a dynamic sub-pixel transformation. This shifts the layout render calculations into a composite layer, leaving the browser main thread perfectly clear:

\`\`\`tsx
// ✅ PRODUCTION-READY PATTERN
const divRef = useRef<HTMLDivElement>(null);
const handleMouseMove = (e: MouseEvent) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  divRef.current?.style.setProperty('--spotlight-x', \`\${x}%\`);
  divRef.current?.style.setProperty('--spotlight-y', \`\${y}%\`);
};
\`\`\`

By avoiding React state locks, your interaction remains flawless and fluid at **144 FPS** constant.`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      tags: ['AESTHETICS', 'PERFORMANCE', 'INTERACTION'],
      category: 'FRONTEND ARCHITECTURE',
      readingTime: 4,
      draft: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'art-2',
      title: 'UNDERSTANDING ZERO-POPPING AUDIO SYNTHESIZERS',
      slug: 'zero-popping-audio-synthesizers',
      summary: 'How to harness the Web Audio API to implement cinematic, ultra-premium button sound effects with clean exponential volume decays.',
      content: `## The Web Audio API Paradigm

Using audio file payloads like \`click.mp3\` for simple interaction sounds introduces immediate latency and increases bundle size. Instead, we can synthesize organic sounds directly in real-time using standard Web Audio oscillators.

### Eliminating the Browser Pop (Audible Clicks)
If you instantly stop an oscillator, the signal suddenly drops to zero, producing a jarring, highly unprofessional static "pop" sound. To resolve this, we use an \`GainNode\` to smoothly interpolate the sound amplitude using exponential decay:

\`\`\`ts
// ✅ Professional audio click generator
export function playTickSound(frequency = 800, duration = 0.04) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = frequency;
  
  // Set exponential ramp to zero to prevent signal pop
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}
\`\`\`

This guarantees clean, high-end acoustic feedback across all user platforms.`,
      coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      tags: ['WEB AUDIO', 'SYNTH', 'CREATIVE'],
      category: 'SENSORY DESIGN',
      readingTime: 5,
      draft: false,
      createdAt: new Date().toISOString()
    }
  ],
  testimonials: [
    {
      id: 't-1',
      name: 'Elena Rostova',
      role: 'Creative Director',
      company: 'Nordic Creative Lab',
      rating: 5,
      comment: 'Abror displays an understanding of design structure and timing that easily exceeds industry standards. The performance we received is truly phenomenal.'
    },
    {
      id: 't-2',
      name: 'Anvar Jalilov',
      role: 'Technical Lead',
      company: 'Tashkent Tech Ventures',
      rating: 5,
      comment: 'Absolute discipline and flawless implementation. The interactive terminal interface is a masterclass in custom frontend engineering.'
    }
  ],
  services: [
    {
      id: 's-1',
      title: 'HIGH-END LANDING PLATFORMS',
      description: 'Fully responsive, GPU-accelerated landing portals designed to capture and hold professional user engagement.',
      features: ['Absolute Typographic Hierarchy', 'Tactile Sensory Audio Synths', 'Lighthouse 100 Score Design', 'A11y/Keyboard-first Focus States'],
      priceRange: '$1,500 - $3,000'
    },
    {
      id: 's-2',
      title: 'BESPOKE SINGLE PAGE SOLUTIONS',
      description: 'Creative and interactive portfolios tailored perfectly for designers, developers, and premium product platforms.',
      features: ['Interactive Orbital Coordinates', 'Hardware Compiled Animations', 'Tailwind CSS V4 Structural Precision', 'Clean Secure Admin CMS panel'],
      priceRange: '$2,000 - $4,500'
    }
  ],
  analytics: [
    {
      id: 'an-seed-1',
      visitorId: 'vis-init-session',
      eventType: 'pageview',
      path: '/',
      details: 'Initial deployment telemetry session',
      timestamp: new Date().toISOString(),
      country: 'UZ',
      device: 'Desktop'
    }
  ],
  settings: {
    siteName: 'Abror | Creative Frontend Architecture',
    siteDescription: 'Premium production-ready platform showcasing high-fidelity interactive digital experiences and creative systems engineering.',
    maintenanceMode: false,
    seoKeywords: ['abror', 'frontend', 'uzbekistan', 'react', 'creative portfolio', 'luxury UI', '14 years old', 'typescript'],
    githubToken: ''
  },
  admin: {
    username: 'admin',
    passwordHash: DEFAULT_PASSWORD_HASH // password is 'abror2026'
  }
};

export class DatabaseService {
  private static instance: DatabaseService;
  private state: DatabaseState | null = null;
  private lock = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        // Ensure all required collections are initialized to handle migrations automatically
        this.state = {
          ...DEFAULT_STATE,
          ...this.state,
          settings: { ...DEFAULT_STATE.settings, ...(this.state?.settings || {}) }
        };
      } else {
        this.state = { ...DEFAULT_STATE };
        this.saveState();
      }
    } catch (e) {
      console.error('Failed to read or parse database file, falling back to defaults:', e);
      this.state = { ...DEFAULT_STATE };
    }
  }

  private saveState() {
    if (!this.state) return;
    
    // Use transaction-like write and rename pattern to prevent corruption or partial file writes
    const tempFile = `${DB_FILE}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(this.state, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database atomically:', err);
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }
  }

  // Generic and secure CRUD utility helpers
  public getData(): DatabaseState {
    if (!this.state) {
      this.init();
    }
    return this.state || DEFAULT_STATE;
  }

  public updateSettings(newSettings: Partial<SystemSettings>) {
    const data = this.getData();
    data.settings = { ...data.settings, ...newSettings };
    this.saveState();
    return data.settings;
  }

  // Collections operations
  public getProjects() { return this.getData().projects; }
  public saveProject(proj: Project) {
    const data = this.getData();
    const idx = data.projects.findIndex(p => p.id === proj.id);
    if (idx >= 0) {
      data.projects[idx] = proj;
    } else {
      data.projects.push(proj);
    }
    this.saveState();
    return proj;
  }
  public deleteProject(id: string) {
    const data = this.getData();
    data.projects = data.projects.filter(p => p.id !== id);
    this.saveState();
    return true;
  }

  public getSkills() { return this.getData().skills; }
  public saveSkill(skill: TechItem) {
    const data = this.getData();
    const idx = data.skills.findIndex(s => s.id === skill.id);
    if (idx >= 0) {
      data.skills[idx] = skill;
    } else {
      data.skills.push(skill);
    }
    this.saveState();
    return skill;
  }
  public deleteSkill(id: string) {
    const data = this.getData();
    data.skills = data.skills.filter(s => s.id !== id);
    this.saveState();
    return true;
  }

  public getTimeline() { return this.getData().timeline; }
  public saveTimeline(event: TimelineEvent) {
    const data = this.getData();
    const idx = data.timeline.findIndex(t => t.id === event.id);
    if (idx >= 0) {
      data.timeline[idx] = event;
    } else {
      data.timeline.push(event);
    }
    this.saveState();
    return event;
  }
  public deleteTimeline(id: string) {
    const data = this.getData();
    data.timeline = data.timeline.filter(t => t.id !== id);
    this.saveState();
    return true;
  }

  public getMessages() { return this.getData().messages; }
  public addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
    const data = this.getData();
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    data.messages.push(newMessage);
    this.saveState();
    return newMessage;
  }
  public markMessageAsRead(id: string) {
    const data = this.getData();
    const msg = data.messages.find(m => m.id === id);
    if (msg) {
      msg.read = true;
      this.saveState();
    }
    return msg;
  }
  public deleteMessage(id: string) {
    const data = this.getData();
    data.messages = data.messages.filter(m => m.id !== id);
    this.saveState();
    return true;
  }

  public getBlogArticles() { return this.getData().blog; }
  public saveBlogArticle(art: BlogArticle) {
    const data = this.getData();
    const idx = data.blog.findIndex(b => b.id === art.id);
    if (idx >= 0) {
      data.blog[idx] = art;
    } else {
      data.blog.push(art);
    }
    this.saveState();
    return art;
  }
  public deleteBlogArticle(id: string) {
    const data = this.getData();
    data.blog = data.blog.filter(b => b.id !== id);
    this.saveState();
    return true;
  }

  public getTestimonials() { return this.getData().testimonials; }
  public saveTestimonial(test: TestimonialItem) {
    const data = this.getData();
    const idx = data.testimonials.findIndex(t => t.id === test.id);
    if (idx >= 0) {
      data.testimonials[idx] = test;
    } else {
      data.testimonials.push(test);
    }
    this.saveState();
    return test;
  }
  public deleteTestimonial(id: string) {
    const data = this.getData();
    data.testimonials = data.testimonials.filter(t => t.id !== id);
    this.saveState();
    return true;
  }

  public getServices() { return this.getData().services; }
  public saveService(service: ServiceItem) {
    const data = this.getData();
    const idx = data.services.findIndex(s => s.id === service.id);
    if (idx >= 0) {
      data.services[idx] = service;
    } else {
      data.services.push(service);
    }
    this.saveState();
    return service;
  }
  public deleteService(id: string) {
    const data = this.getData();
    data.services = data.services.filter(s => s.id !== id);
    this.saveState();
    return true;
  }

  public getAnalytics() { return this.getData().analytics; }
  public addAnalyticsEvent(evt: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
    const data = this.getData();
    const newEvent: AnalyticsEvent = {
      ...evt,
      id: `an-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString()
    };
    data.analytics.push(newEvent);
    // Keep max 2000 items in telemetry logs to preserve fast load times
    if (data.analytics.length > 2000) {
      data.analytics.shift();
    }
    this.saveState();
    return newEvent;
  }

  public verifyAdminPassword(password: string): boolean {
    const data = this.getData();
    return bcrypt.compareSync(password, data.admin.passwordHash);
  }

  public updateAdminPassword(password: string) {
    const data = this.getData();
    data.admin.passwordHash = bcrypt.hashSync(password, 10);
    this.saveState();
    return true;
  }
}

export const db = DatabaseService.getInstance();
