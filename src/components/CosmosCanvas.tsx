import React, { useEffect, useRef } from 'react';

interface CosmosCanvasProps {
  interactive?: boolean;
}

export const CosmosCanvas: React.FC<CosmosCanvasProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{
      x: number;
      y: number;
      z: number;
      r: number;
      t: number;
      color: string;
    }> = [];

    let width = 0;
    let height = 0;
    let targetPx = 0.5;
    let targetPy = 0.5;
    let currentPx = 0.5;
    let currentPy = 0.5;

    const starColors = [
      'rgba(220, 240, 255, ',
      'rgba(162, 215, 255, ',
      'rgba(255, 255, 255, ',
      'rgba(186, 230, 253, ',
    ];

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Star density roughly 1 per 4500 pixels squared
      const starCount = Math.max(50, Math.floor((width * height) / 4500));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.85 + 0.2,
        r: Math.random() * 1.3 + 0.25,
        t: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      }));
    };

    resize();

    // Use ResizeObserver for responsive resize handling
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      targetPx = e.clientX / Math.max(window.innerWidth, 1);
      targetPy = e.clientY / Math.max(window.innerHeight, 1);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let lastTime = 0;
    const draw = (time: number) => {
      const delta = Math.min(time - lastTime, 100);
      lastTime = time;

      // Smooth pointer interpolation
      currentPx += (targetPx - currentPx) * 0.05;
      currentPy += (targetPy - currentPy) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const offsetX = (currentPx - 0.5) * 18;
      const offsetY = (currentPy - 0.5) * 18;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += (0.04 * star.z * delta) / 16;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        const alpha = 0.2 + (Math.sin(time / 1400 + star.t) + 1) * 0.28;
        ctx.fillStyle = `${star.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(
          star.x + offsetX * star.z,
          star.y + offsetY * star.z,
          star.r * star.z,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      id="cosmos-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
