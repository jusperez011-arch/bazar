import React, { useRef, useEffect } from 'react';

export default function Antigravity({
  count = 120,
  magnetRadius = 12,
  particleSize = 2,
  color = "#D4AF37",
  className = ""
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * particleSize + 1
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const render = () => {
  // 1. En lugar de borrar todo, pintamos un rectángulo muy transparente
  // Esto genera el efecto de rastro. 
  // 0.1 = Estela corta | 0.02 = Estela muy larga y suave
  ctx.fillStyle = 'rgba(253, 253, 253, 0.05)'; // El color del fondo blanco (#FDFDFD)
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Ahora dibujamos las partículas (el color mostaza)
  ctx.fillStyle = color;

  particles.current.forEach(p => {
    const dx = mouse.current.x - p.x;
    const dy = mouse.current.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Lógica de ATRECCIÓN (la que pusimos antes)
    if (dist < magnetRadius) {
      const force = (magnetRadius - dist) / magnetRadius;
      const angle = Math.atan2(dy, dx);
      p.vx += Math.cos(angle) * force * 0.8; // Un poco más de fuerza para que la estela luzca
      p.vy += Math.sin(angle) * force * 0.8;
    }

    p.vx *= 0.94;
    p.vy *= 0.94;
    p.x += p.vx;
    p.y += p.vy;

    // Dibujar la partícula
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    // ... lógica de bordes ...
  });

  requestAnimationFrame(render);
};

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [color, count, particleSize, magnetRadius]);

  return <canvas ref={canvasRef} className={`fixed inset-0 ${className}`} />;
}