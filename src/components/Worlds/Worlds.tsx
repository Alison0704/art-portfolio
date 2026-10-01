import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_IN_OUT, EASE_OUT, revealUp } from "../../motion";
import styles from "./Worlds.module.css";
import PillTabs from "../PillTabs/PillTabs";

// Replace with your real content. `icon` is an optional image URL.
const worlds = [
  {
    id: "world-1",
    name: "NAME",
    tagline: "One Liner",
    title: "Worlds Name",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat, ante ac fringilla facilisis, dolor eros gravida dolor, sed faucibus dui quam ut nisl.",
      "Vivamus consectetur ante at elit viverra pretium. Phasellus mi est, dictum in dapibus vel, placerat quis ligula. Vestibulum a ante pharetra, sodales metus at, commodo mauris. Fusce ultricies ullamcorper leo quis eleifend.",
      "Aenean dictum quis mi sed imperdiet. Maecenas sit amet dapibus urna. Praesent faucibus non risus et ultrices. Pellentesque eleifend purus et quam aliquam, at dictum sapien consequat. Morbi condimentum massa eget scelerisque mattis. Mauris id pharetra nunc. Maecenas vehicula laoreet mi eget sollicitudin. Nullam mattis rhoncus maximus.",
    ],
    href: "#",
  },
  { id: "world-2", name: "NAME", tagline: "One Liner", title: "Worlds Name", paragraphs: ["…"], href: "#" },
  { id: "world-3", name: "NAME", tagline: "One Liner", title: "Worlds Name", paragraphs: ["…"], href: "#" },
  { id: "world-4", name: "NAME", tagline: "One Liner", title: "Worlds Name", paragraphs: ["…"], href: "#" },
  { id: "world-5", name: "NAME", tagline: "One Liner", title: "Worlds Name", paragraphs: ["…"], href: "#" },
];

export default function Worlds() {
  const [activeId, setActiveId] = useState(worlds[0].id);
  const active = worlds.find((w) => w.id === activeId) ?? worlds[0]!;

  return (
    <motion.section id="worlds" className={styles.section} {...revealUp}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Worlds and Events</h2>

        <PillTabs items={worlds} activeId={activeId} onChange={setActiveId} label="Worlds and events" />

        <article
          id="worlds-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className={styles.card}
        >
          {/* The outgoing world fades out before the next one fades in, so the
              card never shows two sets of copy at once. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className={styles.cardContent}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <span className={styles.eyebrow}>Worlds</span>
              <h3 className={styles.title}>{`{${active.title}}`}</h3>

              <div className={styles.well}>
                <div className={styles.wellText}>
                  {active.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <motion.a
                href={active.href}
                className={styles.more}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: EASE_IN_OUT }}
              >
                View More
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </motion.section>
  );
}