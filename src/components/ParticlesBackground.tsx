'use client';

import { useEffect } from 'react';

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
            number: { 
              value: 60,
              density: { 
                enable: true, 
                value_area: 800 
              } 
            },
            color: { 
              value: ['#00f0ff', '#ec4899', '#a855f7'] 
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 2,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.3,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 120, // Reduzi a distância
              color: '#00f0ff',
              opacity: 0.2, // Opacidade mais baixa
              width: 0.8 // Linha mais fina
            },
            move: {
              enable: true,
              speed: 1.2, // Velocidade reduzida
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'grab' // Modo mais sutil
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 0.5
                }
              }
            }
          },
          retina_detect: true
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at bottom, #0a0a0a 0%, #000000 100%)'
      }}
    />
  );
}