import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Copy, CheckCircle2, AlertCircle, Upload, Loader,
  ShieldCheck, Clock, ChevronRight, Info
} from 'lucide-react';
import { formatPKR } from '../utils/currency';
import { API_BASE } from '../utils/api.ts';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DepositFormData {
  paymentMethod: 'jazzcash' | 'easypaisa';
  transactionReference: string;
  screenshot: File;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  onSubmit: (data: DepositFormData) => Promise<void>;
}

interface PaymentSettings {
  jazzcash:  { mobileNumber: string; accountName: string };
  easypaisa: { iban: string;         accountName: string };
}

// ── Defaults (used until API responds) ───────────────────────────────────────
const DEFAULT_SETTINGS: PaymentSettings = {
  jazzcash:  { mobileNumber: '983507701',             accountName: 'Naveed shop' },
  easypaisa: { iban:         'PK18TMFB0000000055079717', accountName: 'Naveed shop' },
};

// ── Small copy button ─────────────────────────────────────────────────────────
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all shrink-0 ${
        done
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white'
      }`}
    >
      {done ? <><CheckCircle2 size={11} /> Copied</> : <><Copy size={11} /> {label ?? 'Copy'}</>}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const DepositModal = ({ isOpen, onClose, planName, amount, onSubmit }: DepositModalProps) => {
  const [method, setMethod]               = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [txRef, setTxRef]                 = useState('');
  const [screenshot, setScreenshot]       = useState<File | null>(null);
  const [screenshotPreview, setPreview]   = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [settings, setSettings]           = useState<PaymentSettings>(DEFAULT_SETTINGS);

  // Fetch payment settings from DB on open
  useEffect(() => {
    if (!isOpen) return;
    const apiBase = API_BASE;
    fetch(`${apiBase}/api/settings/payment`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setSettings(d))
      .catch(() => {}); // silently fall back to defaults
  }, [isOpen]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files accepted (PNG, JPG)'); return; }
    if (file.size > 5 * 1024 * 1024)     { setError('File must be under 5MB'); return; }
    setScreenshot(file);
    setError('');
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txRef.trim())  { setError('Transaction ID / Reference is required'); return; }
    if (!screenshot)    { setError('Payment screenshot is required'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ paymentMethod: method, transactionReference: txRef.trim(), screenshot });
      reset(); onClose();
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMethod('jazzcash'); setTxRef(''); setScreenshot(null); setPreview(''); setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  // Payment card data — sourced from DB settings
  const jc = settings.jazzcash;
  const ep = settings.easypaisa;

  const jcSteps = [
    'Open JazzCash App',
    'Select Send Money',
    'Select Mobile Account',
    `Enter Mobile Number: ${jc.mobileNumber}`,
    `Account name should be: ${jc.accountName}`,
    `Enter exact amount: ${formatPKR(amount)}`,
    'Complete payment',
    'Save the Transaction ID',
    'Upload payment proof below',
  ];

  const epSteps = [
    'Open Easypaisa App',
    'Select Bank Transfer',
    `Enter IBAN: ${ep.iban}`,
    `Enter exact amount: ${formatPKR(amount)}`,
    'Complete payment',
    'Save transaction reference',
    'Upload payment proof below',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-[400px] max-h-[85vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0c1120] shadow-2xl shadow-black/70"
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/50 to-transparent" />

              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0c1120]/95 backdrop-blur-xl rounded-t-xl">
                <div>
                  <p className="text-xs font-bold text-white">Deposit Funds</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <span className="text-slate-600 truncate max-w-[120px]">{planName}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-nexus-primary font-semibold">{formatPKR(amount)}</span>
                  </p>
                </div>
                <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-all">
                  <X size={15} />
                </button>
              </div>

              <div className="p-4 space-y-3.5">

                {/* ── Amount Banner ── */}
                <div className="rounded-lg border border-nexus-primary/20 bg-nexus-primary/5 px-4 py-2.5 text-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Send Exactly</p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-cyan-400 leading-tight">
                    {formatPKR(amount)}
                  </p>
                  <p className="text-[9px] text-amber-400/80 mt-1 flex items-center justify-center gap-1">
                    <AlertCircle size={9} /> Wrong amount delays activation
                  </p>
                </div>

                {/* ── Method Tabs ── */}
                <div className="flex gap-1.5 p-1 bg-white/[0.03] border border-white/8 rounded-lg">
                  {(['jazzcash', 'easypaisa'] as const).map(m => (
                    <button key={m} type="button" onClick={() => setMethod(m)}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                        method === m
                          ? m === 'jazzcash' ? 'bg-red-500/15 border border-red-500/30 text-red-400' : 'bg-green-500/15 border border-green-500/30 text-green-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}>
                      {m === 'jazzcash' ? 'JazzCash' : 'Easypaisa'}
                    </button>
                  ))}
                </div>

                {/* ── Payment Detail Card ── */}
                <AnimatePresence mode="wait">
                  <motion.div key={method} initial={{ opacity: 0, x: method === 'jazzcash' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                    className={`rounded-lg border p-3 ${method === 'jazzcash' ? 'border-red-500/25 bg-gradient-to-br from-red-500/8 to-orange-500/4' : 'border-green-500/25 bg-gradient-to-br from-green-500/8 to-emerald-500/4'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${method === 'jazzcash' ? 'text-red-400' : 'text-green-400'}`}>
                      {method === 'jazzcash' ? 'JazzCash Details' : 'Easypaisa Details'}
                    </p>
                    {method === 'jazzcash' ? (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[8px] text-slate-500 uppercase">Mobile Account</p>
                          <p className="text-lg font-black text-white tracking-widest">{jc.mobileNumber}</p>
                          <p className="text-lg font-black text-white tracking-widest">{jc.accountName}</p>


                        </div>
                        <CopyBtn text={jc.mobileNumber} label="Copy" />
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[8px] text-slate-500 uppercase">IBAN</p>
                          <p className="text-xs font-bold text-white font-mono break-all leading-snug mt-0.5">{ep.iban}</p>
                          <p className="text-lg font-bold text-white text-shadow-indigo-50 mt-1">{ep.accountName}</p>

                        </div>
                        <CopyBtn text={ep.iban} label="Copy" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* ── Step-by-step Instructions ── */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    How to Pay
                  </p>
                  <div className="space-y-1.5">
                    {(method === 'jazzcash' ? jcSteps : epSteps).map((step, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.025] border border-white/5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 ${
                          method === 'jazzcash' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {i + 1}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/8" />
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Proof of Payment</p>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Plan summary read-only */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/6">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Plan</p>
                      <p className="text-xs font-bold text-white truncate">{planName}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/6">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Amount</p>
                      <p className="text-xs font-bold text-nexus-primary">{formatPKR(amount)}</p>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                      Transaction ID / Reference <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={txRef}
                      onChange={e => setTxRef(e.target.value)}
                      placeholder="e.g. TXN123456789"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/8 text-white text-sm placeholder-slate-600 focus:border-nexus-primary/40 focus:outline-none transition-colors"
                    />
                    <p className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Info size={10} /> Copy the Transaction ID from your payment receipt
                    </p>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                      Payment Screenshot <span className="text-rose-400">*</span>
                    </label>
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="dep-screenshot" />
                    <label htmlFor="dep-screenshot" className="block cursor-pointer">
                      {screenshotPreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-nexus-primary/30 group">
                          <img src={screenshotPreview} alt="preview" className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-lg">Tap to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-nexus-primary/30 hover:bg-white/[0.02] transition-all">
                          <div className="w-10 h-10 rounded-xl bg-nexus-primary/10 border border-nexus-primary/20 flex items-center justify-center mx-auto mb-2">
                            <Upload size={18} className="text-nexus-primary" />
                          </div>
                          <p className="text-xs font-semibold text-white">Upload Screenshot</p>
                          <p className="text-[10px] text-slate-600 mt-1">PNG, JPG — max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-rose-300 text-xs">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 py-1">
                    {[
                      { icon: ShieldCheck, label: 'Secure', color: 'text-emerald-400' },
                      { icon: Clock,       label: '24h Approval', color: 'text-cyan-400' },
                    ].map(({ icon: Icon, label, color }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Icon size={12} className={color} />
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl gradient-primary text-slate-900 font-bold text-sm shadow-lg shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <><Loader size={16} className="animate-spin" /> Processing…</>
                      : <>Submit Deposit Request <ChevronRight size={15} /></>
                    }
                  </button>

                  <p className="text-[10px] text-slate-700 text-center">
                    Your plan activates automatically after admin verifies the payment.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
