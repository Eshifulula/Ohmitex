'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, ChevronDown, ChevronUp, Shield } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ConsentPreferences {
    essential: boolean;    // Always true — cannot be disabled
    analytics: boolean;
    marketing: boolean;
}

type ConsentState = 'pending' | 'accepted' | 'rejected' | 'custom';

const COOKIE_NAME = 'ohmitex-cookie-consent';
const STORAGE_KEY = 'ohmitex-consent-preferences';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if consent was already given
        const existing = getCookieValue(COOKIE_NAME);
        if (!existing) {
            // Small delay so the page loads first before the banner appears
            const timer = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(timer);
        }
        // Restore saved preferences
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setPreferences(JSON.parse(saved));
        } catch {/* ignore */}
    }, []);

    function saveConsent(state: ConsentState, prefs: ConsentPreferences) {
        setCookie(COOKIE_NAME, state, 365);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {/* ignore */}
        // Dispatch event so analytics can react
        window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: { state, prefs } }));
        setVisible(false);
        setShowModal(false);
    }

    function acceptAll() {
        const prefs: ConsentPreferences = { essential: true, analytics: true, marketing: true };
        setPreferences(prefs);
        saveConsent('accepted', prefs);
    }

    function rejectNonEssential() {
        const prefs: ConsentPreferences = { essential: true, analytics: false, marketing: false };
        setPreferences(prefs);
        saveConsent('rejected', prefs);
    }

    function saveCustom() {
        saveConsent('custom', preferences);
    }

    if (!visible && !showModal) return null;

    return (
        <>
            {/* ----------------------------------------------------------------
                Banner — slides up from bottom
            ---------------------------------------------------------------- */}
            {visible && !showModal && (
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Cookie consent"
                >
                    {/* Backdrop gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    <div className="relative bg-white border-t border-gray-200 shadow-2xl">
                        <div className="container mx-auto px-4 py-5 max-w-7xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Icon + text */}
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                        <Cookie className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 mb-1">
                                            We use cookies to enhance your experience
                                        </p>
                                        <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                                            We use essential cookies to make our site work. With your
                                            consent, we may also use analytics cookies to understand how
                                            you use our site. See our{' '}
                                            <Link href="/privacy-policy" className="text-accent underline underline-offset-2 hover:text-primary transition-colors">
                                                Privacy Policy
                                            </Link>{' '}
                                            for full details.
                                        </p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-2 flex-shrink-0 sm:ml-4">
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-xs px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                        id="cookie-manage-btn"
                                    >
                                        Manage
                                    </button>
                                    <button
                                        onClick={rejectNonEssential}
                                        className="text-xs px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                        id="cookie-reject-btn"
                                    >
                                        Reject non-essential
                                    </button>
                                    <button
                                        onClick={acceptAll}
                                        className="text-xs px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors font-semibold shadow-sm"
                                        id="cookie-accept-btn"
                                    >
                                        Accept all
                                    </button>
                                </div>

                                {/* Close (acts as reject, minimal friction) */}
                                <button
                                    onClick={rejectNonEssential}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors sm:self-start"
                                    aria-label="Close cookie banner"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------------------------------------------------------
                Modal — granular preferences
            ---------------------------------------------------------------- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal card */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">Cookie Preferences</h2>
                                    <p className="text-xs text-gray-500">Manage your privacy settings</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); setVisible(true); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                We respect your right to privacy. Choose which cookies you allow.
                                Essential cookies cannot be disabled as they are required for the site
                                to function properly. View our{' '}
                                <Link href="/privacy-policy" className="text-accent underline underline-offset-2 hover:text-primary">
                                    Privacy Policy
                                </Link>{' '}
                                for more details.
                            </p>

                            {/* Cookie categories */}
                            <div className="space-y-3">
                                {/* Essential */}
                                <CookieCategory
                                    title="Essential Cookies"
                                    description="Required for the website to function. Cannot be disabled. Includes session management, security, and basic functionality."
                                    checked={true}
                                    disabled={true}
                                    onChange={() => {}}
                                    badge="Always active"
                                    badgeColor="bg-green-100 text-green-700"
                                />

                                {/* Analytics */}
                                <CookieCategory
                                    title="Analytics Cookies"
                                    description="Help us understand how visitors interact with the website, allowing us to improve our content and services. No personally identifiable information is collected."
                                    checked={preferences.analytics}
                                    onChange={(v) => setPreferences(p => ({ ...p, analytics: v }))}
                                    badge="Optional"
                                    badgeColor="bg-blue-100 text-blue-700"
                                />

                                {/* Marketing */}
                                <CookieCategory
                                    title="Marketing Cookies"
                                    description="Used to deliver relevant advertisements and track the effectiveness of marketing campaigns. May be set by third-party advertising partners."
                                    checked={preferences.marketing}
                                    onChange={(v) => setPreferences(p => ({ ...p, marketing: v }))}
                                    badge="Optional"
                                    badgeColor="bg-blue-100 text-blue-700"
                                />
                            </div>

                            {/* Details toggle */}
                            <button
                                onClick={() => setShowDetails(d => !d)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                {showDetails ? 'Hide details' : 'Show cookie details'}
                            </button>

                            {showDetails && (
                                <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4 space-y-2">
                                    <p><strong>ohmitex-cookie-consent</strong> — Stores your cookie consent choice. Expires in 365 days.</p>
                                    <p><strong>auth-token</strong> — HTTP-only session cookie for the admin panel. Essential.</p>
                                    <p><strong>_ga, _gid</strong> — Google Analytics cookies (if analytics is enabled). Expire in 2 years / 24h.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                            <button
                                onClick={rejectNonEssential}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                id="modal-reject-btn"
                            >
                                Reject non-essential
                            </button>
                            <button
                                onClick={saveCustom}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-primary text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
                                id="modal-save-btn"
                            >
                                Save preferences
                            </button>
                            <button
                                onClick={acceptAll}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm hover:bg-accent/90 transition-colors font-semibold shadow-sm"
                                id="modal-accept-btn"
                            >
                                Accept all
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
}

// ---------------------------------------------------------------------------
// Sub-component: Cookie category toggle row
// ---------------------------------------------------------------------------
interface CookieCategoryProps {
    title: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (value: boolean) => void;
    badge: string;
    badgeColor: string;
}

function CookieCategory({ title, description, checked, disabled, onChange, badge, badgeColor }: CookieCategoryProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="text-sm font-semibold text-gray-800 flex items-center gap-1 hover:text-gray-600 transition-colors"
                    >
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {title}
                    </button>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>{badge}</span>
                </div>

                {/* Toggle switch */}
                <button
                    role="switch"
                    aria-checked={checked}
                    aria-disabled={disabled}
                    disabled={disabled}
                    onClick={() => !disabled && onChange(!checked)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
                        ${checked ? 'bg-accent' : 'bg-gray-300'}
                        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
            {open && (
                <div className="px-4 py-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
                    {description}
                </div>
            )}
        </div>
    );
}
