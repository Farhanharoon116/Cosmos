import { useState, useRef, useEffect } from 'react';

const THEORIES = [
  {
    id: 'sr',
    title: 'Special Relativity',
    subtitle: 'Time dilation at high speed',
    icon: '⚡',
    demo: 'speed',
    description:
      'As you approach the speed of light, time slows relative to a stationary observer. This is time dilation — a direct consequence of the constant speed of light in all reference frames, discovered by Einstein in 1905.',
  },
  {
    id: 'gr',
    title: 'General Relativity',
    subtitle: 'Spacetime warped by mass',
    icon: '🌀',
    demo: 'grid',
    description:
      'Mass tells spacetime how to curve, and curved spacetime tells matter how to move. What we feel as gravity is actually matter following the shortest path through curved spacetime — called a geodesic.',
  },
  {
    id: 'qt',
    title: 'Quantum Tunneling',
    subtitle: 'Particles through barriers',
    icon: '⚛',
    demo: 'tunnel',
    description:
      'In quantum mechanics, particles are probability waves, not definite points. These waves can "tunnel" through barriers that classically should be impenetrable — making nuclear fusion in stars and transistors in computers possible.',
  },
  {
    id: 'st',
    title: 'String Theory',
    subtitle: 'Vibrating extra dimensions',
    icon: '〰',
    demo: 'strings',
    description:
      'All fundamental particles are one-dimensional vibrating strings of energy. Different vibrational modes produce different particles. The theory requires 10 or 11 dimensions — most curled up at the Planck scale.',
  },
];

// ─── Special Relativity Demo ────────────────────────────────────────────────
function SpeedDemo({ speed }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      const beta = speed / 100;
      const gamma = beta >= 1 ? 9999 : 1 / Math.sqrt(1 - beta * beta);
      const dilatedRate = 1 / gamma;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5,8,22,0.95)';
      ctx.fillRect(0, 0, w, h);

      const drawClock = (cx, cy, r, rate, label, col) => {
        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tick marks
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * (r - 7), cy + Math.sin(a) * (r - 7));
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Clock hand
        const handAngle = (Date.now() / 5000) * rate * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(handAngle) * (r - 10), cy + Math.sin(handAngle) * (r - 10));
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Centre dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        // Label
        ctx.fillStyle = col;
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, cy + r + 20);
      };

      drawClock(w * 0.28, h * 0.48, 55, 1, 'Stationary', '#E8EAF0');
      drawClock(w * 0.72, h * 0.48, 55, dilatedRate, `Traveler at ${speed}% c`, '#6C63FF');

      // γ value
      ctx.fillStyle = '#F5A623';
      ctx.font = 'bold 14px Space Grotesk, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`γ = ${gamma.toFixed(3)}`, w * 0.72, h * 0.48 + 90);
      ctx.fillStyle = 'rgba(232,234,240,0.45)';
      ctx.font = '11px Inter';
      ctx.fillText(`Time flows ${gamma.toFixed(2)}× slower`, w * 0.72, h * 0.48 + 108);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── General Relativity Demo ────────────────────────────────────────────────
