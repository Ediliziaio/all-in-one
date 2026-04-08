import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { MapSection } from "@/components/home/MapSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <ServicesSection />
    <HowItWorksSection />
    <RoomsPreview />
    <TestimonialsSection />
    <AboutSection />
    <MapSection />
  </Layout>
);

export default Index;
