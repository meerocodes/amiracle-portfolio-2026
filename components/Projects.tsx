
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { SectionId, Project } from '../types';
import { X, Sparkles, Github, ExternalLink, Beaker, ArrowUpRight, Lock } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { KidcentralIcon, OudieIcon, TravelLoungeIcon, MeccaverseIcon } from './ProjectIcons';

const projects: Project[] = [
  {
    id: 1,
    title: "MECCAVERSE",
    category: "FAITH & SOCIAL",
    description: "Meccaverse is coming soon. Join our beta testers. A faith-first companion for prayer, streaks, friendships, and community accountability. Early access opens soon at meccaverseapp.com.",
    image: "/meccaverse.svg", // Kept for fallback/metadata if needed
    tech: ["MOBILE APP", "SOCIAL", "GAMIFICATION"],
    link: "https://meccaverseapp.com"
  },
  {
    id: 2,
    title: "TRAVEL LOUNGE",
    category: "CRM & MESSAGING",
    description: "Travel Lounge is a full international messaging + CRM system replacing ad-hoc WhatsApp juggling for a car travel agency. It routes chats, assigns agents, captures bookings, and syncs customer history so every trip runs through one streamlined workspace.",
    image: "/travel-lounge.svg",
    tech: ["NEXT.JS", "PYTHON", "SUPABASE", "AWS", "WHATSAPP API"],
    link: "#"
  },
  {
    id: 3,
    title: "OUDIE",
    category: "BRAND & DIGITAL",
    description: "Co-Chief Executive Officer role establishing the Oudie brand from inception. Designed a custom Shopify website, developed tailored digital solutions, and drove a significant boost in digital engagement through custom snippets and digital transformation.",
    image: "/oudie.svg",
    tech: ["SHOPIFY", "LIQUID", "DIGITAL TRANSFORMATION"],
    link: "https://oudie.ca"
  },
  {
    id: 4,
    title: "KIDCENTRAL",
    category: "E-COMMERCE OPS",
    description: "Led complete front-end development and UX/UI design for Kidcentral.ca on Shopify, boosting engagement and sales. Engineered a dual-faceted platform for both public and B2B users and integrated Salsify for streamlined data management. Developed a React.js-powered live dashboard for warehouse operations.",
    image: "/kidcentral.svg",
    tech: ["SHOPIFY", "REACT", "PYTHON", "REST API", "SALSIFY"],
    link: "https://kidcentral.ca"
  }
];

const labsData = [
    {
        category: "SHOPIFY APPS LAB",
        description: "Modular tools that keep storefronts clean. Automation ready.",
        items: [
            {
                title: "Variant Organizer",
                status: "Published",
                statusColor: "bg-green-500",
                desc: "Manage product variants more efficiently with bulk reordering across multiple items. Select any set of products, adjust positions via drag-and-drop or numbered ordering, and commit uniform layouts in a single publish.",
                tags: ["Shopify App", "Bulk Actions", "Drag & Drop"]
            },
            {
                title: "Cart+",
                status: "Published",
                statusColor: "bg-green-500",
                desc: "Adds intelligent cart goals, stackable incentives, and lightweight collaboration without bloating your theme. Features progress-based gifting and live cart handoffs.",
                tags: ["Shopify App", "Conversion", "Cart API"]
            }
        ]
    },
    {
        category: "PASSION PROJECTS",
        description: "Purpose-built experiments with real-world impact. Exploring community & ops.",
        items: [
            {
                title: "HalaqaHub",
                status: "Live Beta",
                statusColor: "bg-blue-500",
                desc: "Centralizes halaqa programming with live schedules, attendance tracking, class decks, and threaded Q&A. Admin tools let mentors launch courses, upload slides, and manage cohorts without friction.",
                tags: ["Next.js", "Supabase", "Tailwind", "Magic Auth"]
            },
            {
                title: "Oudie ERP Core",
                status: "In Development",
                statusColor: "bg-purple-500",
                desc: "A private operating system for Oudie Heaven Scent covering production planning, inventory, fulfillment, and wholesale forecasting. Focused on reducing manual reconciliations.",
                tags: ["React", "NestJS", "PostgreSQL", "Temporal"]
            }
        ]
    }
];

