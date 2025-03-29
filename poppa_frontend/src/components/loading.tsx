import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-[#8B4513]/20 border-t-[#8B4513] rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <p className="text-[#8B4513]/80 text-lg">Loading...</p>
      </div>
    </div>
  );
}
