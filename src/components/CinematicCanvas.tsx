import React, { useEffect, useRef, useState } from 'react';

// Math helpers for custom 3D projection engine
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  opacity: number;
}

export default function CinematicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coordinates with cinematic spring lag
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / 200;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / 200;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Track scroll coordinates
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current.targetY = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll);

    // 1. Generate 3D Starfield Particles
    const particlesCount = 400;
    const particles: Particle3D[] = [];
    for (let i = 0; i < particlesCount; i++) {
      const rx = (Math.random() - 0.5) * 1600;
      const ry = (Math.random() - 0.5) * 1600;
      const rz = Math.random() * 2000;
      particles.push({
        x: rx,
        y: ry,
        z: rz,
        baseX: rx,
        baseY: ry,
        baseZ: rz,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    // 2. Generate 3D Sphere geometry (Vertices)
    const sphereVertices: Point3D[] = [];
    const sphereRadius = 140;
    const uCount = 12;
    const vCount = 12;
    for (let i = 0; i <= uCount; i++) {
      const theta = (i * Math.PI) / uCount;
      for (let j = 0; j < vCount; j++) {
        const phi = (j * 2 * Math.PI) / vCount;
        sphereVertices.push({
          x: sphereRadius * Math.sin(theta) * Math.cos(phi),
          y: sphereRadius * Math.sin(theta) * Math.sin(phi),
          z: sphereRadius * Math.cos(theta),
        });
      }
    }

    // 3. Generate 3D Torus geometry
    const torusVertices: Point3D[] = [];
    const torusR = 200; // Major radius
    const torusr = 40;  // Minor radius
    const torusSteps = 16;
    const ringSteps = 12;
    for (let i = 0; i < torusSteps; i++) {
      const theta = (i * 2 * Math.PI) / torusSteps;
      for (let j = 0; j < ringSteps; j++) {
        const phi = (j * 2 * Math.PI) / ringSteps;
        torusVertices.push({
          x: (torusR + torusr * Math.cos(phi)) * Math.cos(theta),
          y: (torusR + torusr * Math.cos(phi)) * Math.sin(theta),
          z: torusr * Math.sin(phi),
        });
      }
    }

    // Rotations variables
    let sphereRotationX = 0;
    let sphereRotationY = 0;
    let torusRotationX = 0;
    let torusRotationY = 0;

    // 3D Perspective Projection Utility
    const cameraZ = 1000;
    const fov = 600;

    const project = (point: Point3D, camX: number, camY: number, camZOffset: number) => {
      // Apply camera shift coordinates
      const x = point.x - camX;
      const y = point.y - camY;
      const z = point.z + camZOffset + cameraZ;

      if (z <= 0) return null;

      const scale = fov / z;
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        scale: scale,
      };
    };

    // Rotation Transformations
    const rotateX = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      };
    };

    const rotateY = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
      };
    };

    const rotateZ = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z,
      };
    };

    // Real-Time Render Engine loop
    const render = () => {
      // 1. Clear frame with high-end luxury dark fade (subtle motion trailing)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Apply Spring physics interpolation for mouse & scroll lag
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      scrollRef.current.y += (scrollRef.current.targetY - scrollRef.current.y) * 0.05;

      const camX = mouseRef.current.x * 200;
      const camY = mouseRef.current.y * 200;
      // Scroll moves the camera deeper "into" the particles field (up to 900px closer)
      const camZOffset = -scrollRef.current.y * 900;

      // 2. Render Starfield Particles
      particles.forEach((p) => {
        // Slow float drifting
        p.z -= 0.5;
        if (p.z < 0) {
          p.z = 2000;
        }

        const proj = project(p, camX, camY, camZOffset);
        if (proj) {
          // Dynamic depth scaling
          const particleSize = p.size * proj.scale * 1.5;
          const alpha = Math.min(p.opacity * proj.scale * 0.5, 0.6);

          ctx.beginPath();
          ctx.arc(proj.x, proj.y, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Mouse proximity reaction (subtle glow on cursor hover)
          const dx = proj.x - (width / 2 + mouseRef.current.x * 400);
          const dy = proj.y - (height / 2 + mouseRef.current.y * 400);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, particleSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.fill();
          }
        }
      });

      // Increment rotative frames for 3D elements
      sphereRotationX += 0.002;
      sphereRotationY += 0.003;
      torusRotationX -= 0.004;
      torusRotationY += 0.001;

      // ================= A. RENDER ROTATING GLASS SPHERE =================
      const projectedSphere: { x: number; y: number; scale: number }[] = [];
      sphereVertices.forEach((vertex) => {
        // Apply spinning rotations
        let rotated = rotateX(vertex, sphereRotationX);
        rotated = rotateY(rotated, sphereRotationY);
        
        // Shift left side of the screen on desktop, center on mobile
        const offset3D = width > 1024 ? -180 : 0;
        rotated.x += offset3D;

        const proj = project(rotated, camX, camY, camZOffset);
        if (proj) {
          projectedSphere.push(proj);
        }
      });

      // Draw glass connections with depth fades
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedSphere.length; i++) {
        const p1 = projectedSphere[i];
        
        // Connect to neighbors (Latitude connection)
        if (i % vCount !== vCount - 1) {
          const p2 = projectedSphere[i + 1];
          if (p2) {
            const opacity = Math.min(0.08 * p1.scale, 0.15);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to same column of next longitude
        const nextColIdx = i + vCount;
        if (nextColIdx < projectedSphere.length) {
          const p3 = projectedSphere[nextColIdx];
          if (p3) {
            const opacity = Math.min(0.06 * p1.scale, 0.12);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
          }
        }
      }

      // Draw a subtle inner glow inside the glass sphere
      if (projectedSphere.length > 0) {
        const sphereCenter3D = { x: width > 1024 ? -180 : 0, y: 0, z: 0 };
        const centerProj = project(sphereCenter3D, camX, camY, camZOffset);
        if (centerProj) {
          const rad = sphereRadius * centerProj.scale;
          const gradient = ctx.createRadialGradient(
            centerProj.x, centerProj.y, 0,
            centerProj.x, centerProj.y, rad
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.beginPath();
          ctx.arc(centerProj.x, centerProj.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // ================= B. RENDER POLISHED METALLIC TORUS =================
      const projectedTorus: { x: number; y: number; scale: number }[] = [];
      torusVertices.forEach((vertex) => {
        let rotated = rotateX(vertex, torusRotationX);
        rotated = rotateY(rotated, torusRotationY);
        rotated = rotateZ(rotated, torusRotationY * 0.5);

        // Position it slightly on the right on desktop, center-low on mobile
        const offsetX = width > 1024 ? 220 : 0;
        const offsetY = width > 1024 ? 80 : 250;
        rotated.x += offsetX;
        rotated.y += offsetY;

        const proj = project(rotated, camX, camY, camZOffset);
        if (proj) {
          projectedTorus.push(proj);
        }
      });

      // Render Torus facets / contours
      ctx.lineWidth = 0.45;
      for (let i = 0; i < projectedTorus.length; i++) {
        const p1 = projectedTorus[i];
        
        // Longitudinal rings connection
        const nextRingIdx = (i + 1) % ringSteps === 0 ? i - ringSteps + 1 : i + 1;
        const p2 = projectedTorus[nextRingIdx];
        if (p2) {
          const opacity = Math.min(0.07 * p1.scale, 0.14);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Transversal rings connection
        const nextColIdx = i + ringSteps;
        if (nextColIdx < projectedTorus.length) {
          const p3 = projectedTorus[nextColIdx];
          if (p3) {
            const opacity = Math.min(0.05 * p1.scale, 0.1);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none block"
      id="cinematic-3d-canvas"
    />
  );
}
