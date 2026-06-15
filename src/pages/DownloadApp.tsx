import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Clock, ShieldCheck, ArrowLeft, CheckCircle2,
  Smartphone, Package, Lock, Wifi,
} from 'lucide-react';
import {
  checkApkAvailable, formatApkSize, APK_INFO, type ApkAvailability,
} from '../utils/apkConfig.ts';

// Android robot mark (inline — lucide has no Android glyph)
const AndroidIcon = ({ size = 28, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
  </svg>
);

const installSteps = [
  'Tap "Download APK" — the file saves to your phone.',
  'Open the downloaded nexus-capital.apk file.',
  'If prompted, allow "Install from unknown sources".',
  'Tap Install, then Open to launch Nexus Capital.',
];

export const DownloadApp = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ApkAvailability>({ available: false, sizeBytes: null, checked: false });

  useEffect(() => {
    const ctrl = new AbortController();
    checkApkAvailable(ctrl.signal).then(setState);
    return () => ctrl.abort();
  }, []);

  const handleDownload = () => {
    if (!state.available) return;
    const a = document.createElement('a');
    a.href = APK_INFO.apkPath;
    a.download = 'nexus-capital.apk';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const ready = state.checked && state.available;
  const comingSoon = state.checked && !state.available;

  return (
    <div className="min-h-screen bg-nexus-bg text-on-surface flex flex-col items-center px-5 py-10 sm:py-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-nexus-primary/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-nexus-secondary/6 blur-[120px] rounded-full pointer-events-none" />

      {/* Back */}
      <div className="w-full max-w-3xl relative z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to site
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl relative z-10 glass-card rounded-3xl border border-white/10 p-7 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* App logo */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-3xl primary-gradient p-0.5 shadow-xl shadow-nexus-primary/25">
              <div className="w-full h-full rounded-[1.4rem] bg-nexus-bg flex items-center justify-center border border-black/30 overflow-hidden">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Nexus Capital"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget.style.display = 'none'); }}
                />
              </div>
            </div>
          </div>

          {/* Title + meta */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/20 rounded-full px-3 py-1">
              <AndroidIcon size={13} className="text-nexus-primary" />
              <span className="text-nexus-primary text-[11px] font-semibold uppercase tracking-widest">Android App</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{APK_INFO.appName}</h1>
            <p className="text-slate-400 text-sm max-w-md">
              Install the official Nexus Capital app and manage your investments, track daily ROI,
              and withdraw — directly from your phone. No Play Store required.
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {[
                { icon: Package, label: `v${APK_INFO.version}` },
                { icon: Download, label: ready ? formatApkSize(state.sizeBytes) : APK_INFO.approxSize },
                { icon: Smartphone, label: APK_INFO.minAndroid },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs font-semibold text-slate-300">
                  <Icon size={13} className="text-nexus-primary" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Download / Coming soon CTA */}
        <div className="mt-8">
          {!state.checked ? (
            <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-nexus-primary/30 border-t-nexus-primary rounded-full animate-spin" />
              Checking availability…
            </div>
          ) : ready ? (
            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-2xl primary-gradient text-nexus-bg font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-nexus-primary/25 hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <Download size={20} strokeWidth={2.5} /> Download APK ({formatApkSize(state.sizeBytes)})
            </button>
          ) : (
            <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold text-base flex items-center justify-center gap-2.5">
              <Clock size={20} /> Coming Soon
            </div>
          )}
          {comingSoon && (
            <p className="text-center text-xs text-slate-500 mt-3">
              The Android app is being finalized. In the meantime, you can{' '}
              <button onClick={() => navigate('/register')} className="text-nexus-primary hover:underline font-semibold">
                use the web app
              </button>{' '}
              — it works on every device.
            </p>
          )}
        </div>

        {/* Install instructions */}
        <div className="mt-9">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">How to install</h2>
          <div className="space-y-2.5">
            {installSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/6">
                <span className="w-5 h-5 rounded-full bg-nexus-primary/15 border border-nexus-primary/25 text-nexus-primary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: 'Official build', sub: 'Signed by Nexus Capital' },
            { icon: Lock, label: 'Secure', sub: 'Same encrypted backend' },
            { icon: Wifi, label: 'Live data', sub: 'Real-time ROI & wallet' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/6">
              <div className="p-2 rounded-lg bg-nexus-primary/10 border border-nexus-primary/20 text-nexus-primary shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  {label} <CheckCircle2 size={11} className="text-nexus-primary" />
                </p>
                <p className="text-[10px] text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-slate-600 text-[11px] mt-6 relative z-10 text-center max-w-md">
        Installing apps from outside the Play Store requires enabling “unknown sources”.
        Nexus Capital connects to the same secure backend as the website.
      </p>
    </div>
  );
};
