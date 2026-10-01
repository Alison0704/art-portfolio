import { motion } from "motion/react";
import { EASE_IN_OUT, EASE_OUT } from "../../motion";
import styles from "./Nav.module.css";

const links = [
  { label: "About", href: "#about" },
  { label: "Worlds & Events", href: "#worlds" },
  { label: "Characters", href: "#characters" },
];

/** Underline wipes in from the left on hover, out to the right on leave. */
const underline = {
  rest: { scaleX: 0, originX: 1 },
  hover: { scaleX: 1, originX: 0 },
};

export default function Nav() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <nav className={styles.nav} aria-label="Main">
        <p className={styles.logo}>SketchesByAnnaëlle</p>

        <ul className={styles.links}>
          {links.map(({ label, href }) => (
            <li key={href}>
              <motion.a
                href={href}
                className={styles.link}
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileFocus="hover"
                variants={{
                  rest: { color: "var(--ink)" },
                  hover: { color: "var(--green)" },
                }}
                transition={{ duration: 0.25, ease: EASE_IN_OUT }}
              >
                {label}
                <motion.span
                  className={styles.underline}
                  variants={underline}
                  transition={{ duration: 0.3, ease: EASE_IN_OUT }}
                />
              </motion.a>
            </li>
          ))}
        </ul>

        <motion.a
          href="mailto:aemil072@uottawa.ca"
          className={styles.cta}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT }}
        >
          Let’s Talk
        </motion.a>
      </nav>
    </motion.header>
  );
}
