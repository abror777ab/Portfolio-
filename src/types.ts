export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  specs: string[];
  tags: string[];
  date: string;
  stats: { label: string; value: string }[];
  accentColor: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools';
  level: number; // 1-100
  years: string;
  details: string;
  coordinates: { x: number; y: number }; // Relative coordinates for orbital node positioning
}

export interface ConsoleLine {
  id: string;
  type: 'system' | 'user' | 'success' | 'error' | 'response';
  text: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  readingTime: number; // in minutes
  draft: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  priceRange?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number; // 1-5
  comment: string;
  avatar?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface AnalyticsEvent {
  id: string;
  visitorId: string;
  eventType: 'pageview' | 'click' | 'contact_submit' | 'project_view';
  path: string;
  details: string;
  timestamp: string;
  country: string;
  device: string;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  seoKeywords: string[];
  githubToken?: string;
}

