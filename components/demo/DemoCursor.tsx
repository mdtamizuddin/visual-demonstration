'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CursorPosition } from '@/engine/demo-types';

interface DemoCursorProps {
  cursor: CursorPosition;
}

export function DemoCursor({ cursor }: DemoCursorProps) {
  if (!cursor.visible) return null;

  return (
    <motion.div
      animate={{
        x: cursor.x,
        y: cursor.y,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 250,
        mass: 0.5,
      }}
      className="fixed pointer-events-none z-50 select-none"
      style={{ left: 0, top: 0 }}
    >
      <div className="relative">
        {/* Cursor SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transform origin-top-left transition-transform duration-100 ${
            cursor.clicking ? 'scale-90' : 'scale-100'
          }`}
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>

        {/* Click ripple pulse */}
        <AnimatePresence>
          {cursor.clicking && (
            <motion.span
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#38bdf8]/50 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Action tooltip banner */}
        {cursor.label && (
          <div className="absolute left-4 top-4 px-2 py-1 bg-black/85 backdrop-blur border border-[#38bdf8]/50 text-white text-[11px] font-mono rounded shadow-lg whitespace-nowrap flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
            <span>{cursor.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
