"use client"

import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
      aria-hidden
    >
      <svg
        className="text-zinc-200"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="25" cy="25" r="20" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
        <path
          d="M45 25a20 20 0 00-6-14"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}
