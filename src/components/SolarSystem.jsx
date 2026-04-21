import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PLANETS = [
  {
    name: 'Mercury', radius: 0.18, distance: 4, speed: 0.04, color: 0x9E9E9E,
    facts: 'Closest planet to the Sun. A year lasts just 88 Earth days. Surface temperatures swing from -180°C to 430°C.',
    diameter: '4,879 km', moons: 0, type: 'Terrestrial',
  },
  {
    name: 'Venus', radius: 0.30, distance: 6.5, speed: 0.016, color: 0xE8C67A,
    facts: 'Hottest planet at 465°C average — hotter than Mercury. A thick CO₂ atmosphere creates a runaway greenhouse effect.',
    diameter: '12,104 km', moons: 0, type: 'Terrestrial',
  },
  {
    name: 'Earth', radius: 0.32, distance: 9, speed: 0.01, color: 0x4A90D9,
    facts: 'Our home. The only known world harboring life. 71% of its surface is liquid water.',
    diameter: '12,742 km', moons: 1, type: 'Terrestrial',
  },
  {
    name: 'Mars', radius: 0.22, distance: 12, speed: 0.008, color: 0xC1440E,
    facts: 'Home to Olympus Mons — the tallest volcano in the solar system at 21.9 km. Has two small moons: Phobos and Deimos.',
    diameter: '6,779 km', moons: 2, type: 'Terrestrial',
  },
  {
    name: 'Jupiter', radius: 0.80, distance: 17, speed: 0.004, color: 0xC88B3A,
    facts: 'Largest planet — 1,300 Earths fit inside. The Great Red Spot is a storm larger than Earth that has raged for centuries.',
    diameter: '139,820 km', moons: 95, type: 'Gas Giant',
  },
  {
    name: 'Saturn', radius: 0.68, distance: 23, speed: 0.003, color: 0xE8D5A3,
    facts: 'Its iconic rings are made of ice and rock. So light it could float on water. Has 146 known moons.',
    diameter: '116,460 km', moons: 146, type: 'Gas Giant',
  },
  {
    name: 'Uranus', radius: 0.50, distance: 29, speed: 0.002, color: 0x7DE8E8,
    facts: 'Rotates on its side with a 98° axial tilt. Its blue-green color comes from methane gas in its atmosphere.',
    diameter: '50,724 km', moons: 27, type: 'Ice Giant',
  },
  {
    name: 'Neptune', radius: 0.46, distance: 35, speed: 0.0015, color: 0x3F54BA,
    facts: 'Windiest planet — speeds up to 2,100 km/h. Its largest moon Triton orbits in the opposite direction to Neptune\'s spin.',
    diameter: '49,244 km', moons: 16, type: 'Ice Giant',
  },
];

export default function SolarSystem() {
  const canvasRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const planetMeshesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 500);
    camera.position.set(0, 22, 50);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0x111133, 1.5));
    scene.add(new THREE.PointLight(0xFFF4E0, 3, 200));

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFDB813 })
    );
    scene.add(sun);
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.7, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFA500, transparent: true, opacity: 0.1 })
    ));

    // Background stars
    const starPos = new Float32Array(4000 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 400;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })));

    // Planets
    const planetMeshes = PLANETS.map((p) => {
      // Orbit ring
      scene.add(new THREE.Mesh(
        new THREE.TorusGeometry(p.distance, 0.02, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.3 })
      ));

      // Planet sphere
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.radius, 32, 32),
        new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.8, metalness: 0.1 })
      );
      mesh.userData = { planet: p, angle: Math.random() * Math.PI * 2 };
      scene.add(mesh);

      // Saturn rings
      if (p.name === 'Saturn') {
        const ringMesh = new THREE.Mesh(
          new THREE.TorusGeometry(p.radius + 0.6, 0.25, 4, 64),
          new THREE.MeshBasicMaterial({ color: 0xD4C5A9, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
        );
        ringMesh.rotation.x = Math.PI / 3;
        mesh.add(ringMesh);
      }

      return mesh;
    });

    planetMeshesRef.current = planetMeshes;

    // Raycaster for click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) setSelectedPlanet(hits[0].object.userData.planet);
    };
    canvas.addEventListener('click', handleClick);

    // Camera orbit controls
    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let sph = { theta: 0, phi: Math.PI / 4, r: 55 };

    const onDown = (e) => { isDragging = true; prev = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { isDragging = false; };
    const onMove = (e) => {
      if (!isDragging) return;
      sph.theta -= (e.clientX - prev.x) * 0.005;
      sph.phi = Math.max(0.1, Math.min(Math.PI / 2.2, sph.phi - (e.clientY - prev.y) * 0.005));
      prev = { x: e.clientX, y: e.clientY };
    };
    const onWheel = (e) => { sph.r = Math.max(15, Math.min(120, sph.r + e.deltaY * 0.05)); };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('wheel', onWheel, { passive: true });

    // Animation
    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x = sph.r * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.position.y = sph.r * Math.cos(sph.phi);
      camera.position.z = sph.r * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.lookAt(0, 0, 0);

      planetMeshes.forEach((mesh) => {
        const { planet } = mesh.userData;
        const angle = t * planet.speed;
        mesh.position.x = Math.cos(mesh.userData.angle + angle) * planet.distance;
        mesh.position.z = Math.sin(mesh.userData.angle + angle) * planet.distance;
        mesh.rotation.y += 0.005;
      });

      sun.material.color.setHSL(0.1, 0.9, 0.55 + Math.sin(t * 2) * 0.02);
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
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section id="solar-system" className="min-h-screen relative overflow-hidden" style={{ background: '#050816' }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-24 px-6 text-center pointer-events-none">
        <p className="font-space text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#6C63FF' }}>
          ✦ Interactive 3D Visualization
        </p>
        <h2 className="font-space font-bold text-4xl md:text-5xl mb-3" style={{ color: '#E8EAF0' }}>
          Solar System
        </h2>
        <p className="font-body text-sm" style={{ color: 'rgba(232,234,240,0.45)' }}>
          Drag to orbit · Scroll to zoom · Click a planet to explore
        </p>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-screen" />

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div
          className="absolute top-1/2 right-6 -translate-y-1/2 z-20 w-72 p-6 rounded-2xl"
          style={{
            background: 'rgba(5, 8, 22, 0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(108, 99, 255, 0.22)',
          }}
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>

          <div
            className="w-12 h-12 rounded-full mb-4"
            style={{ background: `#${selectedPlanet.color.toString(16).padStart(6, '0')}` }}
          />

          <h3 className="font-space font-bold text-xl mb-1" style={{ color: '#E8EAF0' }}>
            {selectedPlanet.name}
          </h3>
          <p className="font-body text-xs mb-4" style={{ color: '#6C63FF' }}>
            {selectedPlanet.type}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(108,99,255,0.08)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'rgba(232,234,240,0.4)' }}>Diameter</p>
              <p className="text-sm font-medium font-space" style={{ color: '#E8EAF0' }}>{selectedPlanet.diameter}</p>
            </div>
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(108,99,255,0.08)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'rgba(232,234,240,0.4)' }}>Moons</p>
              <p className="text-sm font-medium font-space" style={{ color: '#E8EAF0' }}>{selectedPlanet.moons}</p>
            </div>
          </div>

          <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,234,240,0.7)' }}>
            {selectedPlanet.facts}
          </p>
        </div>
      )}
    </section>
  );
}
