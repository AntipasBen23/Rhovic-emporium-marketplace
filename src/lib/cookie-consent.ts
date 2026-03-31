export type CookieConsent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "rhovic-cookie-consent";
const EVENT_NAME = "rhovic-cookie-consent-changed";
const COOKIE_NAME = "rhovic_cookie_consent";
const OPEN_PREFERENCES_EVENT = "rhovic-cookie-consent-open";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function writeCookieConsent(consent: CookieConsent) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const saved = parseConsent(localStorage.getItem(STORAGE_KEY));
  if (saved) {
    writeCookieConsent(saved);
    return saved;
  }
  const cookieConsent = parseConsent(getCookieValue(COOKIE_NAME));
  if (cookieConsent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cookieConsent));
    return cookieConsent;
  }
  return null;
}

export function saveCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  writeCookieConsent(consent);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: consent }));
}

export function onCookieConsentChange(callback: (consent: CookieConsent | null) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<CookieConsent>).detail;
    callback(detail || getCookieConsent());
  };
  window.addEventListener(EVENT_NAME, handler as EventListener);
  return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
}

export function cookieConsentLabel(consent: CookieConsent | null) {
  if (!consent) return "Not set";
  return consent.analytics ? "Essential + analytics" : "Essential only";
}

export function buildConsent(analytics: boolean): CookieConsent {
  return {
    essential: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

export function onOpenCookiePreferences(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
}
