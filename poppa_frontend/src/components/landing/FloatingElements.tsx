"use client";

import { motion } from "framer-motion";

export function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Speech bubble / conversation icon - top right */}
      <motion.div
        className="absolute right-[15%] top-[20%] hidden lg:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-olive-400/60"
        >
          <path
            d="M40 10C23.432 10 10 21.193 10 35C10 42.5 14.5 49.25 21.5 53.5L18 70L34 58.5C36 59 38 59.25 40 59.25C56.568 59.25 70 48.057 70 34.25C70 21.193 56.568 10 40 10Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="35" r="3" fill="currentColor" />
          <circle cx="40" cy="35" r="3" fill="currentColor" />
          <circle cx="52" cy="35" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Sound wave / audio visualization - right side */}
      <motion.div
        className="absolute right-[8%] top-[40%] hidden lg:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <svg
          width="100"
          height="60"
          viewBox="0 0 100 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-warm-400/50"
        >
          <rect x="5" y="20" width="6" height="20" rx="3" fill="currentColor" />
          <rect x="18" y="10" width="6" height="40" rx="3" fill="currentColor" />
          <rect x="31" y="5" width="6" height="50" rx="3" fill="currentColor" />
          <rect x="44" y="15" width="6" height="30" rx="3" fill="currentColor" />
          <rect x="57" y="8" width="6" height="44" rx="3" fill="currentColor" />
          <rect x="70" y="18" width="6" height="24" rx="3" fill="currentColor" />
          <rect x="83" y="22" width="6" height="16" rx="3" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Globe / world icon - bottom right */}
      <motion.div
        className="absolute bottom-[20%] right-[20%] hidden lg:block"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-olive-300/50"
        >
          <circle cx="45" cy="45" r="35" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="45" cy="45" rx="15" ry="35" stroke="currentColor" strokeWidth="2" />
          <path d="M10 45H80" stroke="currentColor" strokeWidth="2" />
          <path d="M15 28H75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 62H75" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Microphone icon - top center-right */}
      <motion.div
        className="absolute right-[35%] top-[15%] hidden xl:block"
        animate={{
          y: [0, -18, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <svg
          width="50"
          height="70"
          viewBox="0 0 50 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-warm-500/40"
        >
          <rect x="15" y="5" width="20" height="35" rx="10" stroke="currentColor" strokeWidth="3" />
          <path
            d="M8 35C8 45 15.5 53 25 53C34.5 53 42 45 42 35"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M25 53V65" stroke="currentColor" strokeWidth="3" />
          <path d="M15 65H35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Book / learning icon - left side */}
      <motion.div
        className="absolute bottom-[35%] left-[5%] hidden xl:block"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <svg
          width="70"
          height="60"
          viewBox="0 0 70 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-olive-300/40"
        >
          <path
            d="M35 15C35 15 25 8 10 10V50C25 48 35 55 35 55C35 55 45 48 60 50V10C45 8 35 15 35 15Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M35 15V55" stroke="currentColor" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Sparkle / star elements - scattered */}
      <motion.div
        className="absolute left-[10%] top-[25%] hidden md:block"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-warm-400"
        >
          <path
            d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] right-[40%] hidden md:block"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-olive-400"
        >
          <path
            d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[12%] top-[60%] hidden lg:block"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.7,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-warm-500"
        >
          <path
            d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  );
}
