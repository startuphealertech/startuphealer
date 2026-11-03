"use client";

import { motion, useReducedMotion } from "framer-motion";

// Subtle hover lift/scale (stand-in for the reference site's tilt cards, using the existing framer-motion).
// Respects prefers-reduced-motion.
export default function HoverLift({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
