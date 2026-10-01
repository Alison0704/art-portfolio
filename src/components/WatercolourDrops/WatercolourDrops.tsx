import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "../../motion";
import styles from "./WatercolourDrops.module.css";

const HOLD_MS = 5000; // how long the cursor must stay still
const JITTER = 4; // px of movement still counted as "in place"
const MAX_DROPS = 12; // older washes fade out beyond this
const LIFETIME_MS = 30000; // each wash disappears after this

const FALL_S = 0.84; // droplet falling toward the paper
const SPLASH_S = 1.01; // ...and bursting on impact
const SPREAD_S = 4.92; // the wash pushing outward
const SETTLE_S = 11.2; // its slow darkening afterwards
const FADE_S = 4; // exit fade when a wash retires

type Drop = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  variant: string;
};

/** One drop: a falling bead, its shadow, and the wash it leaves behind. */
function Wash({ drop }: { drop: Drop }) {
  return (
    <motion.div
      className={`${styles.drop} ${drop.variant}`.trim()}
      style={{ left: drop.x, top: drop.y, "--s": `${drop.size}px` } as CSSProperties}
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_S }}
    >
      {/* The wash pushes out quickly as the drop lands, then keeps spreading
          at a steadily decreasing rate until it settles at full size. */}
      <motion.div
        className={styles.bloom}
        style={{ rotate: drop.rotate }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: [0, 0.55, 0.55, 0.45] }}
        transition={{
          scale: { duration: SPREAD_S, delay: FALL_S, ease: EASE_OUT },
          opacity: { duration: SETTLE_S, delay: FALL_S, times: [0, 0.02, 0.5, 1] },
        }}
      >
        <motion.span
          className={styles.sheen}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 4.6, delay: FALL_S, times: [0, 0.14, 1] }}
        />
      </motion.div>

      <motion.div
        className={styles.shadow}
        initial={{ x: 90, y: 70, scale: 5, opacity: 0, filter: "blur(12px)" }}
        animate={{
          x: [90, 0, 0],
          y: [70, 0, 0],
          scale: [5, 1.1, 1.6],
          opacity: [0, 0.5, 0],
          filter: ["blur(12px)", "blur(1px)", "blur(1px)"],
        }}
        transition={{ duration: 0.94, times: [0, 0.89, 1], ease: ["easeIn", "easeOut"] }}
      />

      <motion.div
        className={styles.fall}
        initial={{ z: 620, opacity: 0, filter: "blur(8px)" }}
        animate={{
          z: [620, 0, 0, 0],
          scale: [1, 1, 1.9, 2.6],
          opacity: [0, 1, 0.85, 0],
          filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)"],
        }}
        transition={{
          duration: SPLASH_S,
          times: [0, FALL_S / SPLASH_S, 0.92, 1],
          ease: ["easeIn", "easeOut", "easeOut"],
        }}
      />
    </motion.div>
  );
}

export default function WatercolourDrops() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const timers = new Set<number>();
    let armTimer: number | null = null;
    let anchor: { x: number; y: number } | null = null;
    let nextId = 0;

    const spawnDrop = (clientX: number, clientY: number) => {
      // Pointer coordinates are viewport-relative; the layer spans the whole
      // document, so offset them by its current position.
      const rect = layer.getBoundingClientRect();
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      // Variant 1 uses the base filter; 2 and 3 swap in a different seed.
      const variant = ["", styles.f2, styles.f3][Math.floor(Math.random() * 3)] ?? "";

      const drop: Drop = {
        id: nextId++,
        x: clientX - rect.left,
        y: clientY - rect.top,
        size: Math.min((45 + Math.random() * 25) * vmin, 520),
        rotate: Math.round(Math.random() * 360),
        variant,
      };

      setDrops((current) => [...current, drop].slice(-MAX_DROPS));

      const id = window.setTimeout(() => {
        timers.delete(id);
        setDrops((current) => current.filter((d) => d.id !== drop.id));
      }, LIFETIME_MS);
      timers.add(id);
    };

    const arm = (x: number, y: number) => {
      if (armTimer !== null) window.clearTimeout(armTimer);
      anchor = { x, y };
      armTimer = window.setTimeout(() => {
        if (anchor) spawnDrop(anchor.x, anchor.y);
      }, HOLD_MS);
      timers.add(armTimer);
    };

    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      // small tremors don't reset the timer (or re-arm after a drop)
      if (anchor && Math.hypot(x - anchor.x, y - anchor.y) <= JITTER) return;
      arm(x, y);
    };

    const cancel = () => {
      if (armTimer !== null) window.clearTimeout(armTimer);
      armTimer = null;
      anchor = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    document.addEventListener("pointerleave", cancel);
    window.addEventListener("blur", cancel);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", cancel);
      window.removeEventListener("blur", cancel);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <>
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <filter id="wc-drop-1" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" seed="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.3" result="gm" />
            <feComposite in="d" in2="gm" operator="in" result="gr" />
            <feGaussianBlur in="gr" stdDeviation="0.8" />
          </filter>
          <filter id="wc-drop-2" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="G" yChannelSelector="B" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.3" result="gm" />
            <feComposite in="d" in2="gm" operator="in" result="gr" />
            <feGaussianBlur in="gr" stdDeviation="0.8" />
          </filter>
          <filter id="wc-drop-3" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="23" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="55" xChannelSelector="B" yChannelSelector="R" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="17" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.3" result="gm" />
            <feComposite in="d" in2="gm" operator="in" result="gr" />
            <feGaussianBlur in="gr" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div ref={layerRef} className={styles.layer} aria-hidden="true">
        <AnimatePresence>
          {drops.map((drop) => (
            <Wash key={drop.id} drop={drop} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
