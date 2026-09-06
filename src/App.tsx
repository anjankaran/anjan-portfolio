import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Stack from "./components/Stack";
import About from "./components/About";
import AgentSection from "./components/AgentSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import IntroLoader from "./components/IntroLoader";
import ContactModal from "./components/ContactModal";
import { ContactModalProvider } from "./context/ContactModalContext";
import LeafFall from "./components/leaf/LeafFall";
import LeafCursor from "./components/leaf/LeafCursor";

type Theme = "light" | "dark";

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [ready, setReady] = useState(false);
  const handleReveal = useCallback(() => setReady(true), []);
  const toggleTheme = useCallback(() => setTheme((current) => (current === "dark" ? "light" : "dark")), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ContactModalProvider>
      <div className="min-h-screen bg-ink text-fg">
        <IntroLoader onReveal={handleReveal} />

        {/* leaves fall the length of the page: one layer tucked behind the
            section cards, one drifting in front of them */}
        <LeafFall layer="back" count={10} />
        <LeafFall layer="front" count={6} />

        <div className="pointer-events-none fixed -right-40 -top-44 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(79,154,42,0.12),transparent_62%)]" />
        <div className="pointer-events-none fixed -bottom-60 -left-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(79,154,42,0.08),transparent_65%)]" />

        <Navbar ready={ready} theme={theme} onToggleTheme={toggleTheme} />

        <Hero ready={ready} />

        <div className="relative mx-auto max-w-[1320px] px-2 pb-2 sm:px-4">
          <main className="relative">
            <Services />
            <Projects />
            <Stack />
            <About />
            <AgentSection />
            <Contact />
          </main>
        </div>

        <Footer />

        <LeafCursor />

        <ChatWidget />
        <ContactModal />
      </div>
    </ContactModalProvider>
  );
}

export default App;
