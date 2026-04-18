import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GuaranteeSection } from "@/components/home/GuaranteeSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { UrgencySection } from "@/components/home/UrgencySection";
import { AboutSection } from "@/components/home/AboutSection";
import { MapSection } from "@/components/home/MapSection";
import { WaveDivider } from "@/components/motion/MotionWrappers";

const Divider = ({ fill, flip = false }: { fill: string; flip?: boolean }) => (
  <div aria-hidden className="relative z-10 -mt-1">
    <WaveDivider fill={fill} flip={flip} />
  </div>
);

const Index = () => (
  <Layout>
    <HeroSection />
    <Divider fill="hsl(var(--google-red) / 0.05)" />
    <ProblemSection />
    <Divider fill="hsl(var(--google-blue) / 0.05)" />
    <ServicesSection />
    <Divider fill="hsl(var(--background))" />
    <RoomsPreview />
    <Divider fill="hsl(var(--google-yellow) / 0.07)" />
    <HowItWorksSection />
    <Divider fill="hsl(var(--google-green) / 0.08)" flip />
    <GuaranteeSection />
    <Divider fill="hsl(var(--muted) / 0.3)" />
    <TestimonialsSection />
    <Divider fill="hsl(var(--google-blue) / 0.08)" />
    <CommunitySection />
    <Divider fill="hsl(var(--google-red) / 0.95)" flip />
    <UrgencySection />
    <Divider fill="hsl(var(--muted) / 0.3)" />
    <AboutSection />
    <Divider fill="hsl(var(--muted) / 0.5)" />
    <MapSection />
  </Layout>
);

export default Index;
