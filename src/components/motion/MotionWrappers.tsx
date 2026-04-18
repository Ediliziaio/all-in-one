import { motion, useInView, useTransform, useScroll, animate } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

// Page transition wrapper
export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade-up on scroll (whileInView)
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const directionMap = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
  };
  const d = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: d.x, y: d.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered container + child
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover card effect
export function HoverCard({
  children,
  className,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale, y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated count-up for numeric KPIs.
// Supports two modes:
//   1) numeric: <CountUp to={98} suffix="%" />
//   2) string passthrough (legacy): <CountUp value="4.9★" /> — animated pop-in only.
type CountUpProps = {
  className?: string;
  // numeric mode
  to?: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  // legacy string mode
  value?: string;
};

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  value,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (typeof to !== "number" || !inView) return;
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  // Legacy string mode: just a spring pop-in.
  if (value !== undefined) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={className}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Ken Burns slow zoom on image
export function KenBurns({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ scale: 1 }}
      animate={{ scale: 1.08 }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
  );
}

// Parallax on scroll
export function Parallax({
  children,
  offset = 40,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Animated gradient mesh background blobs
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// SVG wave divider between sections
export function WaveDivider({
  fill = "hsl(var(--background))",
  flip = false,
  className,
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full leading-[0] ${flip ? "rotate-180" : ""} ${className ?? ""}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-12 md:h-20">
        <path
          d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// SVG zigzag (triangoli) divider — sharp peaks for rhythmic accent
export function ZigzagDivider({
  fill = "hsl(var(--background))",
  flip = false,
  className,
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full leading-[0] ${flip ? "rotate-180" : ""} ${className ?? ""}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-12 md:h-20">
        <path
          d="M0,40 L120,8 L240,40 L360,8 L480,40 L600,8 L720,40 L840,8 L960,40 L1080,8 L1200,40 L1320,8 L1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// SVG diagonal divider — clean angled cut
export function DiagonalDivider({
  fill = "hsl(var(--background))",
  flip = false,
  direction = "left",
  className,
}: {
  fill?: string;
  flip?: boolean;
  direction?: "left" | "right";
  className?: string;
}) {
  const d =
    direction === "left"
      ? "M0,80 L1440,0 L1440,80 Z"
      : "M0,0 L1440,80 L0,80 Z";
  return (
    <div className={`relative w-full leading-[0] ${flip ? "rotate-180" : ""} ${className ?? ""}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-12 md:h-20">
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}
