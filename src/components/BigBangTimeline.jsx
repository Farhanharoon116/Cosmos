import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ERAS = [
  {
    name: 'Planck Epoch',
    time: '< 10⁻⁴³ s',
    color: '#6C63FF',
    icon: '🔬',
    size: 'Planck scale (10⁻³⁵ m)',
    desc: 'The universe is infinitely hot and dense. All four fundamental forces are unified into one. Space and time themselves are quantum foam.',
  },
  {
    name: 'Inflation',
    time: '10⁻³⁶ — 10⁻³² s',
    color: '#8B7FFF',
    icon: '💫',
    size: 'Grapefruit to light-year scale',
    desc: 'The universe expands exponentially — doubling at least 90 times in a fraction of a second. Quantum fluctuations become the seeds of large-scale structure.',
  },
  {
    name: 'Quark Epoch',
    time: '10⁻¹² — 10⁻⁶ s',
    color: '#F5A623',
    icon: '⚛',
    size: 'Light-minute scale',
    desc: 'Quarks and gluons roam free in a quark-gluon plasma. The temperature drops enough for the strong force to begin binding quarks into hadrons.',
  },
  {
    name: 'Nucleosynthesis',
    time: '3 — 20 minutes',
    color: '#4A90D9',
    icon: '🌡',
    size: 'Light-year scale',
    desc: 'Protons and neutrons fuse to form the first atomic nuclei: hydrogen, helium, and trace lithium. The universe remains a hot, opaque plasma.',
  },
  {
    name: 'Recombination',
    time: '~380,000 years',
    color: '#FF6B35',
    icon: '✨',
    size: '42 million light-years across',
    desc: 'The universe cools enough for electrons to bind with nuclei. Atoms form, photons travel freely — this relic light is the Cosmic Microwave Background we detect today.',
  },
  {
    name: 'First Stars',
    time: '~200 million years',
    color: '#FFD700',
    icon: '⭐',
    size: 'Billions of light-years',
    desc: 'Population III stars ignite — massive giants of pure hydrogen and helium. They forge the first heavy elements in their cores and end in spectacular supernovae.',
  },
  {
    name: 'Galaxy Formation',
    time: '1 — 3 billion years',
    color: '#6C63FF',
    icon: '🌌',
    size: 'Observable universe forms',
    desc: 'Galaxies and quasars emerge. Dark matter halos gravitationally attract normal matter. The cosmic web of filaments and voids takes shape.',
  },
  {
    name: 'Solar System',
    time: '~9 billion years',
    color: '#4A90D9',
    icon: '☀',
    size: 'Current observable universe',
    desc: 'A molecular cloud collapses to form our Sun. Leftover material forms a protoplanetary disk. Earth forms and is bombarded by asteroids carrying water.',
  },
  {
    name: 'Today',
    time: '13.8 billion years',
    color: '#E8EAF0',
    icon: '🌍',
    size: '93 billion light-years (diameter)',
    desc: 'Intelligent life asks where it came from. The expansion of the universe is accelerating due to dark energy. We are 13.8 billion years from the beginning.',
  },
  {
    name: 'Heat Death',
    time: '~10¹⁰⁰ years',
    color: '#334466',
    icon: '❄',
    size: 'Infinite and empty',
    desc: 'All stars burn out. Black holes evaporate via Hawking radiation. The universe reaches maximum entropy — a cold, dark, featureless equilibrium.',
  },
];

export default function BigBangTimeline() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 87%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section id="timeline" className="py-24 px-6" style={{ background: '#060a1a' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
            ✦ 13.8 Billion Years
          </p>
          <h2 className="font-space font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8EAF0' }}>
            Big Bang Timeline
          </h2>
          <p className="font-body text-base max-w-xl mx-auto" style={{ color: 'rgba(232,234,240,0.5)' }}>
            Scroll through cosmic history — from the first instant to the final silence
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Centre spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, #6C63FF 0%, rgba(108,99,255,0.1) 100%)' }}
          />

          <div className="space-y-10">
            {ERAS.map((era, i) => (
              <div
                key={era.name}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Card */}
                <div
                  className="flex-1 p-5 rounded-2xl"
                  style={{
                    background: 'rgba(5,8,22,0.85)',
                    border: `1px solid ${era.color}2E`,
                    boxShadow: `0 0 28px ${era.color}0D`,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{era.icon}</span>
                    <div>
                      <h3 className="font-space font-bold text-base" style={{ color: '#E8EAF0' }}>
                        {era.name}
                      </h3>
                      <p className="font-body text-xs mt-0.5" style={{ color: era.color }}>
                        {era.time}
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'rgba(232,234,240,0.65)' }}>
                    {era.desc}
                  </p>
                  <p className="font-body text-xs" style={{ color: 'rgba(232,234,240,0.3)' }}>
                    🔭 Scale: {era.size}
                  </p>
                </div>

                {/* Centre dot */}
                <div className="flex-shrink-0 z-10">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: era.color, boxShadow: `0 0 10px ${era.color}` }}
                  />
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
