"use client";

import React, { useEffect, useRef } from "react";

type WeatherType = "rain" | "drought" | "heatwave" | "normal" | "defense";

interface WeatherParticlesProps {
  weatherType: WeatherType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function WeatherParticles({ weatherType }: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const createParticle = (initBottom = false): Particle => {
      let size = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.5 + 0.2;
      
      let x = Math.random() * width;
      let y = initBottom ? Math.random() * height : 0;
      let vx = 0;
      let vy = 0;
      let color = "rgba(0, 216, 246, 0.4)"; // Electric cyan

      if (weatherType === "rain" || weatherType === "defense") {
        vx = (Math.random() - 0.5) * 1 - 1; // angled rain
        vy = Math.random() * 8 + 6; // fast fall
        size = Math.random() * 1.5 + 0.8;
        color = `rgba(0, 216, 246, ${alpha})`;
      } else if (weatherType === "drought") {
        vx = (Math.random() - 0.5) * 0.5;
        vy = -(Math.random() * 1.5 + 0.5); // slow rising
        y = initBottom ? y : height;
        size = Math.random() * 3 + 1;
        color = `rgba(249, 115, 22, ${alpha * 0.7})`; // Amber/orange
      } else if (weatherType === "heatwave") {
        vx = (Math.random() - 0.5) * 1.5;
        vy = -(Math.random() * 2.5 + 1); // faster heat waves
        y = initBottom ? y : height;
        size = Math.random() * 4 + 1.5;
        color = `rgba(239, 68, 68, ${alpha * 0.8})`; // Red/crimson
      } else {
        // normal - cyber dust
        vx = (Math.random() - 0.5) * 0.3;
        vy = (Math.random() - 0.5) * 0.3;
        y = Math.random() * height;
        size = Math.random() * 2 + 0.5;
        color = `rgba(0, 242, 254, ${alpha * 0.5})`;
      }

      return { x, y, vx, vy, size, alpha, color };
    };

    // Pre-populate particles
    const maxParticles = weatherType === "defense" ? 180 : weatherType === "rain" ? 120 : 60;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    // Radar scan sweep coordinate
    let radarSweepAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render radar sonar sweep for Defense Mode and general dashboard
      if (weatherType === "defense" || weatherType === "normal") {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.45;

        // Draw outer ring
        ctx.strokeStyle = weatherType === "defense" 
          ? "rgba(239, 68, 68, 0.15)" 
          : "rgba(0, 216, 246, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = weatherType === "defense" 
          ? "rgba(239, 68, 68, 0.05)" 
          : "rgba(0, 216, 246, 0.03)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.66, 0, Math.PI * 2);
        ctx.arc(centerX, centerY, radius * 0.33, 0, Math.PI * 2);
        ctx.stroke();

        // Sonar sweep line
        radarSweepAngle += weatherType === "defense" ? 0.015 : 0.006;
        const endX = centerX + radius * Math.cos(radarSweepAngle);
        const endY = centerY + radius * Math.sin(radarSweepAngle);

        // Gradient sweep
        const sweepGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
        sweepGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        sweepGrad.addColorStop(1, weatherType === "defense" ? "rgba(239, 68, 68, 0.03)" : "rgba(0, 216, 246, 0.02)");

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, radarSweepAngle - 0.5, radarSweepAngle);
        ctx.closePath();
        ctx.fill();

        // Line
        ctx.strokeStyle = weatherType === "defense" 
          ? "rgba(239, 68, 68, 0.4)" 
          : "rgba(0, 242, 254, 0.2)";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render and update particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Reset particles that go off-screen
        if (weatherType === "rain" || weatherType === "defense") {
          if (p.y > height || p.x < 0 || p.x > width) {
            particles[index] = createParticle(false);
          }
        } else if (weatherType === "drought" || weatherType === "heatwave") {
          if (p.y < 0 || p.x < 0 || p.x > width) {
            particles[index] = createParticle(false);
          }
        } else {
          // normal drift wrapping
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (weatherType === "rain" || weatherType === "defense") {
          // Draw lines for rain
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.5, p.y + p.vy * 1.5);
          ctx.stroke();
        } else {
          // Draw glowing circles
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Grid scanline effect
      if (weatherType === "defense") {
        ctx.fillStyle = "rgba(239, 68, 68, 0.015)";
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
