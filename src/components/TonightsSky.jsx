import { useState, useEffect, useRef } from 'react';

const SKY_OBJECTS = [
  {
    name: 'Moon', type: 'Natural Satellite', visible: true, ra: 165, dec: 22,
    brightness: -12.6, color: '#E8EAF0',
    desc: 'Earth\'s natural satellite — visible with the naked eye. The Moon\'s gravity drives our tides and stabilises Earth\'s axial tilt.',
  },
  {
    name: 'Jupiter', type: 'Planet', visible: true, ra: 48, dec: -4,
    brightness: -2.9, color: '#C88B3A',
    desc: 'Largest planet in the solar system. Visible as a bright cream-coloured star. Look for its four large Galilean moons with binoculars.',
  },
  {
    name: 'Mars', type: 'Planet', visible: true, ra: 118, dec: 14,
    brightness: 0.4, color: '#C1440E',
    desc: 'The Red Planet — distinguishable by its reddish hue. Currently well-placed for observation in the evening sky.',
  },
  {
    name: 'Sirius', type: 'Star', visible: true, ra: 101, dec: -17,
    brightness: -1.46, color: '#B0C4DE',
    desc: 'The brightest star in Earth\'s night sky — part of Canis Major. A binary system 8.6 light-years away. Blue-white in colour.',
  },
  {
    name: 'Orion', type: 'Constellation', visible: true, ra: 83, dec: 5,
    brightness: null, color: '#6C63FF',
    desc: 'The Hunter. Contains Betelgeuse (red supergiant at 700 light-years) and Rigel (blue supergiant). The Orion Nebula is visible to the naked eye.',
  },
  {
    name: 'ISS', type: 'Space Station', visible: true, ra: 210, dec: 35,
    brightness: -3.5, color: '#F5A623',
    desc: 'International Space Station — visible as a fast, bright, steadily moving point. Orbits Earth every 90 minutes at ~400 km altitude.',
  },
  {
    name: 'Pleiades', type: 'Open Cluster', visible: true, ra: 57, dec: 24,
    brightness: 1.6, color: '#7DE8E8',
    desc: 'The Seven Sisters — an open cluster 444 light-years away. Most people can distinguish 6 stars with the naked eye.',
  },
  {
    name: 'Venus', type: 'Planet', visible: false, ra: 5, dec: -18,
    brightness: -4.6, color: '#E8C67A',
    desc: 'Currently below the horizon. Venus is often the brightest object in the sky after the Sun and Moon — nicknamed the "Evening Star".',
  },
];

