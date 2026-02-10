
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, ArrowRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { SectionId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

// --- Particle Menu Transition ---
const MenuParticleTransition: React.FC<{
  rect: Rect;
  mode: 'open' | 'close';
  onComplete: () => void;
}> = ({ rect, mode, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const particles: any[] = [];
    // High particle count for solid transition
    const particleCount = 3000;
    const isDark = document.documentElement.classList.contains('dark');
    
    const bgCol = isDark ? '#0f172a' : '#ffffff'; 
    const accentColors = isDark ? ['#00f0ff', '#b026ff'] : ['#4f46e5', '#9333ea'];

    for (let i = 0; i < particleCount; i++) {
        let x, y, tx, ty;

        if (mode === 'open') {
            x = rect.left + Math.random() * rect.width;
            y = rect.top + Math.random() * rect.height;
            tx = Math.random() * window.innerWidth;
            ty = Math.random() * window.innerHeight;
        } else {
            x = Math.random() * window.innerWidth;
            y = Math.random() * window.innerHeight;
            tx = rect.left + Math.random() * rect.width;
            ty = rect.top + Math.random() * rect.height;
        }

        const color = Math.random() > 0.9 
            ? accentColors[Math.floor(Math.random() * accentColors.length)] 
            : bgCol;

        particles.push({
            x, y, tx, ty,
            // Very fast speed
            speed: Math.random() * 0.25 + 0.20,
            size: Math.random() * 2 + 1,
            color,
            done: false
        });
    }

    let animationId: number;
    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        let active = 0;
        particles.forEach(p => {
            if (!p.done) {
                const dx = p.tx - p.x;
                const dy = p.ty - p.y;
                const distSq = dx*dx + dy*dy;

                // Larger snap distance for responsiveness
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
        });

        // Continue until almost finished
        if (active > particleCount * 0.05) {
            animationId = requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [rect, mode, onComplete]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />;
};

// --- Navigation Component ---

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [buttonRect, setButtonRect] = useState<Rect | null>(null);
  
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useTheme();
  const { isModalOpen } = useUI();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    if (hamburgerRef.current) {
        const r = hamburgerRef.current.getBoundingClientRect();
        setButtonRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    }

    if (isOpen) {
        setAnimState('closing');
    } else {
        setAnimState('opening');
        setIsOpen(true);
    }
  };

  const handleAnimComplete = () => {
    if (animState === 'opening') {
        setAnimState('open');
    } else if (animState === 'closing') {
        setAnimState('idle');
        setIsOpen(false);
    }
  };

  const scrollToSection = (id: string) => {
    if (isOpen) {
        setAnimState('closing');
    }
    
    // Slight delay to allow animation to start
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const navLinks = [
    { name: 'Home', id: SectionId.HERO, num: '01' },
    { name: 'About', id: SectionId.ABOUT, num: '02' },
    { name: 'Work', id: SectionId.WORK, num: '03' },
    { name: 'Contact', id: SectionId.CONTACT, num: '04' },
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 transform ${
          isVisible && !isModalOpen ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div 
            onClick={() => scrollToSection(SectionId.HERO)}
            className="text-2xl font-display font-bold cursor-pointer tracking-tighter text-slate-900 dark:text-white relative z-50"
          >
            AMIRACLE<span className="text-neon-indigo dark:text-neon-cyan">.</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-neon-indigo dark:hover:text-neon-cyan transition-colors uppercase tracking-widest"
              >
                {link.name}
              </button>
            ))}
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4 relative z-50">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
                ref={hamburgerRef}
                onClick={toggleMenu} 
                className="text-slate-900 dark:text-white p-1"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {animState === 'opening' && buttonRect && (
        <MenuParticleTransition rect={buttonRect} mode="open" onComplete={handleAnimComplete} />
      )}
      {animState === 'closing' && buttonRect && (
        <MenuParticleTransition rect={buttonRect} mode="close" onComplete={handleAnimComplete} />
      )}

      <AnimatePresence>
        {isOpen && animState === 'open' && (
            <motion.div
                key="mobile-menu"
                // Instant entry for background to avoid flash gap
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col justify-center px-8"
            >
                <div className="max-w-md mx-auto w-full">
                    <div className="space-y-6">
                        {navLinks.map((link, i) => (
                            <motion.button
                                key={link.name}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }} // Faster stagger
                                onClick={() => scrollToSection(link.id)}
                                className="group flex items-baseline gap-4 w-full text-left"
                            >
                                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 group-hover:text-neon-indigo dark:group-hover:text-neon-cyan transition-colors">
                                    {link.num}
                                </span>
                                <span className="text-5xl md:text-6xl font-display font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-indigo group-hover:to-neon-purple dark:group-hover:from-neon-cyan dark:group-hover:to-neon-purple transition-all">
                                    {link.name}
                                </span>
                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-neon-indigo dark:text-neon-cyan" size={32} />
                            </motion.button>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center"
                    >
                        {/* Hidden Social Links
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={24} /></a>
                            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Twitter size={24} /></a>
                            <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin size={24} /></a>
                        </div>
                        */}
                         <div className="flex gap-6">
                             {/* Placeholder to keep spacing if needed or remove entirely */}
                        </div>

                        <a href={`mailto:hello@amiracle.dev`} className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-neon-indigo dark:hover:text-neon-cyan transition-colors">
                            <Mail size={16} />
                            GET IN TOUCH
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
