import { motion } from "motion/react";
import { EASE_OUT } from "../../motion";
import styles from "./Divider.module.css";

/** Hairline rule between sections, aligned to the 12-column content width.
 *  Draws itself out from the centre as it scrolls into view. */
export default function Divider() {
  return (
    <div className={styles.wrap}>
      <motion.hr
        className={styles.rule}
        initial={{ scaleX: 0, opacity: 0 }}
        /* 0.55 is the rule's resting opacity */
        whileInView={{ scaleX: 1, opacity: 0.55 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      />
    </div>
  );
}
