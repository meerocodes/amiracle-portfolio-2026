
import React from 'react';
import { motion } from 'framer-motion';

// --- Shared Props ---
// Icons will inherit hover state from parent "group" via variants or receive direct props if needed.

export const KidcentralIcon: React.FC<{ forceHover?: boolean }> = ({ forceHover }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-3/5 h-3/5 drop-shadow-xl"
        initial="idle"
        animate={forceHover ? "hover" : "idle"}
        whileHover="hover"
      >
        {/* Baby Shorts - Attached to bottom of shirt */}
        <motion.path
          d="M70 140 L130 140 L130 170 C130 180, 100 175, 100 175 C100 175, 70 180, 70 170 Z"
          fill="#93c5fd" // Lighter blue
          stroke="currentColor"
          strokeWidth="3"
          className="text-slate-900 dark:text-white"
          variants={{
             idle: { y: 40, opacity: 0 },
             hover: { 
                 y: 0, 
                 opacity: 1, 
                 transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 } 
             }
          }}
        />

        {/* Baby Tee Shape */}
        <motion.g
            variants={{
                idle: { rotate: 0, y: 0 },
                hover: { 
                    rotate: [0, -3, 3, -1, 1, 0], 
                    y: -5, 
                    transition: { duration: 0.5, ease: "easeInOut" } 
                }
            }}
        >
            <path
              d="M60 50 C60 40, 80 40, 80 50 C80 60, 120 60, 120 50 C120 40, 140 40, 140 50 L170 80 L150 100 L130 80 L130 140 C130 150, 70 150, 70 140 L70 80 L50 100 L30 80 Z"
              fill="#3b82f6"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-900 dark:text-white"
            />
            {/* Cute Heart */}
            <motion.path
              d="M100 80 C90 70, 80 80, 85 90 L100 105 L115 90 C120 80, 110 70, 100 80 Z"
              fill="#fee2e2" 
              variants={{
                 idle: { scale: 1, opacity: 0.8 },
                 hover: { scale: [1, 1.2, 1], opacity: 1, transition: { repeat: Infinity, duration: 0.8 } }
              }}
            />
        </motion.g>
      </motion.svg>
    </div>
  );
};

export const OudieIcon: React.FC<{ forceHover?: boolean }> = ({ forceHover }) => {
  // Enhanced Mist particles for "Towards User" effect
  // We use scale to simulate z-axis movement (coming closer)
  const particles = Array.from({ length: 12 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 60, // Wide spread X
      y: (Math.random() - 0.5) * 60, // Wide spread Y
      delay: Math.random() * 0.2,
      scale: Math.random() * 2 + 3, // Target scale (large = close)
  }));

  return (
    <div className="w-full h-full flex items-center justify-center bg-amber-50 dark:bg-neutral-900 overflow-hidden transition-colors duration-300">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-3/5 h-3/5 drop-shadow-2xl"
        initial="idle"
        animate={forceHover ? "hover" : "idle"}
        whileHover="hover"
      >
        {/* Perfume Bottle Group */}
        <motion.g
            variants={{
                idle: { scale: 1, y: 0 },
                hover: { 
                    scale: 0.95, 
                    y: 5, 
                    transition: { duration: 0.1, repeat: 1, repeatType: "reverse" } // Recoil effect when spraying
                }
            }}
        >
            {/* Nozzle/Cap */}
            <rect x="90" y="50" width="20" height="15" rx="2" fill="#d4af37" />
            <rect x="95" y="45" width="10" height="5" fill="#f59e0b" /> {/* Spout */}

            {/* Neck */}
            <rect x="85" y="65" width="30" height="10" fill="#171717" />

            {/* Bottle Body */}
            <path 
                d="M70 75 H130 V160 C130 170, 70 170, 70 160 V75 Z" 
                fill="url(#goldGradient)"
                stroke="#d4af37"
                strokeWidth="2"
            />
            
            {/* Label */}
            <rect x="85" y="100" width="30" height="40" fill="#171717" />
            <text x="100" y="125" textAnchor="middle" fill="#d4af37" fontSize="10" fontFamily="serif" fontWeight="bold">OUD</text>

            {/* Glass Shine */}
            <path d="M75 80 L85 80 L85 160 L75 155 Z" fill="#ffffff" opacity="0.2" />
        </motion.g>

         {/* Spritz Mist - Overlaying the bottle to look like it's coming out towards screen */}
         <motion.g transform="translate(100, 50)">
            {particles.map((p, i) => (
                <motion.circle 
                    key={i}
                    cx="0" cy="0" r="2"
                    fill="url(#mistGradient)"
                    variants={{
                        idle: { opacity: 0, x: 0, y: 0, scale: 0 },
                        hover: { 
                            opacity: [0, 0.8, 0], 
                            x: p.x, // Spread out
                            y: p.y, // Spread out
                            scale: [0.1, p.scale], // Grow large (coming towards user)
                            transition: { 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: p.delay,
                                ease: "easeOut" 
                            }
                        }
                    }}
                />
            ))}
         </motion.g>

        <defs>
            <linearGradient id="goldGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id="mistGradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
            </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
};

