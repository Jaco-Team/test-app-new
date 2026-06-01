'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export type RevealProps = {
  children: ReactNode;
  show?: boolean;
  className?: string;
};

/**
 * Simple fade-in used after async content is ready (legacy filter/catalog timing).
 */
export function Reveal({ children, show = true, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
