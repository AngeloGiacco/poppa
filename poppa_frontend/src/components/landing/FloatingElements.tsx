"use client";

import { motion } from "framer-motion";

export function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Artistic sound wave - positioned in lower right */}
      <div className="absolute bottom-[10%] right-[5%] hidden opacity-40 lg:block xl:right-[8%]">
        <svg
          width="280"
          height="120"
          viewBox="0 0 280 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-warm-400"
        >
          {[...Array(14)].map((_, i) => {
            const heights = [20, 35, 55, 75, 45, 65, 40, 80, 50, 35, 60, 30, 45, 25];
            const height = heights[i];
            const y = 60 - height / 2;
            return (
              <motion.rect
                key={i}
                x={i * 20}
                y={y}
                width="8"
                height={height}
                rx="4"
                fill="currentColor"
                initial={{ scaleY: 0.3, opacity: 0.3 }}
                animate={{
                  scaleY: [0.3, 1, 0.3],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                style={{ transformOrigin: `${i * 20 + 4}px 60px` }}
              />
            );
          })}
        </svg>
      </div>

      {/* Subtle accent dots - scattered minimally */}
      <motion.div
        className="absolute left-[8%] top-[20%] hidden h-3 w-3 rounded-full bg-terracotta-300/40 lg:block"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[12%] hidden h-2 w-2 rounded-full bg-warm-400/30 xl:block"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute right-[25%] top-[15%] hidden h-2 w-2 rounded-full bg-cream-400/40 xl:block"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  );
}