export const TravelLoungeIcon: React.FC<{ forceHover?: boolean }> = ({ forceHover }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-sky-100 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      {/* Moving Road Lines */}
      <motion.div 
         className="absolute inset-0 flex flex-col justify-center items-center opacity-20"
         initial="idle"
         animate={forceHover ? "hover" : "idle"}
         whileHover="hover"
      >
         {[...Array(5)].map((_, i) => (
             <motion.div 
                key={i} 
                className="w-full h-[2px] bg-cyan-500 mb-8"
                variants={{
                    idle: { x: 0 },
                    hover: { x: [-100, 100], transition: { duration: 0.5, repeat: Infinity, ease: "linear", delay: i * 0.1 } }
                }}
             />
         ))}
      </motion.div>

      <motion.svg 
        viewBox="0 0 200 100" 
        className="w-4/5 h-4/5 z-10"
        initial="idle"
        animate={forceHover ? "hover" : "idle"}
        whileHover="hover"
      >
         <motion.g
            variants={{
                idle: { x: 0, y: 0 },
                hover: { 
                    x: [-2, 2, -2], 
                    y: [0, 1, 0], // Subtle suspension bounce
                    transition: { duration: 0.2, repeat: Infinity, ease: "linear" }
                }
            }}
         >
            {/* Drift Smoke - Rear Wheel Positioned */}
            <motion.g variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}>
                <circle cx="160" cy="85" r="5" fill="#94a3b8" opacity="0.5">
                    <animate attributeName="cx" from="160" to="190" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="r" from="5" to="15" dur="0.5s" repeatCount="indefinite" />
                </circle>
            </motion.g>

            {/* Porsche 911 Silhouette Body */}
            {/* Low nose, rounded hood, sloping roof to rear (fastback), rear spoiler lip */}
            <path 
                d="M10 75 Q15 60, 40 55 L70 50 Q100 35, 130 40 Q160 45, 185 60 L190 65 L190 75 L180 75 L180 80 L10 80 Z" 
                fill="#0f172a" 
                stroke="#06b6d4" 
                strokeWidth="2" 
            />
            
            {/* Cabin / Windows - Tweaked for sleeker look matching roof line */}
            <path 
                d="M75 52 L92 42 Q120 38, 150 48 L155 52 Z" 
                fill="#22d3ee" 
                opacity="0.5" 
            />

            {/* Rear Spoiler Detail */}
            <path d="M175 60 L195 58 L190 65" fill="none" stroke="#06b6d4" strokeWidth="2" />
            
            {/* Headlight */}
            <ellipse cx="30" cy="58" rx="8" ry="4" transform="rotate(-10 30 58)" fill="#e0f2fe" opacity="0.8" />
            
            {/* Wheels - Centered accurately for rotation */}
            <circle cx="45" cy="80" r="11" fill="#000" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="155" cy="80" r="11" fill="#000" stroke="#06b6d4" strokeWidth="2" />
            
            {/* Wheel Spokes - Left (Origin 45, 80) */}
            <motion.g 
                style={{originX: "45px", originY: "80px"}}
                variants={{ hover: { rotate: 360, transition: { repeat: Infinity, duration: 0.5, ease: "linear" } } }}
            >
                <line x1="45" y1="80" x2="45" y2="69" stroke="#06b6d4" strokeWidth="2" />
                <line x1="45" y1="80" x2="56" y2="80" stroke="#06b6d4" strokeWidth="2" />
                <line x1="45" y1="80" x2="45" y2="91" stroke="#06b6d4" strokeWidth="2" />
                <line x1="45" y1="80" x2="34" y2="80" stroke="#06b6d4" strokeWidth="2" />
            </motion.g>

            {/* Wheel Spokes - Right (Origin 155, 80) */}
            <motion.g 
                style={{originX: "155px", originY: "80px"}}
                variants={{ hover: { rotate: 360, transition: { repeat: Infinity, duration: 0.5, ease: "linear" } } }}
            >
                <line x1="155" y1="80" x2="155" y2="69" stroke="#06b6d4" strokeWidth="2" />
                <line x1="155" y1="80" x2="166" y2="80" stroke="#06b6d4" strokeWidth="2" />
                <line x1="155" y1="80" x2="155" y2="91" stroke="#06b6d4" strokeWidth="2" />
                <line x1="155" y1="80" x2="144" y2="80" stroke="#06b6d4" strokeWidth="2" />
            </motion.g>

         </motion.g>
      </motion.svg>
    </div>
  );
};

