
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types';

// Fix for R3F elements not being recognized in JSX
// Augmenting both global and module 'react' to cover different TS/React versions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      color: any;
      fog: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      color: any;
      fog: any;
    }
  }
}

// Geometry Generation Functions
const getSpherePositions = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
};

// Double Helix (DNA) structure
const getHelixPositions = (count: number, radius: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Create two strands
        const isStrandA = i % 2 === 0;
        const t = i / count;
        const y = (t * 14) - 7; // Vertical spread
        const loops = 8 * Math.PI; 
        const theta = t * loops;
        const phase = isStrandA ? 0 : Math.PI;
        
        const x = radius * Math.cos(theta + phase);
        const z = radius * Math.sin(theta + phase);
        
        // Add random scatter for thickness/volume so it's not just a thin line
        positions[i*3] = x + (Math.random() - 0.5) * 0.4;
        positions[i*3+1] = y + (Math.random() - 0.5) * 0.4;
        positions[i*3+2] = z + (Math.random() - 0.5) * 0.4;
    }
    return positions;
};

const getGridPositions = (count: number, size: number) => {
    const positions = new Float32Array(count * 3);
    const side = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
        const r = Math.floor(i / side);
        const c = i % side;
        positions[i*3] = (c / side - 0.5) * size * 2;
        positions[i*3+1] = (Math.random() - 0.5) * 2; // Noise in Y
        positions[i*3+2] = (r / side - 0.5) * size * 2;
    }
    return positions;
};

// Complex Torus Knot (Trefoil) for Contact Section
const getTorusKnotPositions = (count: number, radius: number) => {
    const positions = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
        // Knot parameters
        const u = (i / count) * Math.PI * 2 * 15; // 15 full rotations along the tube
        const tubRadius = 0.8;
        const p = 2; // winding q
        const q = 3; // winding p
        
        // Parametric equations for a Torus Knot
        const r = (radius * 0.7) + tubRadius * Math.cos(q * u);
        const x = r * Math.cos(p * u);
        const y = r * Math.sin(p * u);
        const z = tubRadius * Math.sin(q * u);
        
        // Add scatter for volume
        positions[i*3] = x + (Math.random() - 0.5) * 0.5;
        positions[i*3+1] = y + (Math.random() - 0.5) * 0.5;
        positions[i*3+2] = z * 2 + (Math.random() - 0.5) * 0.5; // Stretch Z slightly
    }
    return positions;
}

