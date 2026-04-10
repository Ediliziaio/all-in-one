import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GuaranteeSection } from "@/components/home/GuaranteeSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { UrgencySection } from "@/components/home/UrgencySection";
import { AboutSection } from "@/components/home/AboutSection";
import { MapSection } from "@/components/home/MapSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <ProblemSection />
    <ServicesSection />
    <RoomsPreview />
    <HowItWorksSection />
    <GuaranteeSection />
    <TestimonialsSection />
    <UrgencySection />
    <AboutSection />
    <MapSection />
  </Layout>
);

export default Index;