export const MeccaverseIcon: React.FC<{ forceHover?: boolean }> = ({ forceHover }) => {
  // Generate pilgrim dots for Tawaf
  const dots = Array.from({ length: 24 }).map((_, i) => i);
  const radius = 80;

  return (
    <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-3/5 h-3/5 drop-shadow-2xl"
        initial="idle"
        animate={forceHover ? "hover" : "idle"}
        whileHover="hover"
      >
        {/* Glow Effect */}
        <motion.circle 
            cx="100" cy="100" r="70" 
            fill="url(#glowGradient)" 
            variants={{
                idle: { opacity: 0.3, scale: 0.9 },
                hover: { opacity: 0.6, scale: 1.1, transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 } }
            }}
        />

        {/* Tawaf (Orbiting Dots) */}
        <motion.g
            style={{ originX: "100px", originY: "100px" }}
            variants={{
                idle: { opacity: 0, rotate: 0 },
                hover: { opacity: 1, rotate: 360, transition: { rotate: { duration: 4, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } } }
            }}
        >
            {dots.map((_, i) => {
                const angle = (i / dots.length) * Math.PI * 2;
                const r = radius + (i % 2 === 0 ? 5 : -5); // Staggered slightly
                const cx = 100 + Math.cos(angle) * r;
                const cy = 100 + Math.sin(angle) * r;
                return (
                    <circle key={i} cx={cx} cy={cy} r={1.5} fill="currentColor" className="text-slate-400 dark:text-white" opacity={0.6} />
                );
            })}
        </motion.g>

         {/* Tawaf Inner Ring */}
         <motion.g
            style={{ originX: "100px", originY: "100px" }}
            variants={{
                idle: { opacity: 0, rotate: 0 },
                hover: { opacity: 1, rotate: 360, transition: { rotate: { duration: 3, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } } }
            }}
        >
             {Array.from({length: 12}).map((_, i) => {
                 const angle = (i / 12) * Math.PI * 2 + 0.5;
                 const cx = 100 + Math.cos(angle) * 60;
                 const cy = 100 + Math.sin(angle) * 60;
                 return <circle key={i} cx={cx} cy={cy} r={1} fill="currentColor" className="text-slate-400 dark:text-white" opacity={0.4} />
             })}
        </motion.g>

        {/* Kaaba Base - Larger Size */}
        <motion.rect 
            x="60" y="60" width="80" height="80" 
            fill="#0f172a" 
            stroke="#a855f7" 
            strokeWidth="1"
            variants={{
                idle: { scale: 1 },
                hover: { scale: 1.05, transition: { duration: 0.5 } }
            }}
            style={{ originX: "100px", originY: "100px" }}
        />

        {/* Gold Band */}
        <motion.rect 
            x="60" y="80" width="80" height="12" 
            fill="#fbbf24" 
            variants={{
                idle: { opacity: 0.8 },
                hover: { opacity: 1, filter: "brightness(1.5)", transition: { repeat: Infinity, repeatType: "reverse", duration: 1 } }
            }}
        />

        <defs>
            <radialGradient id="glowGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
};
