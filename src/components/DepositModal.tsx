import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, CheckCircle2, AlertCircle, Upload, Loader, ShieldCheck, Clock } from 'lucide-react';
import { formatPKR } from '../utils/currency';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  onSubmit: (data: DepositFormData) => Promise<void>;
}

export interface DepositFormData {
  paymentMethod: 'jazzcash' | 'easypaisa';
  transactionReference: string;
  screenshot: File;
}

const PAYMENT_ACCOUNTS = {
  jazzcash: {
    title: 'JazzCash',
    titleUrdu: 'جاز کیش',
    number: '0300-1234567',
    accountName: 'NexusCapital Official',
    accountNameUrdu: 'نیکسس کیپیٹل آفیشل',
    type: 'Mobile Account',
    typeUrdu: 'موبائل اکاؤنٹ',
    color: 'from-red-500/20 to-orange-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500',
    instructions: [
      { en: 'Open JazzCash app on your phone', ur: 'اپنے فون پر جاز کیش ایپ کھولیں' },
      { en: 'Go to Send Money → Mobile Account', ur: 'Send Money → Mobile Account پر جائیں' },
      { en: `Enter number: 0300-1234567`, ur: `نمبر درج کریں: 0300-1234567` },
      { en: `Enter exact amount: ${formatPKR(0)}`, ur: `بالکل یہ رقم ڈالیں` },
      { en: 'Save the transaction ID from receipt', ur: 'رسید سے ٹرانزیکشن ID محفوظ کریں' },
    ],
  },
  easypaisa: {
    title: 'Easypaisa',
    titleUrdu: 'ایزی پیسہ',
    number: 'PK18TMFB0000000055079717',
    accountName: 'NexusCapital Official',
    accountNameUrdu: 'نیکسس کیپیٹل آفیشل',
    type: 'IBAN / Bank Transfer',
    typeUrdu: 'آئی بی اے این / بینک ٹرانسفر',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    dot: 'bg-green-500',
    instructions: [
      { en: 'Open Easypaisa app or visit any branch', ur: 'ایزی پیسہ ایپ کھولیں یا کسی بھی برانچ پر جائیں' },
      { en: 'Go to Bank Transfer → IBAN Transfer', ur: 'Bank Transfer → IBAN Transfer پر جائیں' },
      { en: 'Enter IBAN: PK18TMFB0000000055079717', ur: 'آئی بی اے این درج کریں' },
      { en: `Enter exact amount`, ur: `بالکل یہ رقم ڈالیں` },
      { en: 'Save the transaction ID from receipt', ur: 'رسید سے ٹرانزیکشن ID محفوظ کریں' },
    ],
  },
};