function GridDemo({ mass }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const depth = mass * 32;
    const G = 20;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(5,8,22,0.95)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(108,99,255,0.3)';
    ctx.lineWidth = 0.8;

    const N = 18;
    const spacing = Math.min(w, h) * 0.9 / N;

    const warp = (gx, gy) => {
      const dx = gx - cx, dy = gy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const factor = depth / (dist + depth);
      return { x: gx - dx * factor * 0.7, y: gy - dy * factor * 0.7 };
    };

    // Horizontal grid lines
    for (let j = -N / 2; j <= N / 2; j++) {
      ctx.beginPath();
      for (let i = -N / 2; i <= N / 2; i++) {
        const gx = cx + i * spacing, gy = cy + j * spacing;
        const p = warp(gx, gy);
        i === -N / 2 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = -N / 2; i <= N / 2; i++) {
      ctx.beginPath();
      for (let j = -N / 2; j <= N / 2; j++) {
        const gx = cx + i * spacing, gy = cy + j * spacing;
        const p = warp(gx, gy);
        j === -N / 2 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Mass object
    const r = 8 + mass * G * 0.6;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
    glow.addColorStop(0, `rgba(245,166,35,${0.3 + mass * 0.05})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,166,35,${0.7 + mass * 0.03})`;
    ctx.fill();
    ctx.strokeStyle = '#F5A623'; ctx.lineWidth = 1.5; ctx.stroke();
  }, [mass]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── Quantum Tunneling Demo ──────────────────────────────────────────────────
function TunnelDemo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, t = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      t += 0.04;
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5,8,22,0.95)';
      ctx.fillRect(0, 0, w, h);

      const bx = w * 0.5;

      // Barrier
      ctx.fillStyle = 'rgba(245,166,35,0.18)';
      ctx.fillRect(bx - 12, 0, 24, h);
      ctx.strokeStyle = 'rgba(245,166,35,0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 12, 0, 24, h);
      ctx.fillStyle = 'rgba(245,166,35,0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Potential Barrier', bx, 22);

      const amp = 55;
      for (let side = 0; side < 2; side++) {
        const startX = side === 0 ? 24 : bx + 14;
        const endX   = side === 0 ? bx - 14 : w - 24;
        const decay  = side === 1 ? 0.38 : 1;

        // Probability cloud
        for (let x = startX; x < endX; x += 2) {
          const phase = (x / w) * 8 * Math.PI - t * 2;
          const prob  = Math.pow(Math.sin(phase) * decay, 2);
          ctx.fillStyle = `rgba(108,99,255,${prob * 0.14})`;
          ctx.fillRect(x, h / 2 - amp, 2, amp * 2);
        }

        // Wave
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108,99,255,${side === 0 ? 0.9 : 0.5})`;
        ctx.lineWidth = 2;
        for (let x = startX; x < endX; x++) {
          const phase = (x / w) * 8 * Math.PI - t * 2;
          const y = h / 2 + Math.sin(phase) * amp * decay;
          x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(232,234,240,0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('Incident wave →', 30, h - 25);
      ctx.fillStyle = 'rgba(108,99,255,0.7)';
      ctx.textAlign = 'right';
      ctx.fillText('← Tunneled wave (attenuated)', w - 24, h - 25);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── String Theory Demo ─────────────────────────────────────────────────────
function StringDemo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const strings = Array.from({ length: 12 }, (_, i) => ({
      phase: (i / 12) * Math.PI * 2,
      freq:  1 + i * 0.5,
      color: i % 3 === 0 ? '#6C63FF' : i % 3 === 1 ? '#F5A623' : '#4A90D9',
      amp:   20 + Math.random() * 30,
      yFrac: 0.08 + (i / 12) * 0.84,
    }));

    let animId, t = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      t += 0.022;
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5,8,22,0.95)';
      ctx.fillRect(0, 0, w, h);

      strings.forEach((s) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        const cy = h * s.yFrac;
        for (let x = 20; x <= w - 20; x++) {
          const y = cy + Math.sin((x / w) * s.freq * Math.PI * 2 + t + s.phase) * s.amp;
          x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.fillStyle = 'rgba(232,234,240,0.4)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Each string\'s vibration mode = a unique fundamental particle', w / 2, h - 14);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TheoryLab() {
  const [active, setActive] = useState(THEORIES[0]);
  const [speed, setSpeed] = useState(50);
  const [mass, setMass] = useState(3);

  return (
    <section id="theories" className="min-h-screen py-24 px-6" style={{ background: '#060a1a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
            ✦ Interactive Science
          </p>
          <h2 className="font-space font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8EAF0' }}>
            Theory Explainer Lab
          </h2>
          <p className="font-body text-base max-w-xl mx-auto" style={{ color: 'rgba(232,234,240,0.5)' }}>
            Interact with the most profound ideas in physics
          </p>
        </div>

        {/* Theory tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {THEORIES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t)}
              className="p-4 rounded-xl text-left transition-all duration-300"
              style={{
                background: active.id === t.id ? 'rgba(108,99,255,0.2)' : 'rgba(30,42,74,0.15)',
                border: `1px solid ${active.id === t.id ? 'rgba(108,99,255,0.5)' : 'rgba(108,99,255,0.1)'}`,
              }}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div
                className="font-space text-sm font-semibold"
                style={{ color: active.id === t.id ? '#6C63FF' : '#E8EAF0' }}
              >
                {t.title}
              </div>
              <div className="font-body text-xs mt-1" style={{ color: 'rgba(232,234,240,0.4)' }}>
                {t.subtitle}
              </div>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo canvas */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: 320, background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
          >
            {active.demo === 'speed'  && <SpeedDemo speed={speed} />}
            {active.demo === 'grid'   && <GridDemo mass={mass} />}
            {active.demo === 'tunnel' && <TunnelDemo />}
            {active.demo === 'strings'&& <StringDemo />}
          </div>

          {/* Explanation + controls */}
          <div className="flex flex-col gap-4">
            <div
              className="p-6 rounded-2xl flex-1"
              style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: '#6C63FF' }}>✦</span>
                <span className="font-space text-sm font-medium" style={{ color: '#6C63FF' }}>AI Explanation</span>
              </div>
              <h3 className="font-space font-bold text-xl mb-3" style={{ color: '#E8EAF0' }}>{active.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,234,240,0.7)' }}>
                {active.description}
              </p>
            </div>

            {/* Sliders */}
            {active.demo === 'speed' && (
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-space text-sm" style={{ color: '#E8EAF0' }}>Speed</span>
                  <span className="font-space text-sm font-bold" style={{ color: '#F5A623' }}>{speed}% of c</span>
                </div>
                <input
                  type="range" min="1" max="99.9" step="0.1"
                  value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <p className="font-body text-xs mt-2" style={{ color: 'rgba(232,234,240,0.4)' }}>
                  Lorentz γ = {(1 / Math.sqrt(1 - Math.pow(speed / 100, 2))).toFixed(4)}
                </p>
              </div>
            )}
            {active.demo === 'grid' && (
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-space text-sm" style={{ color: '#E8EAF0' }}>Object Mass</span>
                  <span className="font-space text-sm font-bold" style={{ color: '#F5A623' }}>{mass.toFixed(1)} M☉</span>
                </div>
                <input
                  type="range" min="0.5" max="10" step="0.1"
                  value={mass} onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
