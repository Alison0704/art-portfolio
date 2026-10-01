import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PillTabs from "../PillTabs/PillTabs";
import { EASE_IN_OUT, EASE_OUT, revealUp } from "../../motion";
import styles from "./Characters.module.css";

const sections = [
  { id: "biography", label: "Biography" },
  { id: "lore", label: "Lore Summary" },
  { id: "artworks", label: "Artworks" },
];

const lorem = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat, ante ac fringilla facilisis, dolor eros gravida dolor, sed faucibus dui quam ut nisl. Vivamus consectetur ante at elit viverra pretium. Phasellus mi est, dictum in dapibus vel, placerat quis ligula. Vestibulum a ante pharetra, sodales metus at, commodo mauris.",
  "Fusce ultricies ullamcorper leo quis eleifend. Aenean dictum quis mi sed imperdiet. Maecenas sit amet dapibus urna. Praesent faucibus non risus et ultrices.",
  "Pellentesque eleifend purus et quam aliquam, at dictum sapien consequat. Morbi condimentum massa eget scelerisque mattis. Mauris id pharetra nunc. Maecenas vehicula laoreet mi eget sollicitudin. Nullam mattis rhoncus maximus.",
];

// Placeholder data. Move to src/data/characters.js once it's real.
const defaultCharacters = [1, 2, 3, 4].map((n) => ({
  id: `char-${n}`,
  name: "NAME",
  tagline: "One Liner",
  icon: undefined,
  displayName: "Character",
  description: "One Sentence Description",
  portrait: "/placeholder-portrait.svg", // framed art inside the arch
  biography: lorem,
  lore: lorem,
  artworks: [], // array of image URLs
  cutout: null, // transparent PNG that overlaps the arch
  themeAudio: null, // URL
  voiceAudio: null, // URL
}));

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5l11 7-11 7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M5 4h4l2 3v10l-2 3H5z" fill="currentColor" />
      <path d="M14 9q2 3 0 6M17 7q4 5 0 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Spins the old transport icon out and the new one in on the same beat. */
function IconSwap({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        className={styles.iconGlyph}
        initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
        transition={{ duration: 0.2, ease: EASE_IN_OUT }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Characters({
  worldName = "World Name",
  characters = defaultCharacters,
}) {
  const [activeId, setActiveId] = useState(characters[0].id);
  const [section, setSection] = useState("biography");
  const [playing, setPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const themeRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  const active = characters.find((c) => c.id === activeId) ?? characters[0];

  const stop = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const selectCharacter = (id: string) => {
    stop(themeRef.current);
    stop(voiceRef.current);
    setPlaying(false);
    setSpeaking(false);
    setActiveId(id);
    setSection("biography");
  };

  // State drives the icon, so the buttons still respond while a character has
  // no audio attached yet. A failed play() rolls the state back.
  // Only one clip runs at a time, so only one button shows the stop icon.
  const toggleTheme = () => {
    if (playing) {
      stop(themeRef.current);
      setPlaying(false);
      return;
    }
    stop(voiceRef.current);
    setSpeaking(false);
    setPlaying(true);
    themeRef.current?.play().catch(() => setPlaying(false));
  };

  const toggleVoice = () => {
    if (speaking) {
      stop(voiceRef.current);
      setSpeaking(false);
      return;
    }
    stop(themeRef.current);
    setPlaying(false);
    setSpeaking(true);
    const audio = voiceRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => setSpeaking(false));
    }
  };

  return (
    <motion.section id="characters" className={styles.section} {...revealUp}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Characters in <span className={styles.accent}>{`{${worldName}}`}</span>
        </h2>

        <PillTabs
          items={characters}
          activeId={active.id}
          onChange={selectCharacter}
          label="Characters"
        />

        <div className={styles.layout}>
          <div className={styles.info}>
            {/* Name and one-liner swap with the selected character. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                <h3 className={styles.title}>{`Meet {${active.displayName}}`}</h3>
                <p className={styles.description}>{`{${active.description}}`}</p>
              </motion.div>
            </AnimatePresence>

            <div className={styles.card} id={`panel-${active.id}`} role="tabpanel">
              <div className={styles.sectionTabs} role="group" aria-label="Character details">
                {sections.map((s) => (
                  <motion.button
                    key={s.id}
                    type="button"
                    aria-pressed={section === s.id}
                    className={`${styles.sectionTab} ${section === s.id ? styles.sectionTabActive : ""}`}
                    onClick={() => setSection(s.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: EASE_IN_OUT }}
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>

              {/* Fixed-height well, so the crossfade never resizes the card. */}
              <div className={styles.well}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${active.id}-${section}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.26, ease: EASE_OUT }}
                  >
                    {section === "biography" &&
                      active.biography.map((p, i) => <p key={i}>{p}</p>)}
                    {section === "lore" && active.lore.map((p, i) => <p key={i}>{p}</p>)}
                    {section === "artworks" &&
                      (active.artworks.length ? (
                        <div className={styles.gallery}>
                          {active.artworks.map((src) => (
                            <motion.img
                              key={src}
                              src={src}
                              alt=""
                              className={styles.thumb}
                              whileHover={{ scale: 1.04 }}
                              transition={{ duration: 0.2, ease: EASE_IN_OUT }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p>No artworks yet.</p>
                      ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className={styles.arch}>
            <div className={styles.portraitFrame}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={active.id}
                  src={active.portrait}
                  alt={`${active.displayName} portrait`}
                  className={styles.portrait}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                />
              </AnimatePresence>
            </div>

            {active.cutout && (
              <motion.img
                key={`${active.id}-cutout`}
                src={active.cutout}
                alt={active.displayName}
                className={styles.cutout}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            )}

            <div className={styles.controls}>
              <motion.button
                type="button"
                className={`${styles.iconBtn} ${playing ? styles.iconBtnActive : ""}`}
                onClick={toggleTheme}
                aria-pressed={playing}
                aria-label={playing ? "Stop theme" : "Play theme"}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.94 }}
                transition={{ duration: 0.2, ease: EASE_IN_OUT }}
              >
                <IconSwap id={playing ? "stop" : "play"}>
                  {playing ? <StopIcon /> : <PlayIcon />}
                </IconSwap>
              </motion.button>
              <motion.button
                type="button"
                className={`${styles.iconBtn} ${speaking ? styles.iconBtnActive : ""}`}
                onClick={toggleVoice}
                aria-pressed={speaking}
                aria-label={speaking ? "Stop voice line" : "Play voice line"}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.94 }}
                transition={{ duration: 0.2, ease: EASE_IN_OUT }}
              >
                <IconSwap id={speaking ? "stop" : "voice"}>
                  {speaking ? <StopIcon /> : <VoiceIcon />}
                </IconSwap>
              </motion.button>
            </div>

            {active.themeAudio && (
              <audio ref={themeRef} src={active.themeAudio} onEnded={() => setPlaying(false)} />
            )}
            {active.voiceAudio && (
              <audio ref={voiceRef} src={active.voiceAudio} onEnded={() => setSpeaking(false)} />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
