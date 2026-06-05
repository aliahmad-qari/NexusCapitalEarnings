import React, { useState } from 'react';
import { MessageSquare, HelpCircle, Mail, MessageCircle, Send, CheckCircle2, ChevronDown, Globe, Clock, Headphones, Activity, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Support = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: "How are daily yields calculated?", a: "Our AI-driven strategies use high-frequency arbitrage and institutional settlement cycles to generate returns. Profits are distributed daily based on your plan's profit percentage and invested amount." },
    { q: "What is the maximum withdrawal limit?", a: "Withdrawal limits vary by plan, typically ranging from $10 to $50,000 per cycle. VIP plan holders have higher limits with priority processing." },
    { q: "Is my investment capital protected?", a: "Yes, Nexus Capital maintains a global reserve pool that protects against extreme market volatility, keeping your principal secure at all times." },
    { q: "Can I have multiple active investment plans?", a: "Absolutely. You can run multiple investment plans simultaneously across different strategies within the same account." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-nexus-primary">
          <Headphones size={14} className="animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Help & Support</span>
        </div>
        <h2 className="text-xl font-bold text-white">Support Center</h2>
        <p className="text-slate-500 text-xs">Get help with your account, investments, and transactions.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left: Form + FAQ */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Contact Form */}
          <div className="nexus-card p-6 md:p-8 space-y-6 border-white/8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl glass border-nexus-primary/20 text-nexus-primary">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Contact Support</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">Send us a message and we'll get back to you within 2 hours</p>
              </div>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center justify-center text-center space-y-4 bg-nexus-primary/5 border border-nexus-primary/20 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-nexus-primary/10 flex items-center justify-center border border-nexus-primary/20">
                  <CheckCircle2 size={28} className="text-nexus-primary" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Message Sent!</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">Your ticket #{Math.floor(Math.random()*9000)+1000} has been created. A support agent will respond within 2 hours.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="px-5 py-2.5 glass border-white/5 text-xs font-semibold text-slate-500 hover:text-white rounded-xl transition-all">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Your Name</label>
                    <input type="text" placeholder="Full name" required className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-xs font-medium text-white placeholder:text-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="your@email.com" required className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-sm text-white placeholder:text-slate-800" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Issue Category</label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-xs font-medium text-slate-400 appearance-none">
                      <option>Deposit / Withdrawal Issue</option>
                      <option>Investment Plan Question</option>
                      <option>Account Access Problem</option>
                      <option>Strategy & Returns</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={15} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Message</label>
                  <textarea rows={5} placeholder="Describe your issue in detail..." required className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 outline-none focus:border-nexus-primary/30 text-sm text-white placeholder:text-slate-800 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3.5 gradient-primary text-slate-900 rounded-xl font-semibold text-sm shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
                  Submit Ticket <Activity size={15} />
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <div className="p-2 glass rounded-lg border-white/5">
                <HelpCircle size={14} className="text-slate-600" />
              </div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`nexus-card p-0 overflow-hidden border-white/5 transition-all ${activeFaq === idx ? 'bg-white/[0.02] border-white/10' : 'bg-transparent'}`}>
                  <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-5 text-left flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-700 group-hover:text-nexus-primary transition-colors">{String(idx + 1).padStart(2, '0')}</span>
                      <span className={`text-xs font-semibold ${activeFaq === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{faq.q}</span>
                    </div>
                    <div className={`w-7 h-7 rounded-lg glass border-white/5 flex items-center justify-center transition-all ${activeFaq === idx ? 'rotate-180 bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 'text-slate-700'}`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-black/30">
                        <div className="px-6 pb-5 pt-1 text-xs text-slate-400 leading-relaxed max-w-2xl ml-8">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Contact Info */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* Live Support */}
          <div className="nexus-card p-6 bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-white/15 shadow-xl">
            <div className="space-y-1 mb-5">
              <h4 className="text-sm font-bold text-white">Live Support</h4>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
                <span className="text-[10px] font-medium text-nexus-primary">Online · All agents available</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 glass border-white/5 rounded-2xl flex items-center justify-between group/chat hover:border-nexus-primary/40 transition-all hover:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl text-nexus-primary group-hover/chat:scale-105 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Live Chat</p>
                    <p className="text-[10px] text-slate-600">Instant support</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-600 group-hover/chat:text-nexus-primary transition-colors" />
              </button>

              <div className="p-5 glass border-white/5 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-slate-400">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Global Offices</p>
                    <p className="text-[10px] text-slate-600">Worldwide support teams</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l border-white/5 pl-3">
                    <p className="text-[10px] font-medium text-slate-400">London</p>
                    <p className="text-[10px] text-slate-600">+44 20 7946 0958</p>
                  </div>
                  <div className="border-l border-white/5 pl-3">
                    <p className="text-[10px] font-medium text-slate-400">Singapore</p>
                    <p className="text-[10px] text-slate-600">+65 6744 1234</p>
                  </div>
                </div>
              </div>

              <div className="p-5 nexus-card border-none bg-black/50 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-xl text-nexus-magenta">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Support Hours</p>
                    <p className="text-[10px] text-slate-600">Available times</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 glass border-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-500">Live Chat</span>
                    <span className="text-[10px] font-semibold text-white">24/7</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass border-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-500">Phone Support</span>
                    <span className="text-[10px] font-semibold text-white">08:00–18:00 GMT</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass border-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-500">Avg. Response</span>
                    <span className="text-[10px] font-semibold text-nexus-primary">&lt; 2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
