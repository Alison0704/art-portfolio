import { MotionConfig } from "motion/react";
import Nav from "./components/Nav/Nav";
import Hero from "./components/Hero/Hero";
import Worlds from "./components/Worlds/Worlds";
import Characters from "./components/Characters/Characters";
import Footer from "./components/Footer/Footer";
import Divider from "./components/Divider/Divider";
import WatercolourDrops from "./components/WatercolourDrops/WatercolourDrops";

export default function App() {
  return (
    // reducedMotion="user" makes every motion component below respect the OS
    // setting, so no component needs its own prefers-reduced-motion rules.
    <MotionConfig reducedMotion="user">
      <WatercolourDrops />
      <Nav />
      <main>
        <Hero />
        <Divider />
        <Worlds />
        <Divider />
        <Characters worldName="Your World" />
        <Footer />
      </main>
    </MotionConfig>
  );
}
