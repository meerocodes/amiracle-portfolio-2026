
import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SystemHUD from './components/AIChat';
import Scene3D from './components/Scene3D';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UIProvider>
        <div className="min-h-screen bg-transparent selection:bg-neon-indigo dark:selection:bg-neon-cyan selection:text-white dark:selection:text-black font-sans transition-colors duration-300">
          <Navigation />
          
          {/* Fixed 3D Background that morphs on scroll */}
          <Scene3D />
          
          <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <Contact />
          </main>
          
          {/* Interactive System HUD Widget */}
          <SystemHUD />
        </div>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
