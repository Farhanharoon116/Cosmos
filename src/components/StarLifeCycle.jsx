import { useState, useEffect, useRef } from 'react';

// Compute the star's life-cycle stages from its initial mass (solar masses)
function getStages(mass) {
  const stages = [
    {
      name: 'Nebula',
      color: '#9B59B6',
      duration: '~10 million years',
      desc: 'A vast cloud of gas and dust begins collapsing under gravity. As it contracts it heats, setting the stage for a new star.',
    },
  ];

  if (mass < 0.08) {
    stages.push({
      name: 'Brown Dwarf',
      color: '#8B4513',
      duration: 'Trillions of years',
      desc: 'Not massive enough to ignite hydrogen fusion. A "failed star" that slowly cools and dims over cosmic time.',
    });
    return stages;
  }

  stages.push({
    name: 'Protostar',
    color: '#FF8C00',
    duration: '~100,000 years',
    desc: 'A forming star still surrounded by its accretion disk. Gravitational energy heats the core as infalling matter powers its luminosity.',
  });

  const msColor = mass < 0.5 ? '#FF6347' : mass < 2 ? '#FFFF99' : mass < 8 ? '#FFFFFF' : '#A0C4FF';
  const msDuration = mass < 0.5 ? 'Trillions of years' : mass < 2 ? '~10 billion years' : '~100 million years';
  const msDesc =
    mass < 0.5
      ? 'A red dwarf — burns hydrogen very slowly. By far the most common type of star. Will outlive all others by trillions of years.'
      : mass < 2
      ? 'A yellow dwarf like our Sun — steadily fusing hydrogen into helium over billions of years.'
      : mass < 8
      ? 'A massive B-type star — bright blue-white, burning through its fuel in hundreds of millions of years.'
      : 'A massive O-type star — burns fiercely and briefly, exhausting its core hydrogen in mere millions of years.';

  stages.push({ name: 'Main Sequence', color: msColor, duration: msDuration, desc: msDesc });

  if (mass < 0.5) {
    stages.push({
      name: 'White Dwarf',
      color: '#E0E0FF',
      duration: 'Indefinite',
      desc: 'Red dwarfs transition directly to white dwarfs — Earth-sized crystalline remnants slowly cooling for eternity.',
    });
  } else if (mass < 8) {
    stages.push({
      name: 'Red Giant',
      color: '#FF4500',
      duration: '~1 billion years',
      desc: 'Hydrogen in the core exhausted, the star expands enormously — swallowing inner planets. Helium shell burning begins.',
    });
    stages.push({
      name: 'Planetary Nebula',
      color: '#7DE8E8',
      duration: '~10,000 years',
      desc: 'The outer layers are ejected in beautiful glowing shells. Heavy elements forged in the star seed surrounding space.',
    });
    stages.push({
      name: 'White Dwarf',
      color: '#E0E0FF',
      duration: 'Indefinite',
      desc: 'The exposed stellar core — a crystal of carbon and oxygen — slowly radiates its remaining heat into the void.',
    });
  } else if (mass < 25) {
    stages.push({
      name: 'Red Supergiant',
      color: '#FF2200',
      duration: '~10 million years',
      desc: 'The star becomes one of the most luminous objects in the galaxy, fusing progressively heavier elements up to iron.',
    });
    stages.push({
      name: 'Supernova',
      color: '#FFD700',
      duration: 'Days to weeks',
      desc: 'The iron core collapses in milliseconds, triggering a shockwave that blasts the outer layers apart. Brighter than a galaxy.',
    });
    stages.push({
      name: 'Neutron Star',
      color: '#00CED1',
      duration: 'Billions of years',
      desc: 'A city-sized ball of neutron-degenerate matter. Incredibly dense — a teaspoon weighs a billion tonnes. Often spins as a pulsar.',
    });
  } else {
    stages.push({
      name: 'Hypergiant',
      color: '#FF1100',
      duration: '~1 million years',
      desc: 'Among the most massive and luminous objects in the universe. Violently unstable — sheds mass in powerful stellar winds.',
    });
    stages.push({
      name: 'Hypernova',
      color: '#FF6600',
      duration: 'Minutes to hours',
      desc: 'A catastrophic collapse far more energetic than a supernova. Produces a gamma-ray burst — the most energetic event in the universe.',
    });
    stages.push({
      name: 'Black Hole',
      color: '#555577',
      duration: 'Indefinite',
      desc: 'A singularity of infinite density where spacetime itself breaks down. Not even light can escape the event horizon.',
    });
  }

  return stages;
}

