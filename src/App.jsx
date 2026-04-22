import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SolarSystem from './components/SolarSystem';
import BlackHole from './components/BlackHole';
import TheoryLab from './components/TheoryLab';
import BigBangTimeline from './components/BigBangTimeline';
import TonightsSky from './components/TonightsSky';
import StarLifeCycle from './components/StarLifeCycle';
import AskAI from './components/AskAI';

const SECTION_IDS = ['hero', 'solar-system', 'black-hole', 'theories', 'timeline', 'tonight', 'stars'];

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [aiOpen, setAiOpen] = useState(false);

  // Intersection observer to track which section is in view
  useEffect(() => {
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div style={{ background: '#050816', minHeight: '100vh' }}>
      <Navigation activeSection={activeSection} onAskAI={() => setAiOpen(true)} />

      <Hero />
      <SolarSystem />
      <BlackHole />
      <TheoryLab />
      <BigBangTimeline />
      <TonightsSky />
      <StarLifeCycle />

      {/* Footer */}
      <footer
        className="py-14 px-6 text-center"
        style={{ borderTop: '1px solid rgba(108,99,255,0.08)', background: '#050816' }}
      >
        <p className="font-space font-bold text-2xl mb-2" style={{ color: '#E8EAF0' }}>✦ COSMOS</p>
        <p className="font-body text-sm mb-6" style={{ color: 'rgba(232,234,240,0.35)' }}>
          Explore the universe, live.
        </p>
        <p className="font-body text-xs" style={{ color: 'rgba(232,234,240,0.18)' }}>
          Built with Three.js · GSAP · React · Tailwind CSS · cosmic wonder
        </p>
      </footer>

      {/* Floating Ask AI button */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-space text-sm font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: '#6C63FF',
            color: '#fff',
            boxShadow: '0 0 28px rgba(108,99,255,0.5)',
          }}
        >
          <span>✦</span>
          <span>Ask AI</span>
        </button>
      )}

      <AskAI activeSection={activeSection} isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
