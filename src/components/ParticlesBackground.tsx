'use client';

import { useEffect } from 'react';

// Tipagem manual da função global particlesJS
declare global {
  interface Window {
    particlesJS: (tagId: string, params: Record<string, unknown>) => void;
  }
}

export function ParticlesBackground() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      if (typeof window.particlesJS === 'function') {
        window.particlesJS('particles-js', {
          particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: '#d4af37' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#d4af37',
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
            },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
            },
          },
        });
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="particles-js"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
}