// Canvas drawing for a given stage
function drawStage(canvas, stage) {
  const ctx = canvas.getContext('2d');
  const w = (canvas.width = canvas.offsetWidth);
  const h = (canvas.height = canvas.offsetHeight);
  const cx = w / 2, cy = h / 2;

  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) / 2);
  bg.addColorStop(0, '#040810');
  bg.addColorStop(1, '#020408');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Background stars
  for (let i = 0; i < 150; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,234,240,${Math.random() * 0.45 + 0.1})`;
    ctx.fill();
  }

  const name = stage.name;
  const col = stage.color;

  if (name === 'Nebula') {
    for (let i = 0; i < 350; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * 110;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, Math.random() * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(155,89,182,${Math.random() * 0.35 + 0.05})`;
      ctx.fill();
    }
  } else if (name === 'Black Hole') {
    ctx.beginPath(); ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#000'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy, 90, 18, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,100,0,0.7)'; ctx.lineWidth = 7; ctx.stroke();
    const glowG = ctx.createRadialGradient(cx, cy, 40, cx, cy, 72);
    glowG.addColorStop(0, 'rgba(108,99,255,0.28)');
    glowG.addColorStop(1, 'transparent');
    ctx.fillStyle = glowG;
    ctx.beginPath(); ctx.arc(cx, cy, 72, 0, Math.PI * 2); ctx.fill();
  } else if (name === 'Supernova' || name === 'Hypernova') {
    for (let ring = 0; ring < 5; ring++) {
      ctx.beginPath();
      ctx.arc(cx, cy, 28 + ring * 20, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,${190 - ring * 30},0,${0.65 - ring * 0.1})`;
      ctx.lineWidth = 3; ctx.stroke();
    }
    for (let i = 0; i < 55; i++) {
      const angle = (i / 55) * Math.PI * 2;
      const len = 55 + Math.random() * 65;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = `rgba(255,${140 + Math.random() * 115},0,0.28)`;
      ctx.lineWidth = 1; ctx.stroke();
    }
  } else if (name === 'Planetary Nebula') {
    for (let ring = 0; ring < 4; ring++) {
      ctx.beginPath();
      ctx.arc(cx, cy, 30 + ring * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(125,232,232,${0.5 - ring * 0.1})`;
      ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#E0E0FF'; ctx.fill();
  } else {
    const size =
      name.includes('Giant') || name.includes('Hypergiant') ? 72
      : name === 'Protostar' ? 28
      : name === 'Main Sequence' ? 44
      : name === 'White Dwarf' ? 14
      : name === 'Neutron Star' ? 9
      : name === 'Brown Dwarf' ? 20
      : 38;

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.6);
    glow.addColorStop(0, col + '50'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, size * 2.6, 0, Math.PI * 2); ctx.fill();

    const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(0.35, col);
    body.addColorStop(1, col + '70');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill();
  }
}

export default function StarLifeCycle() {
  const [mass, setMass] = useState(1);
  const [stages, setStages] = useState(() => getStages(1));
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Recompute stages on mass change
  useEffect(() => {
    const s = getStages(mass);
    setStages(s);
    setActiveIdx(0);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, [mass]);

  // Redraw canvas when stage changes
  useEffect(() => {
    if (canvasRef.current && stages[activeIdx]) {
      drawStage(canvasRef.current, stages[activeIdx]);
    }
  }, [activeIdx, stages]);

  const playLifeCycle = () => {
    setPlaying(true);
    setActiveIdx(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      if (i >= stages.length) {
        clearInterval(intervalRef.current);
        setPlaying(false);
      } else {
        setActiveIdx(i);
      }
    }, 2600);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const massLabel =
    mass < 0.08 ? 'Brown Dwarf'
    : mass < 0.5 ? 'Red Dwarf'
    : mass < 2   ? 'Sun-like'
    : mass < 8   ? 'Massive'
    : mass < 25  ? 'Very Massive'
    : 'Hypermassive';

  return (
    <section id="stars" className="min-h-screen py-24 px-6" style={{ background: '#050816' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
            ✦ Stellar Evolution
          </p>
          <h2 className="font-space font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8EAF0' }}>
            Star Life Cycle Sandbox
          </h2>
          <p className="font-body text-base max-w-xl mx-auto" style={{ color: 'rgba(232,234,240,0.5)' }}>
            Choose a star&apos;s initial mass and watch its entire life unfold
          </p>
        </div>

        {/* Mass slider */}
        <div
          className="max-w-2xl mx-auto p-6 rounded-2xl mb-10"
          style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.2)' }}
        >
          <div className="flex justify-between mb-3">
            <span className="font-space text-sm" style={{ color: '#E8EAF0' }}>Initial Mass</span>
            <span className="font-space text-sm font-bold" style={{ color: '#F5A623' }}>
              {massLabel} — {mass} M☉
            </span>
          </div>
          <input
            type="range" min="0.01" max="100" step="0.01"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-indigo-500 mb-2"
          />
          <div className="flex justify-between text-xs" style={{ color: 'rgba(232,234,240,0.3)' }}>
            <span>0.01 M☉</span><span>Red Dwarf</span><span>Sun</span><span>Giant</span><span>100 M☉</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Canvas */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: 360, border: '1px solid rgba(108,99,255,0.15)', background: '#030610' }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Info + stage selector */}
          <div className="flex flex-col gap-4">
            {stages[activeIdx] && (
              <div
                className="p-5 rounded-2xl flex-1"
                style={{ background: 'rgba(5,8,22,0.88)', border: '1px solid rgba(108,99,255,0.2)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: stages[activeIdx].color }} />
                  <h3 className="font-space font-bold text-lg" style={{ color: '#E8EAF0' }}>
                    {stages[activeIdx].name}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'rgba(232,234,240,0.7)' }}>
                  {stages[activeIdx].desc}
                </p>
                <p className="font-body text-xs" style={{ color: 'rgba(232,234,240,0.35)' }}>
                  ⏱ {stages[activeIdx].duration}
                </p>
              </div>
            )}

            <div
              className="p-4 rounded-2xl"
              style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
            >
              <p className="font-space text-xs mb-3" style={{ color: 'rgba(232,234,240,0.4)' }}>
                Life Cycle Stages
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {stages.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => { clearInterval(intervalRef.current); setPlaying(false); setActiveIdx(i); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: activeIdx === i ? s.color + '28' : 'rgba(30,42,74,0.3)',
                      border: `1px solid ${activeIdx === i ? s.color : 'rgba(108,99,255,0.15)'}`,
                      color: activeIdx === i ? s.color : 'rgba(232,234,240,0.5)',
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <button
                onClick={playLifeCycle}
                disabled={playing}
                className="w-full py-2.5 rounded-full font-space text-sm font-medium transition-all disabled:opacity-60"
                style={{ background: playing ? 'rgba(108,99,255,0.2)' : '#6C63FF', color: '#fff' }}
              >
                {playing ? '▶ Playing…' : '▶ Play Full Life Cycle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
