import React, { useState } from 'react';
import { 
  MessageSquare, HelpCircle, Mail, Phone, 
  MessageCircle, Send, CheckCircle2, ChevronDown,
  Globe, Clock, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Support = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: "How exactly are daily yields calculated?", a: "Our AI-driven strategies utilize high-frequency arbitrage and institutional settlement cycles to generate yield. These profits are distributed based on your node's daily profit percentage and capital stake." },
    { q: "What is the maximum withdrawal threshold?", a: "Withdrawals are subject to node-specific constraints. Typically, limits range from $10.00 to $50,000.00 per harvesting cycle. VIP nodes have uncapped liquidity extractions." },
    { q: "Is my capital node insured against volatility?", a: "Yes, Nexus Capital maintains a global reserve pool ($GRP) that cushions strategy nodes against extreme market anomalies, ensuring the 'Principal Protection' protocol remains active." },
    { q: "Can I deploy multiple strategy nodes?", a: "Absolutely. You can run unlimited concurrent strategy nodes across different registries (Starter, Gold, VIP) simultaneously." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12 pb-32 lg:pb-12 text-slate-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Headphones size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Concierge</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nexus <span className="text-gradient">Support</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-[0.2em] leading-relaxed">24/7 institutional assistance for all registered ambassador nodes and strategy deployments.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Support Forms */}
        <div className="lg:col-span-7 space-y-8">
           <div className="nexus-card p-10 bg-gradient-to-br from-white/[0.01] to-transparent border-white/5 space-y-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 glass rounded-2xl border-nexus-primary/20 text-nexus-primary shadow-lg shadow-nexus-primary/5">
                    <Send size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">Direct Transmission</h3>
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em]">Encrypted support channel</p>
                 </div>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 flex flex-col items-center justify-center text-center space-y-6 bg-nexus-primary/10 border border-nexus-primary/20 rounded-[40px]"
                >
                   <CheckCircle2 size={48} className="text-nexus-primary" />
                   <div>
                      <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Signal Received</h4>
                      <p className="text-xs font-medium text-slate-400 normal-case">Operational ticket #NX-8829 has been registered. An specialist will decrypt your signal within 120 minutes.</p>
                   </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Identity Hub</label>
                        <input type="text" placeholder="FULL NAME" required className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-xs font-black placeholder:text-slate-800" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Signal Path</label>
                        <input type="email" placeholder="SECURE MAIL" required className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-xs font-black placeholder:text-slate-800" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Issue Registry</label>
                     <select className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-xs font-black text-slate-400 appearance-none bg-transparent">
                        <option>Capital Settlement Delay</option>
                        <option>Node Deployment Error</option>
                        <option>Account Sync Issues</option>
                        <option>Strategy Optimization Question</option>
                        <option>Other Operational Issues</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Detailed Signal</label>
                     <textarea rows={5} placeholder="DESCRIBE THE OPERATION LOG IN DETAIL..." required className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-xs font-medium normal-case placeholder:text-slate-800 resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-full h-18 gradient-primary text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-nexus-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                     Transmit Signal
                  </button>
                </form>
              )}
           </div>

           {/* FAQ Section */}
           <div className="space-y-6">
              <div className="flex items-center gap-4 px-4">
                 <HelpCircle size={18} className="text-slate-600" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Library (FAQ)</h3>
              </div>
              <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                   <div key={idx} className="nexus-card p-0 overflow-hidden border-white/5">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/[0.02] transition-all"
                      >
                         <span className="text-xs font-black uppercase tracking-tight text-slate-300">{faq.q}</span>
                         <ChevronDown size={18} className={`text-slate-600 transition-transform duration-500 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20"
                          >
                             <div className="p-6 pt-0 text-[11px] font-medium text-slate-500 leading-relaxed normal-case">
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

        {/* Global Connection Nodes */}
        <div className="lg:col-span-5 space-y-8">
           <div className="nexus-card p-8 bg-gradient-to-br from-nexus-primary/[0.02] to-transparent border-nexus-primary/10 space-y-8">
              <div className="space-y-2">
                 <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Live Operations</h4>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-nexus-primary">Network Online</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <button className="w-full p-6 glass border-white/5 rounded-3xl flex items-center justify-between group hover:border-nexus-primary/40 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-nexus-primary/10 rounded-2xl text-nexus-primary">
                          <MessageCircle size={22} />
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-tight text-white">Internal Live Chat</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Instant Concierge Access</p>
                       </div>
                    </div>
                    <div className="p-2 bg-nexus-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                       <Send size={14} className="text-nexus-primary" />
                    </div>
                 </button>

                 <div className="p-6 glass border-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/5 rounded-2xl text-slate-500">
                          <Globe size={22} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight text-white">Global Nodes</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Distributed Support Matrix</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400">London Hub</p>
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">+44 20 7946 0958</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400">Singapore Hub</p>
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">+65 6744 1234</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 nexus-card border-none bg-black/40 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-nexus-magenta/10 rounded-2xl text-nexus-magenta">
                          <Clock size={22} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight text-white">Ops Schedule</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Institutional Window</p>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500 uppercase tracking-widest">Weekdays</span>
                          <span className="text-white">24 Hours (Global)</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500 uppercase tracking-widest">Weekends</span>
                          <span className="text-white">08:00 - 18:00 GMT</span>
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
