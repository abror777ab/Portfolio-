import { AnalyticsEvent } from '../types';

let visitorId = '';

function getVisitorId() {
  if (typeof window === 'undefined') return 'server';
  if (!visitorId) {
    visitorId = localStorage.getItem('abror_visitor_id') || '';
    if (!visitorId) {
      visitorId = `vis-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      localStorage.setItem('abror_visitor_id', visitorId);
    }
  }
  return visitorId;
}

function detectDevice(): string {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

export async function trackEvent(
  eventType: AnalyticsEvent['eventType'], 
  details: string = ''
) {
  if (typeof window === 'undefined') return;
  
  // Skip track during dev/localhost if desired, or allow for demonstration
  try {
    const payload = {
      visitorId: getVisitorId(),
      eventType,
      path: window.location.pathname + window.location.hash,
      details,
      country: 'UZ', // Default geolocation metric
      device: detectDevice()
    };

    // Lazy non-blocking fire-and-forget payload fetch
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {
    // Fail silently so analytics never interrupt user visual frames
  }
}
