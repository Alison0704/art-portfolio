import { motion } from "motion/react";
import { EASE_OUT } from "../../motion";
import styles from "./Hero.module.css";
// import portrait from "../../assets/portrait.png";

/** Portrait settles first, then each block of copy follows. */
const container = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export default function Hero() {
  return (
    <motion.section
      id="about"
      className={styles.hero}
      variants={container}
      initial="hidden"
      animate="shown"
    >
      <div className={styles.inner}>
        <div className={styles.portraitWrap}>
          <motion.div
            className={styles.portrait}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {/* Temporary placeholder — swap for the real portrait import above. */}
            <img src="/placeholder-avatar.svg" alt="" className={styles.image} />
          </motion.div>
        </div>

        <div className={styles.text}>
          <motion.h1 className={styles.title} variants={item}>
            Hello, I’m Annaëlle,
          </motion.h1>

          <motion.p className={styles.body} variants={item}>
            I&apos;m an independent character artist and world builder creating
            fantasy stories inspired by my growth personality traits,
            watercolor and ink aesthetics and themed around tropical and island
            adjacent scenery with loads of my favorite flower: Plumeria
          </motion.p>

          <motion.p className={styles.body} variants={item}>
            My work lives between Digital artwork, Character Concepts and Game
            development.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