export const DepositModal = ({ isOpen, onClose, planName, amount, onSubmit }: DepositModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const account = PAYMENT_ACCOUNTS[selectedMethod];

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('صرف تصویر فائل قابل قبول ہے / Only image files accepted'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('فائل 5MB سے کم ہونی چاہیے / File must be under 5MB'); return; }
    setScreenshot(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) { setError('ٹرانزیکشن ID درج کریں / Enter Transaction ID'); return; }
    if (!screenshot) { setError('اسکرین شاٹ اپلوڈ کریں / Upload screenshot'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ paymentMethod: selectedMethod, transactionReference: transactionRef.trim(), screenshot });
      // reset
      setStep(1); setTransactionRef(''); setScreenshot(null); setScreenshotPreview(''); setError('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'ڈیپازٹ ناکام / Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1); setTransactionRef(''); setScreenshot(null); setScreenshotPreview(''); setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40" />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-black/60"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/8 bg-slate-900/95 backdrop-blur-xl rounded-t-2xl">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Deposit / <span className="text-cyan-400" style={{ fontFamily: 'serif' }}>ڈیپازٹ</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {planName} • <span className="text-cyan-400 font-bold">{formatPKR(amount)}</span>
                  </p>
                </div>
                <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                {[1, 2].map((s) => (
                  <button key={s} onClick={() => s === 1 && setStep(1)}
                    className={`flex items-center gap-2 text-[11px] font-semibold transition-all ${step === s ? 'text-cyan-400' : 'text-slate-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === s ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : s < step ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' : 'border-white/10 text-slate-600'}`}>
                      {s < step ? '✓' : s}
                    </span>
                    {s === 1 ? 'Payment / ادائیگی' : 'Proof / ثبوت'}
                  </button>
                ))}
                <div className="flex-1 h-px bg-white/5 mx-1" />
              </div>

              <div className="p-5 space-y-5">

                {step === 1 && (
                  <>
                    {/* Amount Banner */}
                    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 p-4 text-center">
                      <p className="text-[10px] text-slate-500 mb-1">رقم بھیجیں / Send Exactly</p>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{formatPKR(amount)}</p>
                    </div>

                    {/* Method Select */}
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(PAYMENT_ACCOUNTS) as [keyof typeof PAYMENT_ACCOUNTS, typeof PAYMENT_ACCOUNTS.jazzcash][]).map(([key, acc]) => (
                        <button key={key} type="button" onClick={() => setSelectedMethod(key)}
                          className={`relative p-3.5 rounded-xl border text-left transition-all ${selectedMethod === key ? `bg-gradient-to-br ${acc.color} ${acc.border}` : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}>
                          {selectedMethod === key && (
                            <span className={`absolute top-2 right-2 w-4 h-4 rounded-full ${acc.dot} flex items-center justify-center`}>
                              <CheckCircle2 size={10} className="text-white" />
                            </span>
                          )}
                          <p className="text-sm font-bold text-white">{acc.title}</p>
                          <p className="text-[10px] text-slate-400" style={{ fontFamily: 'serif' }}>{acc.titleUrdu}</p>
                          <span className={`mt-2 inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full border ${acc.badge}`}>{acc.type}</span>
                        </button>
                      ))}
                    </div>

                    {/* Account Details */}
                    <div className={`rounded-xl border bg-gradient-to-br ${account.color} ${account.border} p-4 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">{account.type}</p>
                          <p className="text-xs font-mono font-bold text-white break-all mt-0.5">{account.number}</p>
                        </div>
                        <button onClick={() => handleCopy(account.number)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all shrink-0">
                          {copied ? <><CheckCircle2 size={12} className="text-emerald-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                      <div className="h-px bg-white/8" />
                      <div>
                        <p className="text-[9px] text-slate-500">Account Name / اکاؤنٹ نام</p>
                        <p className="text-xs font-semibold text-white mt-0.5">{account.accountName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5" style={{ fontFamily: 'serif' }}>{account.accountNameUrdu}</p>
                      </div>
                    </div>

                    {/* Step by Step Instructions */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">How to Pay / ادائیگی کا طریقہ</p>
                      <div className="space-y-2">
                        {account.instructions.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <div>
                              <p className="text-xs text-slate-200">{step.en.replace('${formatPKR(0)}', formatPKR(amount))}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: 'serif' }}>{step.ur.replace('بالکل یہ رقم ڈالیں', `بالکل یہ رقم ڈالیں: ${formatPKR(amount)}`)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                      <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <p className="text-amber-200 font-semibold">Important / اہم</p>
                        <p className="text-slate-400 mt-0.5">Send exactly <strong className="text-amber-300">{formatPKR(amount)}</strong>. Wrong amount will delay activation.</p>
                        <p className="text-slate-500 mt-0.5" style={{ fontFamily: 'serif' }}>بالکل <strong className="text-amber-300">{formatPKR(amount)}</strong> بھیجیں۔ غلط رقم سے تاخیر ہوگی۔</p>
                      </div>
                    </div>

                    <button onClick={() => setStep(2)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      I've Sent Payment / میں نے پیسے بھیج دیے ✓
                    </button>
                  </>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color} ${account.border} border flex items-center justify-center text-sm font-bold text-white`}>
                        {selectedMethod === 'jazzcash' ? 'J' : 'E'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{account.title} → {formatPKR(amount)}</p>
                        <p className="text-[10px] text-slate-500 truncate">{account.number}</p>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="text-[10px] text-cyan-400 hover:underline shrink-0">Change</button>
                    </div>

                    {/* Transaction ID */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Transaction ID <span className="text-red-400">*</span>
                        <span className="text-slate-500 ml-1" style={{ fontFamily: 'serif' }}>/ ٹرانزیکشن آئی ڈی</span>
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. TXN123456789"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/8 text-white text-sm placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none transition-colors"
                      />
                      <p className="text-[10px] text-slate-600" style={{ fontFamily: 'serif' }}>ادائیگی کی رسید سے ٹرانزیکشن نمبر کاپی کریں</p>
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Payment Screenshot <span className="text-red-400">*</span>
                        <span className="text-slate-500 ml-1" style={{ fontFamily: 'serif' }}>/ ادائیگی کا اسکرین شاٹ</span>
                      </label>
                      <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" id="deposit-screenshot" />
                      <label htmlFor="deposit-screenshot" className="block cursor-pointer">
                        {screenshotPreview ? (
                          <div className="relative rounded-xl overflow-hidden border border-cyan-500/30">
                            <img src={screenshotPreview} alt="screenshot" className="w-full h-44 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                              <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded-lg">Tap to change / تبدیل کریں</span>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-cyan-500/30 transition-colors bg-white/[0.02]">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                              <Upload size={20} className="text-cyan-400" />
                            </div>
                            <p className="text-sm font-semibold text-white mb-1">Upload Screenshot</p>
                            <p className="text-[11px] text-slate-500" style={{ fontFamily: 'serif' }}>اسکرین شاٹ اپلوڈ کریں</p>
                            <p className="text-[10px] text-slate-700 mt-2">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-white">Secure</p>
                          <p className="text-[9px] text-slate-600" style={{ fontFamily: 'serif' }}>محفوظ</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <Clock size={13} className="text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-white">24h Approval</p>
                          <p className="text-[9px] text-slate-600" style={{ fontFamily: 'serif' }}>24 گھنٹے منظوری</p>
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <><Loader size={16} className="animate-spin" /> Processing...</> : <>Submit Deposit Request / درخواست جمع کریں</>}
                    </button>

                    <p className="text-[10px] text-slate-600 text-center" style={{ fontFamily: 'serif' }}>
                      منظوری کے بعد آپ کا پلان خودبخود فعال ہو جائے گا
                      <br /><span className="not-italic">Plan activates automatically after admin approval.</span>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