export default function TonightsSky() {
  const canvasRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [selected, setSelected] = useState(null);

  const getLocation = () => {
    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude.toFixed(2), lon: pos.coords.longitude.toFixed(2) });
        setLoading(false);
      },
      () => {
        setGeoError('Location denied — showing demo sky map.');
        setLocation({ lat: 40.71, lon: -74.01 });
        setLoading(false);
      }
    );
  };

  // Draw star map whenever location or selection changes
  useEffect(() => {
    if (!location || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);

      // Sky gradient
      const grad = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, Math.max(w, h));
      grad.addColorStop(0, '#0a0520');
      grad.addColorStop(0.5, '#050816');
      grad.addColorStop(1, '#020310');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Horizon glow
      const hGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
      hGrad.addColorStop(0, 'transparent');
      hGrad.addColorStop(1, 'rgba(108,99,255,0.07)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, 0, w, h);

      // Background stars
      for (let i = 0; i < 700; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.85;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,234,240,${Math.random() * 0.65 + 0.1})`;
        ctx.fill();
      }

      // Horizon line
      ctx.strokeStyle = 'rgba(108,99,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      ctx.lineTo(w, h * 0.85);
      ctx.stroke();

      // Draw objects
      SKY_OBJECTS.filter((o) => o.visible).forEach((obj) => {
        const x = (obj.ra / 360) * w * 0.9 + w * 0.05;
        const y = h * 0.1 + ((90 - obj.dec) / 100) * h * 0.7;
        const r = obj.type === 'Constellation' ? 0 : Math.max(2, 5 - (obj.brightness || 2));
        const isSelected = selected?.name === obj.name;

        if (obj.type !== 'Constellation') {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
          glow.addColorStop(0, obj.color + (isSelected ? 'CC' : '70'));
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();

          ctx.beginPath(); ctx.arc(x, y, isSelected ? r * 1.4 : r, 0, Math.PI * 2);
          ctx.fillStyle = obj.color; ctx.fill();
        }

        ctx.fillStyle = isSelected ? '#6C63FF' : 'rgba(232,234,240,0.6)';
        ctx.font = `${obj.type === 'Constellation' ? 'bold ' : ''}10px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(obj.name, x, y - r - 7);
      });
    };

    draw();
  }, [location, selected]);

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    for (const obj of SKY_OBJECTS) {
      if (!obj.visible) continue;
      const x = (obj.ra / 360) * w * 0.9 + w * 0.05;
      const y = h * 0.1 + ((90 - obj.dec) / 100) * h * 0.7;
      if (Math.hypot(mx - x, my - y) < 22) {
        setSelected(obj);
        return;
      }
    }
    setSelected(null);
  };

  return (
    <section id="tonight" className="min-h-screen py-24 px-6" style={{ background: '#050816' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
            ✦ Live Sky Map
          </p>
          <h2 className="font-space font-bold text-4xl md:text-5xl mb-4" style={{ color: '#E8EAF0' }}>
            Tonight&apos;s Sky
          </h2>

          {!location ? (
            <>
              <p className="font-body text-base mb-6" style={{ color: 'rgba(232,234,240,0.5)' }}>
                See what&apos;s visible from your location tonight
              </p>
              <button
                onClick={getLocation}
                disabled={loading}
                className="px-8 py-3.5 rounded-full font-space font-medium text-sm transition-all hover:scale-105 disabled:opacity-60"
                style={{ background: '#6C63FF', color: '#fff', boxShadow: '0 0 24px rgba(108,99,255,0.4)' }}
              >
                {loading ? 'Locating…' : '📍 Use My Location'}
              </button>
              {geoError && (
                <p className="font-body text-sm mt-3" style={{ color: '#F5A623' }}>{geoError}</p>
              )}
            </>
          ) : (
            <p className="font-body text-sm" style={{ color: 'rgba(232,234,240,0.4)' }}>
              📍 {location.lat}°, {location.lon}° — Click any object to learn more
            </p>
          )}
        </div>

        {location && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Star map canvas */}
            <div
              className="lg:col-span-2 rounded-2xl overflow-hidden cursor-pointer"
              style={{ height: 480, border: '1px solid rgba(108,99,255,0.15)' }}
            >
              <canvas ref={canvasRef} className="w-full h-full" onClick={handleCanvasClick} />
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-4">
              {selected ? (
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(5,8,22,0.92)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: '#6C63FF' }}>✦</span>
                    <span className="font-space text-sm font-medium" style={{ color: '#6C63FF' }}>AI Insight</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: selected.color }} />
                    <h3 className="font-space font-bold text-lg" style={{ color: '#E8EAF0' }}>{selected.name}</h3>
                  </div>
                  <p className="font-body text-xs mb-3" style={{ color: selected.color }}>{selected.type}</p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,234,240,0.7)' }}>
                    {selected.desc}
                  </p>
                  {selected.brightness !== null && (
                    <p className="font-body text-xs mt-3" style={{ color: 'rgba(232,234,240,0.35)' }}>
                      Apparent magnitude: {selected.brightness}
                    </p>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="mt-4 text-xs transition-colors hover:text-indigo-400"
                    style={{ color: 'rgba(108,99,255,0.6)' }}
                  >
                    ← Back to list
                  </button>
                </div>
              ) : (
                <div
                  className="p-5 rounded-2xl"
                  style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(108,99,255,0.15)' }}
                >
                  <h3 className="font-space font-medium text-base mb-4" style={{ color: '#E8EAF0' }}>
                    Visible Tonight
                  </h3>
                  <div className="space-y-2">
                    {SKY_OBJECTS.filter((o) => o.visible).map((obj) => (
                      <button
                        key={obj.name}
                        onClick={() => setSelected(obj)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(108,99,255,0.05)', border: '1px solid transparent' }}
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: obj.color }} />
                        <div>
                          <p className="font-space text-sm" style={{ color: '#E8EAF0' }}>{obj.name}</p>
                          <p className="font-body text-xs" style={{ color: 'rgba(232,234,240,0.4)' }}>{obj.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
