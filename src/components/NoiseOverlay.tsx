import React from 'react';

export default function NoiseOverlay() {
  return (
    <div 
      id="noise-overlay"
      className="noise-bg pointer-events-none fixed inset-0 z-50 select-none mix-blend-screen opacity-[0.3]" 
    />
  );
}
