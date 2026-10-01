/** Shared easing and timing so every section animates on the same curves. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_OUT = [0.1, 0.75, 0.25, 1] as const;

/** Section content sliding up as it scrolls into view. */
export const revealUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: EASE_OUT },
} as const;

/** Raised neumorphic controls lift on hover and press back down on tap. */
export const press = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.97 },
  transition: { duration: 0.2, ease: EASE_IN_OUT },
} as const;
