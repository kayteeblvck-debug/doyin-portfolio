import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { WhatIDo } from "@/components/sections/what-i-do";
import { Experience } from "@/components/sections/experience";
import { Metrics } from "@/components/sections/metrics";
import { Education } from "@/components/sections/education";
import { Philosophy } from "@/components/sections/philosophy";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <WhatIDo />
        <Experience />
        <Metrics />
        <Education />
        <Philosophy />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
