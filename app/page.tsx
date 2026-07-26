import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ChooseExperience } from "@/components/sections/ChooseExperience";
import { FinalStatement } from "@/components/sections/FinalStatement";
import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <ChooseExperience />
        <FinalStatement />
      </main>
      <Footer />
    </>
  );
}
