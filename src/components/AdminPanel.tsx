import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, LayoutGrid, FileText, Settings, Inbox, 
  Trash2, Eye, ShieldAlert, Cpu, Calendar, Plus, 
  Save, Sparkles, LogOut, CheckCircle, Clock, Globe,
  Smartphone, Monitor, BarChart3, ChevronRight, FileCode
} from 'lucide-react';
import { Project, TechItem, TimelineEvent, ContactMessage, BlogArticle, ServiceItem, TestimonialItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void; // Trigger root app re-fetches
}

type AdminTab = 'analytics' | 'projects' | 'blog' | 'skills-timeline' | 'services-testimonials';

export default function AdminPanel({ isOpen, onClose, onRefreshData }: AdminPanelProps) {
  const [token, setToken] = useState<string>(() => localStorage.getItem('abror_admin_token') || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Database lists in active administration memory
  const [analytics, setAnalytics] = useState<any>(null);
  const [inbox, setInbox] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<TechItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Editing buffer states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<TechItem> | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEvent> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<BlogArticle> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }
      setToken(data.token);
      localStorage.setItem('abror_admin_token', data.token);
      showNotification('success', 'SECURE ACCESS GRANTED. SYSTEM ROOT ONLINE.');
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('abror_admin_token');
    showNotification('success', 'SESSION TERMINATED SECURELY.');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all backend systems data
  const fetchAllAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // 1. Fetch Analytics
      const anRes = await fetch('/api/analytics', { headers });
      if (anRes.ok) setAnalytics(await anRes.json());

      // 2. Fetch Inbox Messages
      const msgRes = await fetch('/api/contacts', { headers });
      if (msgRes.ok) setInbox(await msgRes.json());

      // 3. Fetch Projects
      const prRes = await fetch('/api/projects');
      if (prRes.ok) setProjects(await prRes.json());

      // 4. Fetch Skills
      const skRes = await fetch('/api/skills');
      if (skRes.ok) setSkills(await skRes.json());

      // 5. Fetch Timeline
      const tlRes = await fetch('/api/timeline');
      if (tlRes.ok) setTimeline(await tlRes.json());

      // 6. Fetch Blog Articles
      const artRes = await fetch('/api/blog/all', { headers });
      if (artRes.ok) setArticles(await artRes.json());

      // 7. Fetch Testimonials
      const tsRes = await fetch('/api/testimonials');
      if (tsRes.ok) setTestimonials(await tsRes.json());

      // 8. Fetch Services
      const svRes = await fetch('/api/services');
      if (svRes.ok) setServices(await svRes.json());

    } catch (err) {
      showNotification('error', 'DATA FETCHING CONFLICT DETECTED.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAllAdminData();
    }
  }, [isOpen, token]);

  // Generic Save Function
  const handleSave = async (endpoint: string, payload: any, setter: any, editSetter: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server rejected transactional save sequence.');
      }
      showNotification('success', 'TRANSACT_DB_COMMIT_COMPLETE.');
      editSetter(null);
      fetchAllAdminData();
      onRefreshData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic Delete Function
  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('ARE YOU SECURE IN ELIMINATING THIS RECORD FOREVER?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Deletion request rejected.');
      showNotification('success', 'RECORD CLEARED SUCCESSFULLY.');
      fetchAllAdminData();
      onRefreshData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInbox(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
        showNotification('success', 'Inquiry transmission marked as read.');
      }
    } catch (err) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 md:p-8 font-sans text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_85%)] pointer-events-none" />

      {/* Main Container Frame */}
      <div className="w-full max-w-7xl h-full max-h-[92vh] bg-black border border-white/10 flex flex-col relative rounded-none overflow-hidden" id="admin-panel-container">
        {/* Glowing Head Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40" />

        {/* Top Header Row */}
        <div className="border-b border-white/[0.08] p-4 md:px-8 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-green-500 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">
              ABROR // INTEGRATED_PLATFORM_CORE
            </span>
            {token && (
              <span className="font-mono text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/50 uppercase">
                ROOT_SHELL_ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token && (
              <button 
                onClick={handleLogout}
                className="font-mono text-[9px] tracking-widest text-red-400 hover:text-red-300 flex items-center gap-1.5 uppercase transition-all"
                title="Logout secure administrative portal"
                data-cursor="hover"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">TERMINATE_SESSION</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="border border-white/10 p-2 hover:bg-white/[0.05] hover:border-white/30 transition-all rounded-none"
              data-cursor="magnetic"
              id="close-admin-panel"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Dynamic Notification Bar */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 border font-mono text-[9px] tracking-wider uppercase text-center ${
                notification.type === 'success' 
                  ? 'border-green-500/30 bg-green-950/80 text-green-300' 
                  : 'border-red-500/30 bg-red-950/80 text-red-300'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {!token ? (
            /* SECURE ACCESS GATE / LOGIN SHIELD */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-8 h-full">
              <div className="w-14 h-14 border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/80">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-black uppercase tracking-tight">AUTHORIZED ACCESS REQUIRED</h2>
                <p className="text-xs font-sans font-light text-white/50 leading-relaxed max-w-xs">
                  This viewport accesses internal database streams. Provide cryptographically hashed administrator credentials to bypass security layers.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[9px] tracking-widest text-white/40 block uppercase">SECURE_ROOT_USER</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 p-3 font-mono text-xs text-white focus:outline-none focus:border-white/40 selection:bg-white selection:text-black rounded-none"
                    placeholder="USERNAME"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[9px] tracking-widest text-white/40 block uppercase">TRANSMISSION_SECRET_CODE</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 p-3 font-mono text-xs text-white focus:outline-none focus:border-white/40 selection:bg-white selection:text-black rounded-none"
                    placeholder="PASSWORD"
                  />
                </div>

                {loginError && (
                  <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400 font-mono text-[10px] text-center uppercase">
                    [REFUSED]: {loginError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-black font-mono text-[10px] tracking-widest font-black py-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none cursor-pointer"
                >
                  {isLoading ? 'BYPASSING_PORTS...' : 'INITIATE_SYSTEM_HANDSHAKE'}
                </button>
              </form>
            </div>
          ) : (
            /* MAIN ADMIN HUB WORKSPACE */
            <>
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.08] flex md:flex-col bg-black/60 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 font-mono text-[10px] tracking-widest uppercase">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 md:flex-none p-4 px-6 flex items-center gap-3 border-b border-transparent md:border-b-0 transition-all rounded-none ${
                    activeTab === 'analytics' ? 'bg-white/[0.05] text-white border-white' : 'text-white/40 hover:text-white hover:bg-white/[0.01]'
                  }`}
                  data-cursor="hover"
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>TELEMETRY_LOGS</span>
                </button>
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={`flex-1 md:flex-none p-4 px-6 flex items-center gap-3 border-b border-transparent md:border-b-0 transition-all rounded-none ${
                    activeTab === 'projects' ? 'bg-white/[0.05] text-white border-white' : 'text-white/40 hover:text-white hover:bg-white/[0.01]'
                  }`}
                  data-cursor="hover"
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>PROJECT_MATRIX</span>
                </button>
                <button 
                  onClick={() => setActiveTab('blog')}
                  className={`flex-1 md:flex-none p-4 px-6 flex items-center gap-3 border-b border-transparent md:border-b-0 transition-all rounded-none ${
                    activeTab === 'blog' ? 'bg-white/[0.05] text-white border-white' : 'text-white/40 hover:text-white hover:bg-white/[0.01]'
                  }`}
                  data-cursor="hover"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>CMS_ARTICLES</span>
                </button>
                <button 
                  onClick={() => setActiveTab('skills-timeline')}
                  className={`flex-1 md:flex-none p-4 px-6 flex items-center gap-3 border-b border-transparent md:border-b-0 transition-all rounded-none ${
                    activeTab === 'skills-timeline' ? 'bg-white/[0.05] text-white border-white' : 'text-white/40 hover:text-white hover:bg-white/[0.01]'
                  }`}
                  data-cursor="hover"
                >
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>SKILL_TIMELINE</span>
                </button>
                <button 
                  onClick={() => setActiveTab('services-testimonials')}
                  className={`flex-1 md:flex-none p-4 px-6 flex items-center gap-3 border-b border-transparent md:border-b-0 transition-all rounded-none ${
                    activeTab === 'services-testimonials' ? 'bg-white/[0.05] text-white border-white' : 'text-white/40 hover:text-white hover:bg-white/[0.01]'
                  }`}
                  data-cursor="hover"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>TRUST_REVIEWS</span>
                </button>
              </div>

              {/* Work Canvas Viewport */}
              <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-black/25">
                {isLoading && (
                  <div className="absolute top-18 right-8 flex items-center gap-2 font-mono text-[9px] text-white/40 tracking-widest uppercase">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>SYNCHRONIZING_DB_PORTS...</span>
                  </div>
                )}

                {/* TAB CONTENT: ANALYTICS & INBOX */}
                {activeTab === 'analytics' && (
                  <div className="space-y-12">
                    {/* Header */}
                    <div className="border-b border-white/[0.06] pb-4">
                      <h3 className="font-display text-xl font-black uppercase tracking-tight">TELEMETRY ANALYTICS & VISITOR METRICS</h3>
                      <p className="text-[10px] font-mono text-white/40 tracking-wider">REAL-TIME PORT ACTIVITY TRACKING INDEX</p>
                    </div>

                    {/* Numeric dashboard widgets */}
                    {analytics && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                          <span className="font-mono text-[8px] text-white/30 block mb-1">TOTAL_PAGEVIEWS</span>
                          <span className="font-display text-2xl font-semibold tracking-tight">{analytics.summary.totalViews}</span>
                        </div>
                        <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                          <span className="font-mono text-[8px] text-white/30 block mb-1">INTERACTIVE_CLICKS</span>
                          <span className="font-display text-2xl font-semibold tracking-tight">{analytics.summary.totalClicks}</span>
                        </div>
                        <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                          <span className="font-mono text-[8px] text-white/30 block mb-1">INBOX_TRANSMISSIONS</span>
                          <span className="font-display text-2xl font-semibold tracking-tight">{analytics.summary.totalSubmissions}</span>
                        </div>
                        <div className="p-5 border border-white/[0.06] bg-white/[0.01]">
                          <span className="font-mono text-[8px] text-white/30 block mb-1">VISITOR_CONVERSION_RATE</span>
                          <span className="font-display text-2xl font-semibold tracking-tight text-white/80">{analytics.summary.conversionRate}</span>
                        </div>
                      </div>
                    )}

                    {/* Devices and countries visual matrix */}
                    {analytics && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border border-white/[0.06] bg-white/[0.01] space-y-4">
                          <div className="flex justify-between font-mono text-[9px] text-white/40 border-b border-white/[0.05] pb-2 uppercase">
                            <span>GEOGRAPHIC_ORIGIN_TELEMETRY</span>
                            <span>SESSIONS_COUNT</span>
                          </div>
                          <div className="space-y-2 font-mono text-xs text-white/80">
                            {Object.entries(analytics.countries).map(([c, count]: any) => (
                              <div key={c} className="flex justify-between items-center py-1">
                                <span className="flex items-center gap-2">
                                  <Globe className="w-3.5 h-3.5 text-white/30" />
                                  <span>{c === 'UZ' ? 'Uzbekistan (UZ)' : c}</span>
                                </span>
                                <span className="text-white/50">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 border border-white/[0.06] bg-white/[0.01] space-y-4">
                          <div className="flex justify-between font-mono text-[9px] text-white/40 border-b border-white/[0.05] pb-2 uppercase">
                            <span>DEVICE_DENSITY_COMPOSITION</span>
                            <span>DISTRIBUTION_INDEX</span>
                          </div>
                          <div className="space-y-2 font-mono text-xs text-white/80">
                            {Object.entries(analytics.devices).map(([d, count]: any) => (
                              <div key={d} className="flex justify-between items-center py-1">
                                <span className="flex items-center gap-2">
                                  {d === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-white/30" /> : <Monitor className="w-3.5 h-3.5 text-white/30" />}
                                  <span>{d.toUpperCase()}</span>
                                </span>
                                <span className="text-white/50">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inbox / Contact inquiries */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                        <span className="font-mono text-[9px] tracking-widest text-white/40 block uppercase">
                          INBOX_SECURE_MESSAGES_BUFFER ({inbox.length})
                        </span>
                      </div>

                      {inbox.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-white/10 text-white/40 font-mono text-xs uppercase">
                          No messages received in the local buffer.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {inbox.map((msg) => (
                            <div key={msg.id} className={`p-6 border ${msg.read ? 'border-white/[0.05]' : 'border-white/20 bg-white/[0.01]'} relative space-y-4`}>
                              <div className="flex flex-wrap justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                                    {msg.name.toUpperCase()}
                                    {!msg.read && <span className="w-1.5 h-1.5 bg-white inline-block rounded-full animate-ping" />}
                                  </h4>
                                  <p className="text-xs font-mono text-white/40">
                                    {msg.email} {msg.company ? `// ${msg.company}` : ''}
                                  </p>
                                </div>
                                <div className="font-mono text-[9px] text-white/30 text-right">
                                  <div>[{msg.projectType.toUpperCase()}]</div>
                                  <div>{msg.budget}</div>
                                  <div>{new Date(msg.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>

                              <p className="text-sm font-sans font-light text-white/70 leading-relaxed pt-2 border-t border-white/[0.04]">
                                {msg.message}
                              </p>

                              <div className="flex justify-end gap-3 pt-2 font-mono text-[9px] tracking-widest">
                                {!msg.read && (
                                  <button 
                                    onClick={() => markMessageAsRead(msg.id)}
                                    className="px-3 py-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all rounded-none uppercase"
                                    data-cursor="hover"
                                  >
                                    MARK_READ
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDelete('contacts', msg.id)}
                                  className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-none uppercase flex items-center gap-1.5"
                                  data-cursor="hover"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>CLEAR_RECORD</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: PROJECTS MANAGER */}
                {activeTab === 'projects' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                      <div>
                        <h3 className="font-display text-xl font-black uppercase tracking-tight">PROJECT REPOSITORY MATRIX</h3>
                        <p className="text-[10px] font-mono text-white/40 tracking-wider">CREATE OR DISPENSE HIGH END PORTFOLIO SECTIONS</p>
                      </div>
                      <button 
                        onClick={() => setEditingProject({ id: `p-${Date.now()}`, title: '', description: '', category: '', specs: [], tags: [], stats: [], accentColor: 'rgba(255,255,255,0.4)' })}
                        className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1.5 cursor-pointer"
                        data-cursor="hover"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>GENERATE_NEW_PROJECT</span>
                      </button>
                    </div>

                    {/* Edit Project Buffer Form Overlay */}
                    {editingProject && (
                      <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                        <div className="flex justify-between items-center font-mono text-[10px] tracking-widest text-white/40 border-b border-white/[0.05] pb-2 uppercase">
                          <span>PROJECT_RECONCILIATION_PORT // EDITING BUFFER</span>
                          <button onClick={() => setEditingProject(null)} className="text-white/40 hover:text-white">CLOSE_X</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">PROJECT_ID (IMMUTABLE)</label>
                            <input 
                              type="text" 
                              value={editingProject.id || ''} 
                              onChange={(e) => setEditingProject({...editingProject, id: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">PROJECT_TITLE</label>
                            <input 
                              type="text" 
                              value={editingProject.title || ''} 
                              onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">CATEGORY_TAG</label>
                            <input 
                              type="text" 
                              value={editingProject.category || ''} 
                              onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] text-white/40 block uppercase">PROJECT_DESCRIPTION_SUMMARY</label>
                          <textarea 
                            value={editingProject.description || ''} 
                            onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">SPECIFICATIONS (COMMA SEPARATED)</label>
                            <input 
                              type="text" 
                              value={editingProject.specs?.join(', ') || ''} 
                              onChange={(e) => setEditingProject({...editingProject, specs: e.target.value.split(',').map(s => s.trim())})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              placeholder="e.g. React 19, Web Audio API, SVG Canvas"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">TAGS (COMMA SEPARATED)</label>
                            <input 
                              type="text" 
                              value={editingProject.tags?.join(', ') || ''} 
                              onChange={(e) => setEditingProject({...editingProject, tags: e.target.value.split(',').map(s => s.trim())})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              placeholder="e.g. Acoustics, Canvas, Interactive"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 font-mono text-[9px] tracking-widest">
                          <button 
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 border border-white/10 text-white/50 hover:text-white hover:border-white transition-all rounded-none uppercase"
                          >
                            ABORT_EDIT
                          </button>
                          <button 
                            onClick={() => handleSave('projects', editingProject, setProjects, setEditingProject)}
                            className="px-4 py-2 bg-white text-black font-black hover:bg-black hover:text-white border border-white transition-all rounded-none uppercase flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>SAVE_PROJECT_RECORDS</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Project Entries List Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {projects.map(p => (
                        <div key={p.id} className="p-5 border border-white/[0.06] hover:border-white/20 transition-all flex justify-between items-center bg-white/[0.01]">
                          <div className="space-y-1">
                            <h4 className="font-display text-base font-bold">{p.title}</h4>
                            <p className="font-mono text-[9px] text-white/40 uppercase">
                              [{p.id}] // {p.category} // {p.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[9px]">
                            <button 
                              onClick={() => setEditingProject(p)}
                              className="px-3 py-1.5 border border-white/10 hover:border-white transition-all rounded-none uppercase"
                              data-cursor="hover"
                            >
                              EDIT_RECORD
                            </button>
                            <button 
                              onClick={() => handleDelete('projects', p.id)}
                              className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-none uppercase flex items-center gap-1"
                              data-cursor="hover"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>CLEAR</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: CMS BLOG CMS */}
                {activeTab === 'blog' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                      <div>
                        <h3 className="font-display text-xl font-black uppercase tracking-tight">CMS ARTICLES & MARKSOWN CMS</h3>
                        <p className="text-[10px] font-mono text-white/40 tracking-wider">COMPOSE BLOG ARTICLES IN NATIVE MARKDOWN RENDERS</p>
                      </div>
                      <button 
                        onClick={() => setEditingArticle({ id: `art-${Date.now()}`, title: '', slug: '', summary: '', content: '', coverImage: '', tags: [], category: '', readingTime: 5, draft: false })}
                        className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1.5 cursor-pointer"
                        data-cursor="hover"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>WRITE_NEW_ARTICLE</span>
                      </button>
                    </div>

                    {/* Blog composer forms editor overlay */}
                    {editingArticle && (
                      <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                        <div className="flex justify-between items-center font-mono text-[10px] tracking-widest text-white/40 border-b border-white/[0.05] pb-2 uppercase">
                          <span>CMS_ARTICLE_BUFFER // EDITING BUFFER</span>
                          <button onClick={() => setEditingArticle(null)} className="text-white/40 hover:text-white">CLOSE_X</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">ARTICLE_TITLE</label>
                            <input 
                              type="text" 
                              value={editingArticle.title || ''} 
                              onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                setEditingArticle({...editingArticle, title: e.target.value, slug});
                              }}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">SLUG (AUTO GENERATED)</label>
                            <input 
                              type="text" 
                              value={editingArticle.slug || ''} 
                              onChange={(e) => setEditingArticle({...editingArticle, slug: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white/50 focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">CATEGORY_HEADER</label>
                            <input 
                              type="text" 
                              value={editingArticle.category || ''} 
                              onChange={(e) => setEditingArticle({...editingArticle, category: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">TAGS (COMMA SEPARATED)</label>
                            <input 
                              type="text" 
                              value={editingArticle.tags?.join(', ') || ''} 
                              onChange={(e) => setEditingArticle({...editingArticle, tags: e.target.value.split(',').map(t => t.trim())})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">READING_TIME (MINS)</label>
                            <input 
                              type="number" 
                              value={editingArticle.readingTime || 5} 
                              onChange={(e) => setEditingArticle({...editingArticle, readingTime: parseInt(e.target.value) || 5})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] text-white/40 block uppercase">COVER_IMAGE_URL</label>
                          <input 
                            type="text" 
                            value={editingArticle.coverImage || ''} 
                            onChange={(e) => setEditingArticle({...editingArticle, coverImage: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] text-white/40 block uppercase">SUMMARY_DESCRIPTION</label>
                          <textarea 
                            value={editingArticle.summary || ''} 
                            onChange={(e) => setEditingArticle({...editingArticle, summary: e.target.value})}
                            rows={2}
                            className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">MARKDOWN_ARTICLE_BODY</label>
                            <span className="font-mono text-[8px] text-white/20 uppercase">markdown compatible</span>
                          </div>
                          <textarea 
                            value={editingArticle.content || ''} 
                            onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                            rows={8}
                            className="w-full bg-white/[0.02] border border-white/10 p-3 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none leading-relaxed"
                            placeholder="## Header 2&#10;Write clean markdown copy..."
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="article-draft-checkbox"
                            checked={editingArticle.draft || false} 
                            onChange={(e) => setEditingArticle({...editingArticle, draft: e.target.checked})}
                            className="w-4 h-4 bg-white/[0.02] border border-white/10 text-white rounded-none"
                          />
                          <label htmlFor="article-draft-checkbox" className="font-mono text-[9px] tracking-widest text-white/50 block uppercase">
                            SAVE_AS_SYSTEM_DRAFT (DO NOT EXPOSE TO PUBLIC INDEX)
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 font-mono text-[9px] tracking-widest">
                          <button 
                            onClick={() => setEditingArticle(null)}
                            className="px-4 py-2 border border-white/10 text-white/50 hover:text-white hover:border-white transition-all rounded-none uppercase"
                          >
                            ABORT_EDIT
                          </button>
                          <button 
                            onClick={() => handleSave('blog', editingArticle, setArticles, setEditingArticle)}
                            className="px-4 py-2 bg-white text-black font-black hover:bg-black hover:text-white border border-white transition-all rounded-none uppercase flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>PUBLISH_ARTICLE_RECORDS</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Blog articles list */}
                    <div className="grid grid-cols-1 gap-4">
                      {articles.map(art => (
                        <div key={art.id} className="p-5 border border-white/[0.06] hover:border-white/20 transition-all flex justify-between items-center bg-white/[0.01]">
                          <div className="space-y-1">
                            <h4 className="font-display text-base font-bold flex items-center gap-2">
                              {art.title}
                              {art.draft && (
                                <span className="font-mono text-[8px] bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 text-red-400 uppercase">
                                  DRAFT
                                </span>
                              )}
                            </h4>
                            <p className="font-mono text-[9px] text-white/40 uppercase">
                              /{art.slug} // {art.category} // {art.readingTime} MIN READ
                            </p>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[9px]">
                            <button 
                              onClick={() => setEditingArticle(art)}
                              className="px-3 py-1.5 border border-white/10 hover:border-white transition-all rounded-none uppercase"
                              data-cursor="hover"
                            >
                              EDIT
                            </button>
                            <button 
                              onClick={() => handleDelete('blog', art.id)}
                              className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-none uppercase flex items-center gap-1"
                              data-cursor="hover"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>DELETE</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SKILLS & TIMELINE EDITOR */}
                {activeTab === 'skills-timeline' && (
                  <div className="space-y-12">
                    {/* Skills Header */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                        <div>
                          <h3 className="font-display text-xl font-black uppercase tracking-tight">ORBITAL SKILL PLATFORM NODES</h3>
                          <p className="text-[10px] font-mono text-white/40 tracking-wider">COORDINATE MAPPED CORE RECT ENGINE NODES</p>
                        </div>
                        <button 
                          onClick={() => setEditingSkill({ id: `sk-${Date.now()}`, name: '', category: 'frontend', level: 90, years: '2 Years', details: '', coordinates: { x: 0, y: 0 } })}
                          className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1 cursor-pointer"
                          data-cursor="hover"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD_NEW_NODE</span>
                        </button>
                      </div>

                      {/* Editing Skills Buffer */}
                      {editingSkill && (
                        <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">NODE_NAME</label>
                              <input 
                                type="text" 
                                value={editingSkill.name || ''} 
                                onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value, id: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">NODE_CATEGORY</label>
                              <select 
                                value={editingSkill.category || 'frontend'} 
                                onChange={(e) => setEditingSkill({...editingSkill, category: e.target.value as any})}
                                className="w-full bg-black border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              >
                                <option value="frontend">FRONTEND_ARCHITECTURE</option>
                                <option value="backend">BACKEND_INTEGRATION</option>
                                <option value="tools">COMPILER_TOOLS</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">EXPERIENCE_YEARS</label>
                              <input 
                                type="text" 
                                value={editingSkill.years || ''} 
                                onChange={(e) => setEditingSkill({...editingSkill, years: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">EXPERTISE_LEVEL (1-100)</label>
                              <input 
                                type="number" 
                                value={editingSkill.level || 90} 
                                onChange={(e) => setEditingSkill({...editingSkill, level: parseInt(e.target.value) || 90})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">X_COORDINATE (-50 to 50)</label>
                              <input 
                                type="number" 
                                value={editingSkill.coordinates?.x || 0} 
                                onChange={(e) => setEditingSkill({...editingSkill, coordinates: { x: parseInt(e.target.value) || 0, y: editingSkill.coordinates?.y || 0 }})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">Y_COORDINATE (-50 to 50)</label>
                              <input 
                                type="number" 
                                value={editingSkill.coordinates?.y || 0} 
                                onChange={(e) => setEditingSkill({...editingSkill, coordinates: { x: editingSkill.coordinates?.x || 0, y: parseInt(e.target.value) || 0 }})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">NODE_DETAILS</label>
                            <input 
                              type="text" 
                              value={editingSkill.details || ''} 
                              onChange={(e) => setEditingSkill({...editingSkill, details: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>

                          <div className="flex justify-end gap-3 font-mono text-[9px] tracking-widest">
                            <button onClick={() => setEditingSkill(null)} className="px-4 py-2 border border-white/10 uppercase">ABORT</button>
                            <button 
                              onClick={() => handleSave('skills', editingSkill, setSkills, setEditingSkill)}
                              className="px-4 py-2 bg-white text-black font-black uppercase border border-white"
                            >
                              COMMIT_NODE
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Skills Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map(sk => (
                          <div key={sk.id} className="p-4 border border-white/[0.05] bg-white/[0.01] flex justify-between items-center font-mono text-xs">
                            <div>
                              <div className="font-bold">{sk.name}</div>
                              <div className="text-[9px] text-white/40 uppercase">
                                [{sk.category}] // {sk.level}% // X:{sk.coordinates.x} Y:{sk.coordinates.y}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingSkill(sk)} className="px-2 py-1 border border-white/10 text-[9px] uppercase">EDIT</button>
                              <button onClick={() => handleDelete('skills', sk.id)} className="px-2 py-1 border border-red-500/20 text-red-400 text-[9px] uppercase">DEL</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Event Header */}
                    <div className="space-y-6 pt-6 border-t border-white/[0.06]">
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                        <div>
                          <h3 className="font-display text-xl font-black uppercase tracking-tight">CINEMATIC TIMELINE SEQUENCES</h3>
                          <p className="text-[10px] font-mono text-white/40 tracking-wider">CHRONOLOGICAL LOG INDEX RECORDS</p>
                        </div>
                        <button 
                          onClick={() => setEditingTimeline({ id: `tl-${Date.now()}`, year: '', title: '', subtitle: '', description: '' })}
                          className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1 cursor-pointer"
                          data-cursor="hover"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD_TIMELINE_EVENT</span>
                        </button>
                      </div>

                      {/* Editing Timeline Buffer */}
                      {editingTimeline && (
                        <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">YEAR_LABEL</label>
                              <input 
                                type="text" 
                                value={editingTimeline.year || ''} 
                                onChange={(e) => setEditingTimeline({...editingTimeline, year: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">EVENT_TITLE</label>
                              <input 
                                type="text" 
                                value={editingTimeline.title || ''} 
                                onChange={(e) => setEditingTimeline({...editingTimeline, title: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-display text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">EVENT_SUBTITLE</label>
                              <input 
                                type="text" 
                                value={editingTimeline.subtitle || ''} 
                                onChange={(e) => setEditingTimeline({...editingTimeline, subtitle: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">EVENT_DESCRIPTION_COPY</label>
                            <textarea 
                              value={editingTimeline.description || ''} 
                              onChange={(e) => setEditingTimeline({...editingTimeline, description: e.target.value})}
                              rows={2}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>

                          <div className="flex justify-end gap-3 font-mono text-[9px] tracking-widest">
                            <button onClick={() => setEditingTimeline(null)} className="px-4 py-2 border border-white/10 uppercase">ABORT</button>
                            <button 
                              onClick={() => handleSave('timeline', editingTimeline, setTimeline, setEditingTimeline)}
                              className="px-4 py-2 bg-white text-black font-black uppercase border border-white"
                            >
                              SAVE_EVENT_RECORD
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timeline Events List */}
                      <div className="grid grid-cols-1 gap-4">
                        {timeline.map(ev => (
                          <div key={ev.id} className="p-4 border border-white/[0.05] bg-white/[0.01] flex justify-between items-center font-mono text-xs">
                            <div>
                              <div className="font-bold font-display">[{ev.year}] {ev.title}</div>
                              <div className="text-[9px] text-white/40 uppercase">{ev.subtitle}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingTimeline(ev)} className="px-2 py-1 border border-white/10 text-[9px] uppercase">EDIT</button>
                              <button onClick={() => handleDelete('timeline', ev.id)} className="px-2 py-1 border border-red-500/20 text-red-400 text-[9px] uppercase">DEL</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SERVICES & TESTIMONIALS */}
                {activeTab === 'services-testimonials' && (
                  <div className="space-y-12">
                    {/* Services section manager */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                        <div>
                          <h3 className="font-display text-xl font-black uppercase tracking-tight">PREMIUM SERVICES & SCALE CATALOG</h3>
                          <p className="text-[10px] font-mono text-white/40 tracking-wider">MANAGE COMMERCIAL FREELANCE CHANNELS</p>
                        </div>
                        <button 
                          onClick={() => setEditingService({ id: `sv-${Date.now()}`, title: '', description: '', features: [], priceRange: '' })}
                          className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1 cursor-pointer"
                          data-cursor="hover"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD_SERVICE_SCALE</span>
                        </button>
                      </div>

                      {/* Editing services buffer */}
                      {editingService && (
                        <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">SERVICE_TITLE</label>
                              <input 
                                type="text" 
                                value={editingService.title || ''} 
                                onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-display text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">ESTIMATED_PRICE_RANGE</label>
                              <input 
                                type="text" 
                                value={editingService.priceRange || ''} 
                                onChange={(e) => setEditingService({...editingService, priceRange: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                                placeholder="e.g. $2,000 - $4,500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">SERVICE_DESCRIPTION</label>
                            <input 
                              type="text" 
                              value={editingService.description || ''} 
                              onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">FEATURES / DELIVERABLES (COMMA SEPARATED)</label>
                            <input 
                              type="text" 
                              value={editingService.features?.join(', ') || ''} 
                              onChange={(e) => setEditingService({...editingService, features: e.target.value.split(',').map(f => f.trim())})}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30 rounded-none"
                              placeholder="Feature 1, Feature 2"
                            />
                          </div>

                          <div className="flex justify-end gap-3 font-mono text-[9px] tracking-widest">
                            <button onClick={() => setEditingService(null)} className="px-4 py-2 border border-white/10 uppercase">ABORT</button>
                            <button 
                              onClick={() => handleSave('services', editingService, setServices, setEditingService)}
                              className="px-4 py-2 bg-white text-black font-black uppercase border border-white"
                            >
                              COMMIT_SERVICE
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Services List */}
                      <div className="grid grid-cols-1 gap-4">
                        {services.map(sv => (
                          <div key={sv.id} className="p-4 border border-white/[0.05] bg-white/[0.01] flex justify-between items-center font-mono text-xs">
                            <div>
                              <div className="font-bold font-display">{sv.title}</div>
                              <div className="text-[9px] text-white/40 uppercase">
                                PRICE_SCALE: {sv.priceRange || 'Not Specified'}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingService(sv)} className="px-2 py-1 border border-white/10 text-[9px] uppercase">EDIT</button>
                              <button onClick={() => handleDelete('services', sv.id)} className="px-2 py-1 border border-red-500/20 text-red-400 text-[9px] uppercase">DEL</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonials section manager */}
                    <div className="space-y-6 pt-6 border-t border-white/[0.06]">
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                        <div>
                          <h3 className="font-display text-xl font-black uppercase tracking-tight">PARTNER TRUST TESTIMONIALS</h3>
                          <p className="text-[10px] font-mono text-white/40 tracking-wider">CLIENT CONTEXT REVIEWS DATABASE</p>
                        </div>
                        <button 
                          onClick={() => setEditingTestimonial({ id: `t-${Date.now()}`, name: '', role: '', company: '', rating: 5, comment: '' })}
                          className="bg-white text-black font-mono text-[9px] tracking-widest font-black py-2.5 px-4 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 rounded-none flex items-center gap-1 cursor-pointer"
                          data-cursor="hover"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD_TESTIMONIAL</span>
                        </button>
                      </div>

                      {/* Editing testimonials buffer */}
                      {editingTestimonial && (
                        <div className="p-6 border border-white/20 bg-white/[0.01] space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">CLIENT_NAME</label>
                              <input 
                                type="text" 
                                value={editingTestimonial.name || ''} 
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">CLIENT_ROLE</label>
                              <input 
                                type="text" 
                                value={editingTestimonial.role || ''} 
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">CLIENT_COMPANY</label>
                              <input 
                                type="text" 
                                value={editingTestimonial.company || ''} 
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-white/40 block uppercase">RATING_STARS (1-5)</label>
                              <input 
                                type="number" 
                                value={editingTestimonial.rating || 5} 
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value) || 5})}
                                className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-white/40 block uppercase">TESTIMONIAL_COMMENT</label>
                            <textarea 
                              value={editingTestimonial.comment || ''} 
                              onChange={(e) => setEditingTestimonial({...editingTestimonial, comment: e.target.value})}
                              rows={2}
                              className="w-full bg-white/[0.02] border border-white/10 p-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30"
                            />
                          </div>

                          <div className="flex justify-end gap-3 font-mono text-[9px] tracking-widest">
                            <button onClick={() => setEditingTestimonial(null)} className="px-4 py-2 border border-white/10 uppercase">ABORT</button>
                            <button 
                              onClick={() => handleSave('testimonials', editingTestimonial, setTestimonials, setEditingTestimonial)}
                              className="px-4 py-2 bg-white text-black font-black uppercase border border-white"
                            >
                              SAVE_TESTIMONIAL
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Testimonials list */}
                      <div className="grid grid-cols-1 gap-4">
                        {testimonials.map(ts => (
                          <div key={ts.id} className="p-4 border border-white/[0.05] bg-white/[0.01] flex justify-between items-center font-mono text-xs">
                            <div>
                              <div className="font-bold font-sans">{ts.name}</div>
                              <div className="text-[9px] text-white/40 uppercase">
                                {ts.role} {ts.company ? `// ${ts.company}` : ''} // {ts.rating} STARS
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingTestimonial(ts)} className="px-2 py-1 border border-white/10 text-[9px] uppercase">EDIT</button>
                              <button onClick={() => handleDelete('testimonials', ts.id)} className="px-2 py-1 border border-red-500/20 text-red-400 text-[9px] uppercase">DEL</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
