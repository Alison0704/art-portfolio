import { motion } from "motion/react";
import { EASE_IN_OUT, revealUp } from "../../motion";
import styles from "./Footer.module.css";

const INSTAGRAM_URL = "https://www.instagram.com/sketchesbyannaelle/";
const EMAIL = "aemil072@uottawa.ca";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="26" height="26" rx="7" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="23.5" cy="8.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="3" y="6" width="26" height="20" rx="3" />
      <path d="M3.5 8l12.5 10L28.5 8" />
    </svg>
  );
}

const social = {
  whileHover: { y: -3, color: "var(--green)" },
  whileTap: { y: 0, scale: 0.94 },
  transition: { duration: 0.22, ease: EASE_IN_OUT },
};

export default function Footer() {
  return (
    <motion.footer id="contact" className={styles.footer} {...revealUp}>
      <div className={styles.inner}>
        <hr className={styles.divider} />

        <div className={styles.row}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Alison Emilien. All rights reserved.
          </p>

          <ul className={styles.socials}>
            <li>
              <motion.a
                href={INSTAGRAM_URL}
                className={styles.social}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                {...social}
              >
                <InstagramIcon />
              </motion.a>
            </li>
            <li>
              <motion.a
                href={`mailto:${EMAIL}`}
                className={styles.social}
                aria-label="Email"
                {...social}
              >
                <MailIcon />
              </motion.a>
            </li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}
