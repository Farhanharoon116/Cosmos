import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AI_TEXTS = [
  'A micro black hole — purely theoretical. At this scale, quantum effects dominate over gravity.',
  'A stellar-mass black hole. Its event horizon is the point of no return — not even light can escape once it crosses this boundary.',
  'Growing to intermediate mass. The accretion disk intensifies as matter spirals inward, releasing enormous energy as X-rays.',
  'A massive black hole. The photon sphere — where light orbits endlessly — is now clearly visible. Time slows dramatically near the horizon.',
  'A supermassive black hole like Sagittarius A* at our galaxy\'s center. Millions of solar masses. Its gravitational influence shapes entire galaxies.',
];

export default function BlackHole() {
  const canvasRef = useRef(null);
  const massRef = useRef(4);
  const [mass, setMass] = useState(4);
  const [aiText, setAiText] = useState(AI_TEXTS[1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x111133, 2));

    // Black hole core
    const bh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(bh);

    // Photon sphere glow
    const photonSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x6C63FF, transparent: true, opacity: 0.06, side: THREE.BackSide })
    );
    scene.add(photonSphere);

    // Accretion disk rings
    const diskGroup = new THREE.Group();
    const diskColors = [0xFF6B35, 0xFF8C00, 0xFFD700, 0xFFA500, 0xFF4500];
    for (let i = 0; i < 60; i++) {
      const r = 2.2 + i * 0.12;
      const col = diskColors[Math.floor((i / 60) * diskColors.length)];
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.025 - i * 0.0002, 6, 128),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: Math.max(0.05, 0.7 - i * 0.01) })
      );
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.15;
      diskGroup.add(ring);
    }
    scene.add(diskGroup);

    // Disk particles
    const pCount = 3000;
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 7;
      pPos[i * 3]     = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;
      const t = radius / 9;
      pCol[i * 3] = 1.0; pCol[i * 3 + 1] = 0.4 + t * 0.3; pCol[i * 3 + 2] = t * 0.2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.04, vertexColors: true, transparent: true, opacity: 0.8,
    }));
    scene.add(particles);

    // Background stars
    const bgPos = new Float32Array(3000 * 3);
    for (let i = 0; i < bgPos.length; i++) bgPos[i] = (Math.random() - 0.5) * 200;
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 })));

    // Animation loop
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const m = massRef.current;
      const scale = 0.5 + m * 0.18;

      bh.scale.setScalar(scale);
      photonSphere.scale.setScalar(scale * 1.5);
      diskGroup.rotation.y += 0.004;
      diskGroup.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.05;
      particles.rotation.y += 0.006;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleMassChange = (val) => {
    const m = Number(val);
    setMass(m);
    massRef.current = m;
    const idx = Math.min(4, Math.floor((m - 1) / 9 * 5));
    setAiText(AI_TEXTS[idx]);
  };

  const massLabel =
    mass < 3 ? 'Micro' : mass < 5 ? 'Stellar' : mass < 7 ? 'Intermediate' : mass < 9 ? 'Massive' : 'Supermassive';

  return (
    <section id="black-hole" className="min-h-screen relative overflow-hidden" style={{ background: '#020408' }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-24 px-6 text-center pointer-events-none">
        <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
          ✦ Spacetime Curvature
        </p>
        <h2 className="font-space font-bold text-4xl md:text-5xl" style={{ color: '#E8EAF0' }}>
          Black Hole Simulator
        </h2>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-screen" />

      {/* Mass slider */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-8 py-6 rounded-2xl w-full max-w-md"
        style={{
          background: 'rgba(5, 8, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
        }}
      >
        <div className="flex justify-between mb-2">
          <span className="font-space text-sm" style={{ color: '#E8EAF0' }}>Black Hole Mass</span>
          <span className="font-space text-sm font-bold" style={{ color: '#F5A623' }}>{massLabel}</span>
        </div>
        <input
          type="range" min="1" max="10" step="0.1"
          value={mass}
          onChange={(e) => handleMassChange(e.target.value)}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between mt-1 text-xs" style={{ color: 'rgba(232,234,240,0.3)' }}>
          <span>Micro</span><span>Stellar</span><span>Intermediate</span><span>Supermassive</span>
        </div>
      </div>

      {/* AI Insight panel */}
      <div
        className="absolute top-1/2 right-6 -translate-y-1/2 z-20 w-72 p-5 rounded-2xl"
        style={{
          background: 'rgba(5, 8, 22, 0.90)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: '#6C63FF' }}>✦</span>
          <span className="font-space text-sm font-medium" style={{ color: '#6C63FF' }}>AI Insight</span>
        </div>
        <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,234,240,0.75)' }}>
          {aiText}
        </p>
      </div>
    </section>
  );
}
