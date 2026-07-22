import Preloader from './components/layout/Preloader';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Formats from './components/sections/Formats';
import ColorSwapText from './components/sections/ColorSwapText';
import Customize from './components/sections/Customize';
import Process from './components/sections/Process';
import Serve from './components/sections/Serve';
import Trust from './components/sections/Trust';
import Voices from './components/sections/Voices';
import Wholesale from './components/sections/Wholesale';

export default function App() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <Formats />
        <ColorSwapText />
        <Customize />
        <Process />
        <Serve />
        <Trust />
        <Voices />
        <Wholesale />
      </main>
      <Footer />
    </>
  );
}
