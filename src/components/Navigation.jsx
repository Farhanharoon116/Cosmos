import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Solar System', href: '#solar-system' },
  { label: 'Black Hole', href: '#black-hole' },
  { label: 'Theories', href: '#theories' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Tonight', href: '#tonight' },
  { label: 'Stars', href: '#stars' },
];

export default function Navigation({ activeSection, onAskAI }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(5, 8, 22, 0.88)' : 'rgba(5, 8, 22, 0.1)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(108, 99, 255, 0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-space font-bold text-xl tracking-wider"
          style={{ color: '#E8EAF0' }}
        >
          ✦ COSMOS
        </a>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-body text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive ? '#6C63FF' : '#9CA3AF',
                    textShadow: isActive ? '0 0 14px rgba(108,99,255,0.6)' : 'none',
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Ask AI Button */}
        <button
          onClick={onAskAI}
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-space font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: 'rgba(108, 99, 255, 0.15)',
            border: '1px solid rgba(108, 99, 255, 0.4)',
            color: '#6C63FF',
          }}
        >
          <span>✦</span>
          <span>Ask AI</span>
        </button>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="w-6 h-0.5 bg-gray-300 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}
          />
          <span
            className="w-6 h-0.5 bg-gray-300 transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-6 h-0.5 bg-gray-300 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 flex flex-col items-center justify-center gap-8 z-40"
          style={{ background: 'rgba(5, 8, 22, 0.97)' }}
        >
          <button
            className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-space text-2xl font-medium text-gray-300 hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onAskAI(); }}
            className="mt-4 px-8 py-3 rounded-full font-space text-base font-medium"
            style={{ background: '#6C63FF', color: '#fff' }}
          >
            ✦ Ask AI
          </button>
        </div>
      )}
    </nav>
  );
}
