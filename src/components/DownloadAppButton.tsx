import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Clock } from 'lucide-react';
import { checkApkAvailable, APK_INFO } from '../utils/apkConfig.ts';

// ── Android robot mark (inline SVG — lucide has no Android glyph) ──────────────
const AndroidIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
  </svg>
);

type Variant = 'primary' | 'ghost' | 'compact';

interface DownloadAppButtonProps {
  variant?: Variant;
  className?: string;
  /** Override the label; defaults vary by availability. */
  label?: string;
  /** When true, navigates to the rich /download-app page instead of direct download. */
  toDownloadPage?: boolean;
  onNavigate?: () => void; // e.g. close a mobile menu
}

/**
 * Premium, fully-responsive "Download Android App" button.
 * - APK hosted  → routes to /download-app (or direct-downloads when toDownloadPage=false)
 * - APK missing → renders a non-clickable "Coming Soon" state
 * Availability is probed once via a HEAD request (see apkConfig).
 */
export const DownloadAppButton = ({
  variant = 'primary',
  className = '',
  label,
  toDownloadPage = true,
  onNavigate,
}: DownloadAppButtonProps) => {
  const navigate = useNavigate();
  const [available, setAvailable] = useState<boolean | null>(null); // null = checking
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    checkApkAvailable(ctrl.signal).then((r) => setAvailable(r.available));
    return () => ctrl.abort();
  }, []);

  const handleClick = () => {
    if (!available) return;
    onNavigate?.();
    if (toDownloadPage) {
      navigate(APK_INFO.downloadPageRoute);
    } else {
      // Direct download via a transient anchor.
      const a = document.createElement('a');
      a.href = APK_INFO.apkPath;
      a.download = 'nexus-capital.apk';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const isComingSoon = available === false;
  const isChecking = available === null;

  // ── Shared content ──────────────────────────────────────────────────────────
  const text =
    label ?? (isComingSoon ? 'Android App — Coming Soon' : 'Download Android App');

  const Icon = isComingSoon ? Clock : AndroidIcon;

  // ── Variant styles ──────────────────────────────────────────────────────────
  const base =
    'inline-flex items-center justify-center gap-2 font-bold transition-all select-none whitespace-nowrap';

  const variants: Record<Variant, string> = {
    // Hero / standalone CTA — gradient, prominent
    primary:
      'text-sm px-6 py-3.5 rounded-xl shadow-lg ' +
      (isComingSoon
        ? 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed'
        : 'primary-gradient text-nexus-bg shadow-nexus-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-95'),
    // Navbar — glassy, subtle
    ghost:
      'text-sm px-4 py-2.5 rounded-xl border ' +
      (isComingSoon
        ? 'bg-white/5 text-slate-500 border-white/10 cursor-not-allowed'
        : 'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/25 hover:bg-nexus-primary/15 active:scale-95'),
    // Mobile menu / tight spaces — full width friendly
    compact:
      'text-xs px-3 py-2 rounded-lg border ' +
      (isComingSoon
        ? 'bg-white/5 text-slate-500 border-white/10 cursor-not-allowed'
        : 'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/25 hover:bg-nexus-primary/15 active:scale-95'),
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isComingSoon || isChecking}
      aria-label={text}
      title={isComingSoon ? 'Android app coming soon' : text}
      className={`${base} ${variants[variant]} ${isChecking ? 'opacity-70' : ''} ${className}`}
    >
      <Icon size={variant === 'compact' ? 14 : 16} className="shrink-0" />
      <span>{text}</span>
    </button>
  );
};