// --- Helper for rendering correct icon ---
const getProjectIcon = (title: string, forceHover?: boolean) => {
    switch(title) {
        case "MECCAVERSE": return <MeccaverseIcon forceHover={forceHover} />;
        case "TRAVEL LOUNGE": return <TravelLoungeIcon forceHover={forceHover} />;
        case "OUDIE": return <OudieIcon forceHover={forceHover} />;
        case "KIDCENTRAL": return <KidcentralIcon forceHover={forceHover} />;
        default: return null;
    }
};

// --- Helper for layout ---
const getModalRect = () => {
    if (typeof window === 'undefined') return { left: 0, top: 0, width: 0, height: 0 };
    const modalMaxWidth = 1152; 
    const padding = 32; 
    const isMobile = window.innerWidth < 768;
    const vhFactor = isMobile ? 0.85 : 0.90;
    const width = Math.min(window.innerWidth - padding, modalMaxWidth);
    const height = window.innerHeight * vhFactor; 
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    return { left, top, width, height };
};

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

// --- Particle Transition Component ---
interface ParticleTransitionProps {
  fromRect: Rect;
  toRect: Rect;
  onComplete: () => void;
}

const ParticleTransition: React.FC<ParticleTransitionProps> = ({ fromRect, toRect, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const particles: any[] = [];
    // Significantly increased particle count for dense, solid feel
    const particleCount = 4000;
    const isDark = document.documentElement.classList.contains('dark');
    
    const bgCol = isDark ? '#0f172a' : '#ffffff';
    const borderCol = isDark ? '#334155' : '#e2e8f0';
    const accentColors = isDark ? ['#00f0ff', '#b026ff'] : ['#4f46e5', '#9333ea'];

    for (let i = 0; i < particleCount; i++) {
      const x = fromRect.left + Math.random() * fromRect.width;
      const y = fromRect.top + Math.random() * fromRect.height;
      
      const tx = toRect.left + Math.random() * toRect.width;
      const ty = toRect.top + Math.random() * toRect.height;

      const rand = Math.random();
      let color = bgCol;
      let size = Math.random() * 2 + 0.5;

      if (rand > 0.95) {
         color = accentColors[Math.floor(Math.random() * accentColors.length)];
         size = Math.random() * 2.5 + 1; 
      } else if (rand > 0.90) {
         color = borderCol;
      }

      particles.push({
        x, y, tx, ty,
        // Increased speed range for faster morph
        speed: Math.random() * 0.25 + 0.20, 
        color,
        size,
        done: false
      });
    }

    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      let active = 0;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.done) {
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            const distSq = dx*dx + dy*dy;
            
            // Increased snap distance (9px sq = 3px radius) to force completion sooner and avoid lingering dots
            if (distSq < 9) { 
                p.x = p.tx;
                p.y = p.ty;
                p.done = true;
            } else {
                p.x += dx * p.speed;
                p.y += dy * p.speed;
                active++;
            }
        }
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lower threshold for completion to make the transition snappier
      if (active > particleCount * 0.05) { 
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [fromRect, toRect, onComplete]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[110] pointer-events-none" />;
};

// --- Project Card Component ---

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (project: Project, rect: Rect) => void;
  isHidden: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick, isHidden }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isTouchHover, setIsTouchHover] = useState(false);
  const touchTimeoutRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        // Convert DOMRect to plain object to avoid serialization issues in state
        const rect = { left: r.left, top: r.top, width: r.width, height: r.height };
        onClick(project, rect);
    }
  };
  const handleTouchStart = () => {
    setIsTouchHover(true);
    if (touchTimeoutRef.current) window.clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = window.setTimeout(() => setIsTouchHover(false), 1500);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) window.clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = window.setTimeout(() => setIsTouchHover(false), 150);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const shineOpacity = useTransform(mouseY, [-0.5, 0.5], [0, 0.4]);
  
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) window.clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="perspective-1000 w-full"
    >
      <div className="relative h-full" style={{ minHeight: '400px' }}>
          <motion.div
            ref={cardRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              opacity: isHidden ? 0 : 1 
            }}
            className="group relative h-full bg-white/40 dark:bg-glass-100 border border-slate-200 dark:border-white/10 p-4 rounded-xl hover:border-neon-indigo/50 dark:hover:border-neon-cyan/50 transition-colors duration-500 ease-out backdrop-blur-md shadow-lg dark:shadow-none cursor-pointer"
          >
            <motion.div 
                style={{ opacity: shineOpacity }}
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent z-50 pointer-events-none rounded-xl" 
            />

            <div className="absolute top-4 right-4 z-30 text-neon-indigo dark:text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles size={20} className="animate-pulse" />
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-900 mb-6 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-shadow duration-500">
                {/* Replaced static image with interactive Icon component */}
                <motion.div 
                    style={{ scale: 1.1 }}
                    className="w-full h-full flex items-center justify-center"
                >
                    {getProjectIcon(project.title, isTouchHover)}
                </motion.div>
                
                {/* Updated "Click to Expand" positioning to avoid covering center content */}
                <div className="absolute inset-x-0 top-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                    <span className="text-white font-bold tracking-widest text-xs border border-white/50 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">CLICK TO EXPAND</span>
                </div>
            </div>

            <div className="px-2 pb-2 pointer-events-none">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white group-hover:text-neon-indigo dark:group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/10 px-2 py-1 rounded">{project.category}</span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                        <span key={t} className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
          </motion.div>
      </div>
    </motion.div>
  );
};

