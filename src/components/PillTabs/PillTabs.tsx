import { motion } from "motion/react";
import { EASE_IN_OUT } from "../../motion";
import styles from "./PillTabs.module.css";

type PillTabItem = {
  id: string;
  name: string;
  tagline: string;
  icon?: string;
};

type PillTabsProps = {
  items: PillTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  label: string;
};

/* Collapsed: 48px icon + 0.75rem padding on each side. */
const COLLAPSED = 72;
const EXPANDED = 280;

const pill = {
  closed: { width: COLLAPSED },
  open: { width: EXPANDED },
};

/** Slides out from under the icon as the pill widens. */
const text = {
  closed: { opacity: 0, x: -12 },
  open: { opacity: 1, x: 0 },
};

export default function PillTabs({
  items,
  activeId,
  onChange,
  label,
}: PillTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <motion.button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={active}
            aria-controls={`panel-${item.id}`}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            onClick={() => onChange(item.id)}
            variants={pill}
            initial={false}
            animate={active ? "open" : "closed"}
            whileHover="open"
            whileFocus="open"
            transition={{ duration: 0.38, ease: EASE_IN_OUT }}
          >
            <span className={styles.icon}>
              {item.icon ? (
                <img src={item.icon} alt="" />
              ) : (
                <span className={styles.initial} aria-hidden="true">
                  {item.name.charAt(0)}
                </span>
              )}
            </span>
            <motion.span
              className={styles.text}
              variants={text}
              transition={{
                opacity: { duration: 0.22, delay: active ? 0 : 0.08 },
                x: { duration: 0.38, ease: EASE_IN_OUT, delay: active ? 0 : 0.08 },
              }}
            >
              <span className={styles.name}>{`{${item.name}}`}</span>
              <span className={styles.line}>{`{${item.tagline}}`}</span>
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}