interface ParticleSystemProps {
  theme: Theme;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ theme }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;
  
  // Pre-calculate shapes
  const spherePos = useMemo(() => getSpherePositions(count, 4.5), []);
  const helixPos = useMemo(() => getHelixPositions(count, 3.5), []);
  const gridPos = useMemo(() => getGridPositions(count, 12), []);
  const torusPos = useMemo(() => getTorusKnotPositions(count, 5), []); 
  
  // Current positions buffer
  const positions = useMemo(() => {
     const arr = new Float32Array(count * 3);
     arr.set(spherePos);
     return arr;
  }, []);

  // Use a global mouse listener to ensure we capture mouse movement even if pointer-events-none is on container
  const mouseRef = useRef({ x: 9999, y: 9999 }); // Default off-screen
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to Normalized Device Coordinates (-1 to 1)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    // Support Touch interaction
    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    const geometry = ref.current.geometry;
    if (!geometry || !geometry.attributes.position) return;

    // New Transition Logic based on exact Section Positions (viewport height units)
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Default setup
    let targetPos = spherePos;
    let targetScale = 1.0;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;

    if (isMobile) {
        // STRICT Mobile Transitions: Only change when previous section is fully out of view
        
        // 1. Hero (Sphere)
        // Hero is 100vh. We wait until scrollY passes 1.05 * winHeight to ensure it's out.
        if (scrollY < winHeight * 1.05) { 
            targetPos = spherePos;
            targetScale = 0.55; 
        } 
        // 2. About (Helix)
        // About section is tall on mobile (approx 1.5-2 screens).
        // Hero (1.0) + About (~1.8) = ~2.8. We switch only after we are deep into Projects or About is done.
        else if (scrollY < winHeight * 3.0) { 
            targetPos = helixPos;
            targetScale = 0.6;
        } 
        // 3. Projects (Grid)
        // Projects section is very tall.
        // Switch to Torus (Contact) only when approaching the "Passion Projects" (Labs) section.
        // Labs + Contact is roughly the bottom 2.5 screens of the document on mobile.
        else if (scrollY < docHeight - winHeight * 2.5) {
            targetPos = gridPos;
            targetScale = 0.8;
        } 
        // 4. Contact / Passion Projects (Torus)
        // Transition starts earlier to cover Labs section as requested
        else {
            targetPos = torusPos;
            targetScale = 0.7;
        }
    } else {
        // Adjust scale for tablet sizes
        if (isTablet) {
            targetScale = 0.8; // Reduced from 1.0
        }

        // Desktop Transitions (Smoother overlap allowed)
        if (scrollY < winHeight * 0.8) {
            targetPos = spherePos;
        } else if (scrollY < winHeight * 1.8) {
            targetPos = helixPos;
        } else if (scrollY < docHeight - winHeight * 1.5) {
            targetPos = gridPos;
        } else {
            targetPos = torusPos;
        }
    }

    // Morph Logic & Mouse Interaction
    const positionsAttribute = geometry.attributes.position;
    const array = positionsAttribute.array as Float32Array;
    const lerpSpeed = 2.0 * delta; 

    // Calculate interactive cursor position in 3D at Z=0 plane
    const mouseVector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0);
    mouseVector.unproject(state.camera);
    const dir = mouseVector.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z; 
    const cursorPos = state.camera.position.clone().add(dir.multiplyScalar(distance));
    
    const repulsionRadius = 2.5; 
    const repulsionForce = 15.0; 

    for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const targetX = targetPos[ix] * targetScale;
        const targetY = targetPos[iy] * targetScale;
        const targetZ = targetPos[iz] * targetScale;

        let currentX = array[ix];
        let currentY = array[iy];
        let currentZ = array[iz];

        // Move towards target
        currentX += (targetX - currentX) * lerpSpeed;
        currentY += (targetY - currentY) * lerpSpeed;
        currentZ += (targetZ - currentZ) * lerpSpeed;

        // Interactive Repulsion
        const dx = currentX - cursorPos.x;
        const dy = currentY - cursorPos.y;
        
        const distSq = dx*dx + dy*dy;

        if (distSq < repulsionRadius * repulsionRadius) {
             const dist = Math.sqrt(distSq);
             const forceFactor = (repulsionRadius - dist) / repulsionRadius; 
             
             // Apply force
             const force = forceFactor * forceFactor * repulsionForce * delta;
             
             const angle = Math.atan2(dy, dx);
             currentX += Math.cos(angle) * force;
             currentY += Math.sin(angle) * force;
        }

        array[ix] = currentX;
        array[iy] = currentY;
        array[iz] = currentZ;
    }

    positionsAttribute.needsUpdate = true;

    // Global Rotation
    // Calculate target rotation based on scroll and mouse tilt
    const baseRotX = scrollY * 0.0002;
    const baseRotY = scrollY * 0.0005;
    
    let mouseTiltX = 0;
    let mouseTiltY = 0;

    // Only apply mouse tilt if mouse is interacting (coordinates are valid)
    if (mouseRef.current.x < 10) {
        mouseTiltX = mouseRef.current.y * 0.05; // Mouse Y affects Rotation X
        mouseTiltY = mouseRef.current.x * 0.05; // Mouse X affects Rotation Y
    }

    const targetRotX = baseRotX + mouseTiltX;
    const targetRotY = baseRotY + mouseTiltY;

    // Smoothly dampen current rotation
    const damp = 3.0 * delta; 
    
    ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * damp;
    ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * damp;
  });

  const isDark = theme === 'dark';
  // Use muted slate color for dark mode to reduce glare, dark slate for light mode
  const particleColor = isDark ? "#94a3b8" : "#1e293b";

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={particleColor}
        size={0.045} 
        sizeAttenuation={true}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        // Muted opacity in light mode (0.2) compared to dark mode (0.4)
        opacity={isDark ? 0.4 : 0.2}
      />
    </points>
  );
};

const Scene3D: React.FC = () => {
  const { theme } = useTheme();
  // Adjust initial camera Z based on screen width for mobile responsiveness
  // Mobile needs a bit more distance to fit things, or we use the scale factor in the particles
  const [cameraZ, setCameraZ] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      setCameraZ(window.innerWidth < 768 ? 12 : 8);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ease-in-out">
      {/* Re-mount canvas on camera change to force update, or let R3F handle it if dynamic prop updates */}
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={[theme === 'dark' ? '#050505' : '#f8fafc']} />
        <fog attach="fog" args={[theme === 'dark' ? '#050505' : '#f8fafc', cameraZ, 25]} />
        <ParticleSystem theme={theme} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
