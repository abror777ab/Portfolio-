import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticWrapperProps {
  children: React.ReactElement;
  className?: string;
  range?: number;
}

export default function MagneticWrapper({ children, className = '', range = 35 }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Find centers
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Find distance from centers
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Pull factor
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < range * 2.5) {
      setPosition({ x: dx * 0.35, y: dy * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 15, mass: 0.6 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