// --- Modal Component ---

const ProjectModal: React.FC<{ 
    project: Project; 
    onClose: () => void;
    isVisible: boolean; 
}> = ({ project, onClose, isVisible }) => {
    
    const isPrivate = project.link === "#";
    const isBeta = project.title === "MECCAVERSE";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
                // Initial opacity 1 to match the particles immediately
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // Extremely fast fade in to avoid "flash" gap
                transition={{ duration: 0.1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl cursor-pointer"
            />

            <div className="relative w-full max-w-6xl h-[85vh] md:h-[90vh] pointer-events-none flex flex-col items-center justify-center">
                 <motion.div
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    // Content fades in slightly slower than background
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="relative flex flex-col md:flex-row w-full h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 pointer-events-auto"
                 >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full md:w-3/5 h-64 md:h-full relative overflow-hidden bg-slate-100 dark:bg-black">
                        {/* Using the interactive icon in modal as well for consistent visuals */}
                        <div className="w-full h-full">
                            {getProjectIcon(project.title)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r pointer-events-none" />
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-2">{project.title}</h2>
                            <p className="font-mono text-neon-cyan">{project.category}</p>
                        </div>
                    </div>

                    <div className="w-full md:w-2/5 p-8 flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto overscroll-contain">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Overview</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {project.description}
                                <br/><br/>
                                This project challenged the boundaries of {project.tech[0]} performance. We utilized advanced rendering techniques to achieve 60fps on mobile devices while maintaining visual fidelity.
                            </p>
                        </div>

                        <div className="mb-8">
                             <h3 className="text-lg font-bold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Tech Stack</h3>
                             <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-mono font-bold">
                                        {t}
                                    </span>
                                ))}
                             </div>
                        </div>

                        <div className="mt-auto flex gap-4">
                            <a 
                                href={isPrivate ? undefined : project.link} 
                                target={isPrivate ? undefined : "_blank"} 
                                rel={isPrivate ? undefined : "noopener noreferrer"} 
                                className={`flex-1 py-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                                    isPrivate 
                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed" 
                                    : "bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90"
                                }`}
                                onClick={(e) => isPrivate && e.preventDefault()}
                            >
                                {isPrivate ? <Lock size={18} /> : <ExternalLink size={18} />} 
                                {isBeta ? "Join Beta" : isPrivate ? "Private Build" : "Live Demo"}
                            </a>
                            <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <Github size={18} /> Code
                            </button>
                        </div>
                    </div>
                 </motion.div>
            </div>
        </div>
    );
}

