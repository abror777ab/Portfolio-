import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'magnetic' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end luxury motion
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Listen to hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverable = target.closest('[data-cursor]');
      if (hoverable) {
        const type = hoverable.getAttribute('data-cursor') as any;
        setCursorType(type || 'hover');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
    },
    hover: {
      width: 56,
      height: 56,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    },
    magnetic: {
      width: 72,
      height: 72,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 1)',
      boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
    },
    drag: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px dashed rgba(255, 255, 255, 0.6)',
    },
  };

  return (
    <>
      {/* Outer Spring Follower */}
      <motion.div
        id="custom-cursor-outer"
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full hidden md:block mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={cursorType}
        variants={cursorVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      {/* Inner Pinpoint (instant response) */}
      <div
        id="custom-cursor-inner"
        className="pointer-events-none fixed z-50 w-2 h-2 bg-white rounded-full hidden md:block mix-blend-difference"
        style={{
          left: `${mouseX.get() + 12}px`,
          top: `${mouseY.get() + 12}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease',
        }}
      />
    </>
  );
}
