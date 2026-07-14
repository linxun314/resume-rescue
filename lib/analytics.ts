// lib/analytics.ts - 轻量埋点工具（基于 localStorage）

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number>;
  timestamp: number;
  anonymous_id: string;
  session_id: string;
}

function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('anonymous_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('anonymous_id', id);
  }
  return id;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('session_id', id);
  }
  return id;
}

export function track(event: string, properties?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;

  const entry: AnalyticsEvent = {
    event,
    properties,
    timestamp: Date.now(),
    anonymous_id: getAnonymousId(),
    session_id: getSessionId(),
  };

  // 存入 localStorage（后续可接入 Umami / PostHog）
  const key = 'analytics_events';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(entry);
  // 只保留最近 200 条
  if (existing.length > 200) existing.splice(0, existing.length - 200);
  localStorage.setItem(key, JSON.stringify(existing));

  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }
}
