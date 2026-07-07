/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface CoreXLogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
}

export default function CoreXLogo({ size = 180, animated = true, showText = true }: CoreXLogoProps) {
  // SVG drawing representing the beautiful neon "X" logo of CORE
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect backdrops */}
        <div className="absolute inset-0 bg-[#ffcdb2]/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute inset-0 bg-[#2b4c7e]/15 rounded-full blur-3xl" />

        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            {/* Peach / Skin Tone Gradient */}
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffcdb2" />
              <stop offset="100%" stopColor="#4d2d1b" />
            </linearGradient>

            {/* Navy Blue Gradient */}
            <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2b4c7e" />
              <stop offset="100%" stopColor="#0c1b33" />
            </linearGradient>

            {/* Plomo (Lead/Slate) Gradient */}
            <linearGradient id="plomoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#718096" />
              <stop offset="100%" stopColor="#1f293d" />
            </linearGradient>

            {/* Filter for neon glow */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* BACKGROUND STRUCTURE */}
          {/* We'll draw 4 sets of concentric chevron paths facing inward to form the "X" logo */}
          <g filter="url(#neonGlow)" strokeWidth="3" fill="none" strokeLinecap="round">
            {/* Top Chevron Set (facing down) */}
            <path d="M 40 40 L 100 100 L 160 40" stroke="url(#skinGrad)" opacity="0.4" />
            <path d="M 50 30 L 100 80 L 150 30" stroke="url(#skinGrad)" opacity="0.6" />
            <path d="M 60 20 L 100 60 L 140 20" stroke="url(#skinGrad)" strokeWidth="4" />
            <path d="M 70 10 L 100 40 L 130 10" stroke="#ffcdb2" strokeWidth="5.5" />

            {/* Bottom Chevron Set (facing up) */}
            <path d="M 40 160 L 100 100 L 160 160" stroke="url(#skinGrad)" opacity="0.4" />
            <path d="M 50 170 L 100 120 L 150 170" stroke="url(#skinGrad)" opacity="0.6" />
            <path d="M 60 180 L 100 140 L 140 180" stroke="url(#skinGrad)" strokeWidth="4" />
            <path d="M 70 190 L 100 160 L 130 190" stroke="#ffcdb2" strokeWidth="5.5" />

            {/* Left Chevron Set (facing right) */}
            <path d="M 40 40 L 100 100 L 40 160" stroke="url(#navyGrad)" opacity="0.4" />
            <path d="M 30 50 L 80 100 L 30 150" stroke="url(#navyGrad)" opacity="0.6" />
            <path d="M 20 60 L 60 100 L 20 140" stroke="url(#navyGrad)" strokeWidth="4" />
            <path d="M 10 70 L 40 100 L 10 130" stroke="#2b4c7e" strokeWidth="5.5" />

            {/* Right Chevron Set (facing left) */}
            <path d="M 160 40 L 100 100 L 160 160" stroke="url(#navyGrad)" opacity="0.4" />
            <path d="M 170 50 L 120 100 L 170 150" stroke="url(#navyGrad)" opacity="0.6" />
            <path d="M 180 60 L 140 100 L 180 140" stroke="url(#navyGrad)" strokeWidth="4" />
            <path d="M 190 70 L 160 100 L 190 130" stroke="#2b4c7e" strokeWidth="5.5" />

            {/* CORE GLOWING CENTER */}
            {/* The central "crossroads" / core */}
            <motion.path
              d="M 90 90 L 100 80 L 110 90 L 120 100 L 110 110 L 100 120 L 90 110 L 80 100 Z"
              stroke="url(#plomoGrad)"
              strokeWidth="5"
              fill="rgba(113, 128, 150, 0.2)"
              animate={animated ? {
                scale: [0.95, 1.1, 0.95],
                opacity: [0.8, 1, 0.8],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Center spark */}
            <circle cx="100" cy="100" r="5" fill="#ffdeac" />
          </g>
        </svg>
      </div>

      {showText && (
        <motion.div
          className="mt-5 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="font-display text-5xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#e2e8f0] to-[#94a3b8] drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] pl-[0.25em] select-none">
            CORE
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-[#94a3b8]/80 mt-2 pl-[0.5em] font-medium">
            ATHLETIC CIRCUIT
          </span>
        </motion.div>
      )}
    </div>
  );
}
