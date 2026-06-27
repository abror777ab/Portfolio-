import React from 'react';
import { motion } from 'motion/react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'chars' | 'words';
}

export default function SplitText({ text, className = '', delay = 0, type = 'chars' }: SplitTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'chars' ? 0.03 : 0.08,
        delayChildren: delay,
      }
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: '50%',
      rotateX: -40,
      filter: 'blur(4px)',
    },
    visible: { 
      opacity: 1, 
      y: '0%',
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { 
        type: 'spring' as const,
        damping: 18,
        stiffness: 110,
      } 
    }
  };

  if (type === 'words') {
    const words = text.split(' ');
    return (
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={`inline-block ${className}`}
        style={{ perspective: 1000 }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={childVariants}
            className="inline-block mr-[0.25em] origin-bottom whitespace-nowrap"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Split into characters
  const chars = text.split('');
  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-block ${className}`}
      style={{ perspective: 1000 }}
    >
      {chars.map((char, idx) => (
        <motion.span
          key={idx}
          variants={childVariants}
          className={`inline-block origin-bottom ${char === ' ' ? 'mr-[0.25em]' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
