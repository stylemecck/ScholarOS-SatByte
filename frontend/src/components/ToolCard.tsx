import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Tool } from '../utils/toolsConfig';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const Icon = tool.icon;
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group saas-card relative flex flex-col overflow-hidden h-full"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700 blur-2xl" />
      
      {/* Icon Wrapper */}
      <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/40 text-foreground mb-8 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-500">
        <Icon className="w-7 h-7" />
        
        {/* Subtle AI Badge on Icon */}
        {(tool.category === 'Academic' || tool.category === 'Exam') && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-background shadow-sm scale-0 group-hover:scale-100 transition-transform delay-100">
                <Sparkles className="w-3 h-3 text-white fill-current" />
            </div>
        )}
      </div>
      
      <div className="flex-grow space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-foreground/[0.04] text-muted-foreground border border-border/30 group-hover:text-primary group-hover:border-primary/20 transition-colors">
            {tool.category}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-[22px] lg:text-[24px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
          <p className="text-[17px] lg:text-[18px] text-muted-foreground font-medium leading-[1.7] line-clamp-2 group-hover:text-foreground/70 transition-colors">
            {tool.description}
          </p>
        </div>
      </div>
      
      <Link 
        to={tool.path}
        className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-all relative z-10 w-fit"
      >
        <span>Open Application</span>
        <div className="w-8 h-8 rounded-full bg-foreground/[0.04] flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-2 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
