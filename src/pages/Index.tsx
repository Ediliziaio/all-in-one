import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MapSection } from "@/components/home/MapSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <ServicesSection />
    <RoomsPreview />
    <TestimonialsSection />
    <MapSection />
  </Layout>
);

export default Index;
