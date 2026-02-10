
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';
import { ArrowDown } from 'lucide-react';

const roles = [
  { main: "CEO", alt: "ENGINEER" },
  { main: "BRANDING", alt: "DESIGN" },
  { main: "STORYTELLING", alt: "ENTREPRENEUR" },
  { main: "E-COMMERCE", alt: "STRATEGY" }
];

const RoleScrambler: React.FC<{ text: string; hoverText: string; delay: number }> = ({ text, hoverText, delay }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<any>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";

  const scramble = (target: string) => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        target.split("").map((letter, index) => {
          if (index < iteration) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      
      if (iteration >= target.length) {
        clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 3; // Speed of decoding
    }, 30);
  };

  useEffect(() => {
    // Initial scramble on mount
    const timer = setTimeout(() => scramble(text), delay * 1000);
    return () => {
        clearTimeout(timer);
        clearInterval(intervalRef.current);
    };
  }, [delay]); // Removed text dependency to avoid double mount effects

  const handleMouseEnter = () => {
    setIsHovered(true);
    scramble(hoverText);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scramble(text);
  };

  // Base font classes used for both ghost and visible text to ensure sizing matches exactly
  // Added leading-none to reduce vertical spacing variance
  const fontClasses = "text-2xl md:text-3xl font-display font-bold tracking-wider leading-none";

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Use inline-grid to stack elements. justify-items-center centers the text within the reserved width.
      className="relative cursor-pointer group inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
        {/* Background Highlight - Adjusted centering with translate-y-1 */}
        <div className={`col-start-1 row-start-1 w-full h-full absolute -inset-2 bg-neon-indigo/10 dark:bg-neon-cyan/10 rounded-lg transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-10 translate-y-1`} />
        
        {/* Ghost Elements for Layout Stability - Reserves space for the widest possible text */}
        <span className={`${fontClasses} col-start-1 row-start-1 opacity-0 pointer-events-none select-none invisible`} aria-hidden="true">
            {text}
        </span>
        <span className={`${fontClasses} col-start-1 row-start-1 opacity-0 pointer-events-none select-none invisible`} aria-hidden="true">
            {hoverText}
        </span>

        {/* Visible Text - Absolute Positioned to prevent layout shifts during scramble */}
        <span 
            className={`
                ${fontClasses} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-10
                ${isHovered 
                    ? 'text-neon-indigo dark:text-neon-cyan drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]' 
                    : 'text-outline text-slate-400/50 dark:text-slate-500/50'}
            `}
        >
            {displayText}
        </span>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  return (
    <section id={SectionId.HERO} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background is now handled globally by Scene3D */}
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Main Text Area */}
        <div className="lg:col-span-8 text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="h-[1px] w-12 bg-neon-indigo dark:bg-neon-cyan"></div>
               <span className="text-neon-indigo dark:text-neon-cyan font-mono text-sm tracking-[0.3em] uppercase">
                 Full Stack Creative
               </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9] mb-8 text-slate-900 dark:text-white mix-blend-normal"
          >
            AMIRACLE <br />
            <span className="text-outline">STUDIOS</span>
          </motion.h1>

          {/* Interactive Roles List */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 max-w-2xl">
              {roles.map((role, index) => (
                  <React.Fragment key={role.main}>
                    <RoleScrambler text={role.main} hoverText={role.alt} delay={0.6 + (index * 0.1)} />
                    {index < roles.length - 1 && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + (index * 0.1) }}
                            className="text-neon-indigo/50 dark:text-neon-cyan/50 text-xl"
                        >
                            /
                        </motion.span>
                    )}
                  </React.Fragment>
              ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-6"
          >
            <button 
              onClick={() => document.getElementById(SectionId.WORK)?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">EXPLORE WORK</span>
              <div className="absolute inset-0 bg-neon-indigo dark:bg-neon-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button 
              onClick={() => document.getElementById(SectionId.CONTACT)?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-slate-900/20 dark:border-white/20 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              GET IN TOUCH
            </button>
          </motion.div>
        </div>

        {/* Decorative Side Element */}
        <div className="hidden lg:block lg:col-span-4 relative h-full">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.5, delay: 0.5 }}
               className="border-l border-slate-200 dark:border-white/10 pl-8 flex flex-col justify-center h-full space-y-12"
            >
               <div className="space-y-2">
                   <h3 className="text-slate-900 dark:text-white font-bold text-xl">LATEST</h3>
                   <p className="text-slate-500 text-sm">Experimental portfolio V2 utilizing R3F and Gemini AI & Codex.</p>
               </div>
               <div className="space-y-2">
                   <h3 className="text-slate-900 dark:text-white font-bold text-xl">STACK</h3>
                   <p className="text-slate-500 text-sm">React, Three.js, Tailwind, Motion</p>
               </div>
               <div className="space-y-2">
                   <h3 className="text-slate-900 dark:text-white font-bold text-xl">STATUS</h3>
                   <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       <p className="text-slate-500 text-sm">Available for commissions</p>
                   </div>
               </div>
            </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-10 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center gap-4 text-slate-500 text-sm font-mono"
      >
        <ArrowDown className="animate-bounce" size={16} />
        <span>SCROLL TO EXPLORE</span>
      </motion.div>
    </section>
  );
};

export default Hero;
