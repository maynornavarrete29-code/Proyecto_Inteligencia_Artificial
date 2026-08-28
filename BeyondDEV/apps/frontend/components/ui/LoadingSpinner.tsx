'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
  fullScreen?: boolean;
  className?: string;
  colorClass?: string;
}

export default function LoadingSpinner({
  size = 48,
  label,
  fullScreen = false,
  className = '',
  colorClass = 'text-[#efc704]',
}: LoadingSpinnerProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center shrink-0"
      >
        <svg
          className={`w-full h-full ${colorClass} drop-shadow-[0_0_8px_rgba(239,199,4,0.35)]`}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pista de fondo */}
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="5"
          />
          {/* Arco activo */}
          <path
            d="M45 25a20 20 0 00-6-14"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {label && (
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase animate-pulse">
          {label}
        </p>
      )}

      <span className="sr-only">{label || 'Cargando...'}</span>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050811]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}