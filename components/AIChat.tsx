
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Wifi, Battery, Activity, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Brain, Gamepad2, RotateCcw } from 'lucide-react';
import { useUI } from '../context/UIContext';

// --- Shared Types ---
interface Point { x: number, y: number }

// --- Snake Game Component ---
const GRID_W = 20;
const GRID_H = 15;
const SPEED = 100;

const SnakeGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]);
    const [food, setFood] = useState<Point>({ x: 10, y: 7 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const boardRef = useRef<HTMLDivElement>(null);

    const directionQueue = useRef<Point[]>([]);
    const currentDirRef = useRef<Point>({ x: 1, y: 0 });

    const resetGame = () => {
        setSnake([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]);
        setFood(spawnFood());
        setGameOver(false);
        setScore(0);
        directionQueue.current = [{ x: 1, y: 0 }];
        currentDirRef.current = { x: 1, y: 0 };
        if (boardRef.current) boardRef.current.focus();
    };

    const spawnFood = () => {
        return {
            x: Math.floor(Math.random() * GRID_W),
            y: Math.floor(Math.random() * GRID_H)
        };
    };

    useEffect(() => {
        if (gameOver) return;
        
        const moveSnake = setInterval(() => {
            setSnake(prev => {
                if (directionQueue.current.length > 0) {
                    currentDirRef.current = directionQueue.current.shift()!;
                }
                const dir = currentDirRef.current;
                const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
                
                if (newHead.x < 0 || newHead.x >= GRID_W || newHead.y < 0 || newHead.y >= GRID_H || 
                    prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [newHead, ...prev];
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => s + 10);
                    setFood(spawnFood());
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, SPEED);
        return () => clearInterval(moveSnake);
    }, [food, gameOver]);

    const handleInput = useCallback((newDir: Point) => {
        const lastPlannedDir = directionQueue.current.length > 0 
            ? directionQueue.current[directionQueue.current.length - 1] 
            : currentDirRef.current;

        if (newDir.x === -lastPlannedDir.x && newDir.y === -lastPlannedDir.y) return;
        
        if (directionQueue.current.length < 2) {
            directionQueue.current.push(newDir);
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (gameOver && e.key === 'Enter') resetGame();
        if (e.key === 'Escape') onExit();

        switch (e.key) {
            case 'ArrowUp': handleInput({ x: 0, y: -1 }); break;
            case 'ArrowDown': handleInput({ x: 0, y: 1 }); break;
            case 'ArrowLeft': handleInput({ x: -1, y: 0 }); break;
            case 'ArrowRight': handleInput({ x: 1, y: 0 }); break;
        }
    };

    useEffect(() => {
        if (boardRef.current) boardRef.current.focus();
    }, []);

    return (
        <div className="flex flex-col h-full items-center">
            <div 
                ref={boardRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="w-full relative flex flex-col items-center justify-center font-mono outline-none"
            >
                <div className="flex justify-between w-full mb-2 px-2 text-[10px] text-slate-400">
                    <span className="text-neon-cyan">SCORE: {score}</span>
                    <span className="hidden md:inline">ARROWS to move • ESC to quit</span>
                    <button onClick={onExit} className="md:hidden text-red-400">EXIT</button>
                </div>

                <div className="relative border border-slate-700 bg-slate-900/50 rounded-lg overflow-hidden w-full max-w-[300px] aspect-[4/3]">
                     {gameOver && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                            <div className="text-red-500 font-bold mb-2 tracking-widest">GAME OVER</div>
                            <div className="text-xs text-slate-400 mb-4">Final Score: {score}</div>
                            <button onClick={resetGame} className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan text-xs rounded hover:bg-neon-cyan/20 flex items-center gap-2">
                                <RotateCcw size={12} /> RETRY
                            </button>
                            <button onClick={onExit} className="mt-4 text-[10px] text-slate-500 hover:text-white underline">
                                Return to Terminal
                            </button>
                        </div>
                    )}

                    <div 
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: `repeat(${GRID_W}, 1fr)`, 
                            gridTemplateRows: `repeat(${GRID_H}, 1fr)`,
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {Array.from({ length: GRID_W * GRID_H }).map((_, i) => {
                            const x = i % GRID_W;
                            const y = Math.floor(i / GRID_W);
                            const isSnake = snake.some(p => p.x === x && p.y === y);
                            const isFood = food.x === x && food.y === y;
                            return (
                                <div key={i} className={`${isSnake ? 'bg-neon-cyan shadow-[0_0_5px_rgba(0,240,255,0.5)]' : isFood ? 'bg-neon-pink animate-pulse rounded-full transform scale-75' : ''}`} />
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 md:hidden w-full max-w-[200px]">
                    <div></div>
                    <button className="h-12 bg-slate-800 rounded-lg flex items-center justify-center active:bg-neon-cyan/20 active:text-neon-cyan transition-colors" onClick={() => handleInput({x: 0, y: -1})}><ArrowUp size={20}/></button>
                    <div></div>
                    <button className="h-12 bg-slate-800 rounded-lg flex items-center justify-center active:bg-neon-cyan/20 active:text-neon-cyan transition-colors" onClick={() => handleInput({x: -1, y: 0})}><ArrowLeft size={20}/></button>
                    <button className="h-12 bg-slate-800 rounded-lg flex items-center justify-center active:bg-neon-cyan/20 active:text-neon-cyan transition-colors" onClick={() => handleInput({x: 0, y: 1})}><ArrowDown size={20}/></button>
                    <button className="h-12 bg-slate-800 rounded-lg flex items-center justify-center active:bg-neon-cyan/20 active:text-neon-cyan transition-colors" onClick={() => handleInput({x: 1, y: 0})}><ArrowRight size={20}/></button>
                </div>
            </div>
        </div>
    );
};

// --- Memory Breach Game Component ---
const MemoryGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [grid] = useState(Array(16).fill(0));
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'input' | 'won' | 'lost'>('idle');
    const [level, setLevel] = useState(1);
    const [activeCell, setActiveCell] = useState<number | null>(null);

    useEffect(() => {
        if (gameState === 'idle') {
            startLevel(1);
        }
    }, [gameState]);

    const startLevel = (lvl: number) => {
        const newSeq = [];
        for (let i = 0; i < lvl + 2; i++) {
            newSeq.push(Math.floor(Math.random() * 16));
        }
        setSequence(newSeq);
        setUserSequence([]);
        setLevel(lvl);
        setGameState('showing');
    };

    useEffect(() => {
        if (gameState === 'showing') {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setActiveCell(null);
                    setGameState('input');
                    return;
                }
                setActiveCell(sequence[i]);
                setTimeout(() => setActiveCell(null), 400);
                i++;
            }, 800);
            return () => clearInterval(interval);
        }
    }, [gameState, sequence]);

    const handleCellClick = (index: number) => {
        if (gameState !== 'input') return;

        setActiveCell(index);
        setTimeout(() => setActiveCell(null), 200);

        const expected = sequence[userSequence.length];
        
        if (index === expected) {
            const newUserSeq = [...userSequence, index];
            setUserSequence(newUserSeq);

            if (newUserSeq.length === sequence.length) {
                setGameState('won');
                setTimeout(() => startLevel(level + 1), 1000);
            }
        } else {
            setGameState('lost');
        }
    };

    return (
        <div className="flex flex-col items-center h-full justify-center">
            <div className="flex justify-between w-full max-w-[250px] mb-4 text-[10px] text-slate-400 font-mono">
                <span className="text-neon-purple">LEVEL: {level}</span>
                <span>
                    {gameState === 'showing' ? 'WATCH SEQUENCE...' : 
                     gameState === 'input' ? 'REPEAT SEQUENCE' : 
                     gameState === 'won' ? 'ACCESS GRANTED' : 
                     gameState === 'lost' ? 'BREACH FAILED' : 'INITIALIZING...'}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-2 w-[250px] h-[250px]">
                {grid.map((_, i) => (
                    <button
                        key={i}
                        disabled={gameState !== 'input'}
                        onClick={() => handleCellClick(i)}
                        className={`
                            rounded-md border transition-all duration-200
                            ${activeCell === i 
                                ? 'bg-neon-purple border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.8)] scale-95' 
                                : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}
                            ${gameState === 'lost' && sequence.includes(i) ? 'bg-red-900/50 border-red-500' : ''}
                        `}
                    />
                ))}
            </div>

            {gameState === 'lost' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl">
                    <div className="text-red-500 font-bold mb-2 tracking-widest text-xl">SYSTEM LOCKED</div>
                    <div className="text-xs text-slate-400 mb-6">Security breach detected at Level {level}</div>
                    <button onClick={() => startLevel(1)} className="px-6 py-2 bg-red-500/10 border border-red-500 text-red-500 text-xs rounded hover:bg-red-500/20 flex items-center gap-2 mb-3">
                        <RotateCcw size={14} /> REBOOT SYSTEM
                    </button>
                    <button onClick={onExit} className="text-[10px] text-slate-500 hover:text-white underline">
                        Exit to Terminal
                    </button>
                </div>
            )}
            
            <button onClick={onExit} className="mt-6 text-[10px] text-slate-500 hover:text-white flex items-center gap-1">
                <X size={10} /> ABORT
            </button>
        </div>
    );
};

// --- System HUD Component ---
const SystemHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTerminalOpen } = useUI();
  const [time, setTime] = useState(new Date());
  
  const [creativeFlow, setCreativeFlow] = useState(78);
  const [caffeineLevel, setCaffeineLevel] = useState(45);

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(["Welcome to AmiracleOS v2.1", "Type 'help' for commands."]);
  const [mode, setMode] = useState<'shell' | 'snake' | 'memory'>('shell');
  const [terminalTheme, setTerminalTheme] = useState<'neon' | 'amber' | 'mono' | 'ice'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminalTheme');
      if (saved === 'neon' || saved === 'amber' || saved === 'mono' || saved === 'ice') return saved;
    }
    return 'neon';
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTerminalOpen(isOpen);
  }, [isOpen, setTerminalOpen]);

  useEffect(() => {
    localStorage.setItem('terminalTheme', terminalTheme);
  }, [terminalTheme]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const statTimer = setInterval(() => {
        setCreativeFlow(prev => {
            const change = (Math.random() - 0.5) * 10;
            return Math.min(100, Math.max(40, prev + change));
        });
        setCaffeineLevel(prev => {
             if (Math.random() > 0.95) return Math.min(100, prev + 30);
             return Math.max(10, prev - 0.1);
        });
    }, 2000);
    return () => {
        clearInterval(timer);
        clearInterval(statTimer);
    };
  }, []);

  useEffect(() => {
      if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [history, mode]);

  useEffect(() => {
      if (isOpen && mode === 'shell' && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 100);
      }
  }, [isOpen, mode]);

  const handleCommand = (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;

      const newHistory = [...history, `visitor@amiracle:~$ ${cmd}`];

      if (cmd === 'theme' || cmd.startsWith('theme ')) {
          const choice = cmd.replace('theme', '').trim();
          if (!choice) {
              newHistory.push(
                  "Theme options:",
                  "  theme neon   - Default neon HUD",
                  "  theme amber  - Warm amber terminal",
                  "  theme mono   - Minimal monochrome",
                  "  theme ice    - Light background, dark text"
              );
          } else if (choice === 'neon' || choice === 'amber' || choice === 'mono' || choice === 'ice') {
              setTerminalTheme(choice);
              newHistory.push(`Terminal theme set to: ${choice}`);
          } else {
              newHistory.push("Unknown theme. Try: theme neon | theme amber | theme mono | theme ice");
          }
          setHistory(newHistory);
          setInput('');
          return;
      }

      switch(cmd) {
          case 'help':
              newHistory.push(
                  "Available commands:", 
                  "  help       - Show this menu", 
                  "  about      - Who am I?", 
                  "  contact    - Get email", 
                  "  cd game    - Play Snake",
                  "  cd memory  - Play Memory Breach", 
                  "  theme      - Terminal themes",
                  "  clear      - Clear terminal",
                  "  close      - Close terminal"
              );
              break;
          case 'about':
              newHistory.push("Amiracle Studios: Frontend Eng & UX Designer.", "Building digital experiences.");
              break;
          case 'contact':
              newHistory.push("Email: hello@amiracle.dev", "(Copied to clipboard)");
              navigator.clipboard.writeText("hello@amiracle.dev");
              break;
          case 'cd game':
              setMode('snake');
              setInput('');
              return; 
          case 'cd memory':
              setMode('memory');
              setInput('');
              return;
          case 'clear':
              setHistory([]);
              setInput('');
              return;
          case 'close':
          case 'exit':
              setIsOpen(false);
              setInput('');
              return;
          default:
              newHistory.push(`Command not found: ${cmd}`);
      }

      setHistory(newHistory);
      setInput('');
  };

  const terminalThemeClasses = terminalTheme === 'ice'
    ? {
        shellBg: 'bg-white',
        shellBorder: 'border-slate-200',
        shellText: 'text-slate-900',
        shellMuted: 'text-slate-500',
        shellPrompt: 'text-slate-700',
        shellAccent: 'text-slate-800'
      }
    : terminalTheme === 'amber'
    ? {
        shellBg: 'bg-[#160f08]',
        shellBorder: 'border-amber-900/60',
        shellText: 'text-amber-100',
        shellMuted: 'text-amber-400',
        shellPrompt: 'text-amber-300',
        shellAccent: 'text-amber-200'
      }
    : terminalTheme === 'mono'
      ? {
          shellBg: 'bg-[#0b0b0b]',
          shellBorder: 'border-slate-800',
          shellText: 'text-slate-100',
          shellMuted: 'text-slate-400',
          shellPrompt: 'text-slate-300',
          shellAccent: 'text-slate-200'
        }
      : {
          shellBg: 'bg-slate-950',
          shellBorder: 'border-slate-300 dark:border-slate-700/50',
          shellText: 'text-white',
          shellMuted: 'text-slate-500',
          shellPrompt: 'text-neon-pink',
          shellAccent: 'text-neon-cyan'
        };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 group ${isOpen ? 'pointer-events-none opacity-0' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
            {/* Dark Mode Glow */}
            <div className="absolute inset-0 bg-neon-indigo dark:bg-neon-cyan blur-lg opacity-20 dark:opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
            
            {/* Button Body - Adaptive White/Dark */}
            <div className="relative w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white overflow-hidden shadow-xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent dark:from-neon-indigo/20 dark:via-transparent dark:to-transparent group-hover:from-indigo-500/20 dark:group-hover:from-neon-cyan/20 transition-colors duration-500"></div>
                <Terminal size={24} className="text-indigo-600 dark:text-neon-cyan relative z-10" />
            </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-8 left-0 right-0 mx-auto md:left-auto md:right-8 md:mx-0 w-[90vw] md:w-[360px] z-50 perspective-1000"
            >
                {/* HUD Container - Adaptive White/Dark */}
                <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 ring-1 ring-black/5 dark:ring-white/10 flex flex-col max-h-[700px]">
                    
                    {/* Header */}
                    <div className="h-10 bg-slate-50/80 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-4 select-none flex-shrink-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-indigo-600 dark:text-neon-cyan/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)] dark:shadow-[0_0_8px_rgba(0,240,255,0.8)]"></div>
                            SYSTEM_OVERRIDE
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
                        
                        {/* Time & Connectivity */}
                        <div className="flex gap-3">
                            <div className="flex-1 bg-slate-50 dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-indigo-500/30 dark:hover:border-neon-indigo/30 transition-colors">
                                <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Local Time</div>
                                <div className="text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-600 truncate">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
                            </div>
                            <div className="w-1/3 bg-slate-50 dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                                <div className="flex justify-between items-center text-indigo-600 dark:text-neon-cyan">
                                    <Wifi size={14} />
                                    <span className="text-[10px] font-mono">LINKED</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-500 dark:text-green-400">
                                    <Battery size={14} />
                                    <span className="text-[10px] font-mono">100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Telemetry */}
                        <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                             <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <Activity size={12} className="text-purple-600 dark:text-neon-purple" /> Telemetry
                                 </div>
                                 <div className="text-[10px] text-slate-400 dark:text-slate-600 animate-pulse">LIVE</div>
                             </div>
                             
                             <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[11px] mb-1.5 text-slate-600 dark:text-slate-300 font-medium">
                                        <span>CREATIVE_FLOW</span>
                                        <span className="font-mono text-indigo-600 dark:text-neon-indigo">{Math.round(creativeFlow)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-neon-indigo dark:to-blue-500 shadow-[0_0_10px_rgba(79,70,229,0.3)] dark:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                                            animate={{ width: `${creativeFlow}%` }}
                                            transition={{ type: 'spring', stiffness: 50 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[11px] mb-1.5 text-slate-600 dark:text-slate-300 font-medium">
                                        <span>CAFFEINE_LEVELS</span>
                                        <span className="font-mono text-cyan-600 dark:text-neon-cyan">{Math.round(caffeineLevel)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 dark:from-neon-cyan dark:to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] dark:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                                            animate={{ width: `${caffeineLevel}%` }}
                                            transition={{ type: 'spring', stiffness: 50 }}
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Terminal / Game Area - Always Dark for Contrast */}
                        <div className={`${terminalThemeClasses.shellBg} rounded-xl border ${terminalThemeClasses.shellBorder} p-2 font-mono text-xs shadow-inner flex flex-col transition-all duration-300 ${mode !== 'shell' ? 'min-h-[350px]' : 'min-h-[200px]'}`}>
                            {mode === 'snake' ? (
                                <SnakeGame onExit={() => setMode('shell')} />
                            ) : mode === 'memory' ? (
                                <MemoryGame onExit={() => setMode('shell')} />
                            ) : (
                                <div className="flex-1 flex flex-col" onClick={() => inputRef.current?.focus()}>
                                    <div className={`flex-1 overflow-y-auto max-h-[200px] mb-2 space-y-1 ${terminalThemeClasses.shellText} custom-scrollbar pr-2`}>
                                        {history.map((line, i) => (
                                            <div key={i} className="break-words leading-relaxed">
                                                {line.startsWith('visitor') ? (
                                                    <span className={terminalThemeClasses.shellMuted}>{line}</span>
                                                ) : (
                                                    <span className={terminalThemeClasses.shellAccent}>{line}</span>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={bottomRef} />
                                    </div>
                                    <form onSubmit={handleCommand} className={`flex items-center gap-2 ${terminalThemeClasses.shellAccent} border-t ${terminalThemeClasses.shellBorder} pt-2`}>
                                        <span className={terminalThemeClasses.shellPrompt}>➜</span>
                                        <span className={terminalThemeClasses.shellMuted}>~</span>
                                        <input 
                                            ref={inputRef}
                                            type="text" 
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className={`bg-transparent border-none outline-none flex-1 text-[16px] md:text-xs ${terminalThemeClasses.shellText} placeholder-slate-700`}
                                            placeholder="Type 'help'..."
                                            autoFocus
                                            autoComplete="off"
                                        />
                                    </form>
                                </div>
                            )}
                        </div>

                        <div className="text-[9px] text-center text-slate-400 dark:text-slate-700 font-mono pt-1">
                            SYS_ID: 0x8492 // AMIRACLE_STUDIOS
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemHUD;
