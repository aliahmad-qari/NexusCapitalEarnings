import { motion } from 'motion/react';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-8 text-slate-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-nexus-primary/5 border border-nexus-primary/20 rounded-[40px] flex items-center justify-center text-nexus-primary shadow-2xl shadow-nexus-primary/10"
      >
        <Construction size={40} className="animate-pulse" />
      </motion.div>
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">{title}</h2>
        <div className="flex items-center justify-center gap-2 text-nexus-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Optimizing Node...</span>
        </div>
        <p className="text-slate-500 max-w-md mx-auto text-sm normal-case font-medium leading-relaxed">
          Our engineering team is currently synchronizing this module with the main nexus registry. Deployment is scheduled for the next harvesting cycle.
        </p>
      </div>

      <Link 
        to="/"
        className="flex items-center gap-3 px-8 py-4 glass border-white/5 text-slate-400 hover:text-white hover:border-white/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
};