// --- Main Projects Section ---

type AnimationState = 'idle' | 'opening' | 'open' | 'closing';

const Projects: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [animState, setAnimState] = useState<AnimationState>('idle');
  
  const [cardRect, setCardRect] = useState<Rect | null>(null);
  const { setModalOpen } = useUI();

  const handleCardClick = (project: Project, rect: Rect) => {
      setCardRect(rect);
      setAnimState('opening');
      setActiveProjectId(project.id);
      setModalOpen(true);
  };

  const handleModalClose = () => {
      setAnimState('closing');
      setModalOpen(false);
  };

  const handleAnimationComplete = () => {
      if (animState === 'opening') {
          setAnimState('open');
      } else if (animState === 'closing') {
          setAnimState('idle');
          setActiveProjectId(null);
          setCardRect(null);
      }
  };

  const modalRect = getModalRect();

  return (
    <section id={SectionId.WORK} className="py-32 relative z-10">
      
      {animState === 'opening' && cardRect && (
        <ParticleTransition 
            fromRect={cardRect} 
            toRect={modalRect} 
            onComplete={handleAnimationComplete} 
        />
      )}
      
      {animState === 'closing' && cardRect && (
        <ParticleTransition 
            fromRect={modalRect} 
            toRect={cardRect} 
            onComplete={handleAnimationComplete} 
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-slate-200 dark:border-white/10 pb-8">
            <div>
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white mb-2"
                >
                    SELECTED <br/> 
                    <span className="text-outline hover:text-slate-900 dark:hover:text-white transition-colors duration-500 cursor-default">WORKS</span>
                </motion.h2>
            </div>
            <div className="mt-8 md:mt-0 text-right">
                <p className="font-mono text-neon-indigo dark:text-neon-cyan text-sm">[ 2023 — 2026 ]</p>
                <p className="text-slate-500 text-sm mt-1">Digging deep into the digital void.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-32">
          {projects.map((project, index) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                onClick={handleCardClick}
                isHidden={activeProjectId === project.id} 
            />
          ))}
        </div>

        {/* --- Labs & Experiments Section --- */}
        <div className="pt-16 border-t border-slate-200 dark:border-white/10">
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
             >
                <div className="flex items-center gap-4 mb-4">
                     <Beaker className="text-neon-indigo dark:text-neon-cyan" size={24} />
                     <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">LABS & EXPERIMENTS</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                    A collection of Shopify apps, internal tools, and passion projects. 
                    These are the testing grounds for new ideas and community impact.
                </p>
             </motion.div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {labsData.map((lab, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300" />
                        <div className="relative bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-8 hover:border-neon-indigo/30 dark:hover:border-neon-cyan/30 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-sm font-mono font-bold text-neon-indigo dark:text-neon-cyan mb-1">{lab.category}</h4>
                                    <p className="text-xs text-slate-500">{lab.description}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {lab.items.map((item, j) => (
                                    <div key={j} className="group/item pb-6 last:pb-0 border-b last:border-0 border-slate-200 dark:border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-slate-900 dark:text-white text-lg group-hover/item:text-neon-indigo dark:group-hover/item:text-neon-cyan transition-colors flex items-center gap-2">
                                                {item.title}
                                                {item.status.includes("Private") && <Lock size={14} className="opacity-50" />}
                                            </h5>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${item.statusColor}`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                                            {item.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-mono border border-slate-200 dark:border-white/10 px-2 py-1 rounded text-slate-500">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
             </div>
        </div>
      </div>

      <AnimatePresence>
        {activeProjectId && animState !== 'idle' && (
            <ProjectModal 
                key="modal"
                project={projects.find(p => p.id === activeProjectId)!} 
                onClose={handleModalClose}
                isVisible={animState === 'open'}
            />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
