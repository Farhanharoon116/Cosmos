import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Stars
    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const shade = Math.random();
      if (shade > 0.95) {
        // Blue stars
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1.0;
      } else if (shade > 0.88) {
        // Gold stars
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.6;
      } else {
        // White stars
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Nebula tint
    const nebulaGeo = new THREE.SphereGeometry(30, 32, 32);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x1a0a4a,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(nebulaGeo, nebulaMat));

    // Mouse parallax
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      stars.rotation.y = t * 0.01 + mouseRef.current.x * 0.05;
      stars.rotation.x = t * 0.005 + mouseRef.current.y * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #050816 70%)' }}
    >
      {/* Three.js canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Nebula overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(108,99,255,0.08) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 40% at 80% 30%, rgba(30,42,74,0.18) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="font-space text-sm font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: '#6C63FF' }}
        >
          ✦ Live Astronomical Experience
        </p>

        <h1
          className="font-space font-bold leading-tight mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            color: '#E8EAF0',
            textShadow: '0 0 80px rgba(108,99,255,0.3)',
          }}
        >
          The universe is alive.
          <br />
          <span style={{ color: '#6C63FF' }}>Explore it.</span>
        </h1>

        <p
          className="font-body text-lg md:text-xl max-w-2xl mx-auto mb-12"
          style={{ color: 'rgba(232,234,240,0.65)', lineHeight: '1.7' }}
        >
          Real-time 3D solar system, black hole simulations, astrophysics labs,
          and AI-powered cosmic exploration — all in one living, breathing experience.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#solar-system"
            className="px-8 py-3.5 rounded-full font-space font-medium text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: '#6C63FF',
              color: '#fff',
              boxShadow: '0 0 30px rgba(108,99,255,0.4)',
            }}
          >
            Begin Exploration
          </a>
          <a
            href="#theories"
            className="px-8 py-3.5 rounded-full font-space font-medium text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.3)',
              color: '#E8EAF0',
            }}
          >
            Theory Lab
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(232,234,240,0.35)' }}>
          Scroll
        </span>
        <div
          className="w-px h-12 animate-pulse"
          style={{ background: 'linear-gradient(to bottom, transparent, #6C63FF, transparent)' }}
        />
      </div>
    </section>
  );
}
