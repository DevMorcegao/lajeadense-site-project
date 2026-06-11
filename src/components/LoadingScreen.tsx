"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0D0D0D" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Isometric grid background texture */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="iso-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 30 L30 0 L60 30 M0 30 L30 60 L60 30"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.04"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#iso-grid)"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        />
      </svg>

      {/* Glass shard fragments — decorative polygons */}
      <AnimatePresence>
        {phase >= 1 && phase < 4 && (
          <>
            {[
              { points: "0,0 80,20 60,80 10,60", x: -180, y: -120, rotate: 15, delay: 0 },
              { points: "0,10 50,0 70,50 20,70", x: 140, y: -80, rotate: -25, delay: 0.1 },
              { points: "10,0 60,10 50,60 0,50", x: -120, y: 100, rotate: 35, delay: 0.2 },
              { points: "0,0 40,5 55,45 5,40", x: 160, y: 110, rotate: -15, delay: 0.15 },
              { points: "5,0 50,15 40,55 0,45", x: -60, y: -160, rotate: 45, delay: 0.25 },
              { points: "0,5 45,0 50,40 10,50", x: 80, y: 150, rotate: -40, delay: 0.3 },
            ].map((shard, i) => (
              <motion.svg
                key={i}
                className="absolute"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                style={{
                  left: `calc(50% + ${shard.x}px)`,
                  top: `calc(50% + ${shard.y}px)`,
                }}
                initial={{ opacity: 0, scale: 0.3, rotate: shard.rotate }}
                animate={{
                  opacity: [0, 0.15, 0.1],
                  scale: [0.3, 1, 0.95],
                  rotate: shard.rotate + 5,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.5,
                  transition: { duration: 0.4 },
                }}
                transition={{
                  duration: 1.2,
                  delay: shard.delay,
                  ease: "easeOut",
                }}
              >
                <polygon
                  points={shard.points}
                  fill="none"
                  stroke="#C8102E"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <polygon
                  points={shard.points}
                  fill="#C8102E"
                  opacity="0.03"
                />
              </motion.svg>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Logo with glass-reveal clip-path */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase >= 2 ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            phase >= 2
              ? { scale: 1, opacity: 1 }
              : { scale: 0.8, opacity: 0 }
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/home/lajeadense-logo.webp"
            alt="Lajeadense Vidros"
            width={280}
            height={80}
            priority
            className="w-[200px] md:w-[280px] h-auto"
          />
        </motion.div>

        {/* Crimson accent line */}
        <motion.div
          className="h-[2px] rounded-full"
          style={{ backgroundColor: "#C8102E" }}
          initial={{ width: 0, opacity: 0 }}
          animate={
            phase >= 3
              ? { width: 120, opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Loading text */}
        <motion.p
          className="text-sm tracking-[0.2em] uppercase"
          style={{
            color: "#9B9B9B",
            fontFamily: "var(--font-body)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={
            phase >= 3
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 8 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transparência que transforma
        </motion.p>
      </motion.div>

      {/* Progress bar at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{ backgroundColor: "#C8102E" }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "linear" }}
      />
    </motion.div>
  );
}
