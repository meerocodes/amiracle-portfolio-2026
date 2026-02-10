
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionId } from '../types';
import { Code, Palette, Zap, Cpu, Rocket, Users, GitBranch, Layers } from 'lucide-react';

const features = [
  {
    icon: <Code size={32} />,
    title: "Clean Code",
    desc: "Writing scalable, maintainable, and type-safe code is my standard."
  },
  {
    icon: <Palette size={32} />,
    title: "Visual Design",
    desc: "I don't just build logic; I craft pixels to perfection."
  },
  {
    icon: <Zap size={32} />,
    title: "Performance",
    desc: "Optimizing for 60fps interactions and lightning fast load times."
  },
  {
    icon: <Cpu size={32} />,
    title: "AI Integration",
    desc: "Leveraging LLMs like Gemini to build smarter applications."
  },
  {
    icon: <Rocket size={32} />,
    title: "Product Vision",
    desc: "Shepherding products from napkin sketch to market launch."
  },
  {
    icon: <Users size={32} />,
    title: "Stakeholder Synergy",
    desc: "Translating complex tech into clear business value for clients."
  },
  {
    icon: <GitBranch size={32} />,
    title: "Team Collaboration",
    desc: "Thriving in squads, code reviews, and elevating engineering culture."
  },
  {
    icon: <Layers size={32} />,
    title: "Full Stack Arch",
    desc: "Designing and developing complete solutions solo or with a team."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const FeatureCard: React.FC<{ feature: typeof features[0], index: number }> = ({ feature, index }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1200); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <motion.div
      variants={itemVariants}
      className="relative group perspective-1000"
      onClick={handleClick}
    >
      <motion.div
        animate={isAnimating ? {
            rotateX: [0, 15, -5, 0], // 3D Tilt shake
            scale: [1, 0.95, 1.02, 1], // Compress and expand
            z: [0, -50, 20, 0]
        } : {
            rotateX: 0,
            scale: 1,
            z: 0
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="h-full p-4 md:p-8 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-colors duration-300 rounded-2xl backdrop-blur-sm cursor-pointer relative overflow-hidden transform-style-3d shadow-lg hover:shadow-xl dark:shadow-none"
      >
        {/* === Animation Layers === */}
        <AnimatePresence>
            {isAnimating && (
                <>
                    {/* 1. Flash Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, times: [0, 0.1, 1] }}
                        className="absolute inset-0 bg-white dark:bg-neon-cyan mix-blend-overlay z-20 pointer-events-none"
                    />

                    {/* 2. Scanline Beam */}
                    <motion.div 
                        initial={{ top: "-10%" }}
                        animate={{ top: "120%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-neon-indigo/30 dark:via-neon-cyan/30 to-transparent z-10 pointer-events-none"
                    >
                         <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-indigo dark:bg-neon-cyan shadow-[0_0_15px_rgba(79,70,229,0.8)] dark:shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                    </motion.div>

                    {/* 3. Border Circuit Trace (Four separate lines for box trace effect) */}
                    {/* Top */}
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.4, ease: "linear" }} className="absolute top-0 left-0 h-[2px] bg-neon-indigo dark:bg-neon-cyan z-30" />
                    {/* Right */}
                    <motion.div initial={{ height: "0%" }} animate={{ height: "100%" }} transition={{ delay: 0.2, duration: 0.4, ease: "linear" }} className="absolute top-0 right-0 w-[2px] bg-neon-indigo dark:bg-neon-cyan z-30" />
                    {/* Bottom */}
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 0.4, duration: 0.4, ease: "linear" }} className="absolute bottom-0 right-0 h-[2px] bg-neon-indigo dark:bg-neon-cyan z-30" />
                    {/* Left */}
                    <motion.div initial={{ height: "0%" }} animate={{ height: "100%" }} transition={{ delay: 0.6, duration: 0.4, ease: "linear" }} className="absolute bottom-0 left-0 w-[2px] bg-neon-indigo dark:bg-neon-cyan z-30" />
                </>
            )}
        </AnimatePresence>

        {/* Hover Gradient (Standard) */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/5 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
            <motion.div 
                className="text-neon-indigo dark:text-neon-cyan mb-4 md:mb-6 inline-block"
                animate={isAnimating ? {
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1],
                    filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
                } : {}}
                transition={{ duration: 0.8 }}
            >
                {feature.icon}
            </motion.div>
            
            <motion.h3 
                className="text-base md:text-xl font-bold mb-2 md:mb-3 font-display text-slate-900 dark:text-white"
                animate={isAnimating ? {
                    x: [0, -2, 2, 0], // Jitter
                    color: ["#ffffff", "#00f0ff", "#ffffff"] // Glitch color (in dark mode)
                } : {}}
                transition={{ duration: 0.4 }}
            >
                {feature.title}
            </motion.h3>
            
            <motion.p 
                className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed"
                animate={isAnimating ? { opacity: [1, 0.5, 1] } : {}}
            >
                {feature.desc}
            </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const About: React.FC = () => {
  return (
    <section id={SectionId.ABOUT} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-slate-900 dark:text-white">
            More Than Just <br />
            <span className="text-slate-400 dark:text-slate-500">A Developer.</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            I bridge the gap between engineering and art. With a background in design and a passion for complex logic, I build applications that not only work flawlessly but feel alive.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
