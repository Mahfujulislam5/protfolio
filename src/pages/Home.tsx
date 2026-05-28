import { Hero } from "../components/home/Hero";
import { Stats } from "../components/home/Stats";
import { Categories } from "../components/home/Categories";
import { FeaturedWork } from "../components/home/FeaturedWork";
import { Skills } from "../components/home/Skills";
import { FeaturedPrompts } from "../components/home/FeaturedPrompts";
import { AppShowcase } from "../components/home/AppShowcase";
import { DesignGallery } from "../components/home/DesignGallery";
import { PremiumTools } from "../components/home/PremiumTools";
import { Testimonials } from "../components/home/Testimonials";
import { Contact } from "../components/home/Contact";
import { About } from "../components/home/About";

export function Home() {
  return (
    <div className="flex flex-col w-full relative">
      <Hero />
      <Stats />
      <Categories />
      <FeaturedWork />
      <Skills />
      <FeaturedPrompts />
      <PremiumTools />
      <AppShowcase />
      <DesignGallery />
      <Testimonials />
      <Contact />
    </div>
  )
}
