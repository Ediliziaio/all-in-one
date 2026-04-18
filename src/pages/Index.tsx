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
import { WaveDivider, ZigzagDivider, DiagonalDivider } from "@/components/motion/MotionWrappers";

type Variant = "wave" | "zigzag" | "diagonal";

const Divider = ({
  fill,
  flip = false,
  variant = "wave",
  direction = "left",
}: {
  fill: string;
  flip?: boolean;
  variant?: Variant;
  direction?: "left" | "right";
}) => {
  const Comp =
    variant === "zigzag" ? ZigzagDivider : variant === "diagonal" ? DiagonalDivider : WaveDivider;
  return (
    <div aria-hidden className="relative z-10 -mt-1">
      {variant === "diagonal" ? (
        <DiagonalDivider fill={fill} flip={flip} direction={direction} />
      ) : (
        <Comp fill={fill} flip={flip} />
      )}
    </div>
  );
};

const Index = () => (
  <Layout>
    <HeroSection />
    <Divider fill="hsl(var(--google-red) / 0.05)" variant="wave" />
    <ProblemSection />
    <Divider fill="hsl(var(--google-blue) / 0.05)" variant="diagonal" direction="left" />
    <ServicesSection />
    <Divider fill="hsl(var(--background))" variant="wave" />
    <RoomsPreview />
    <Divider fill="hsl(var(--google-yellow) / 0.07)" variant="zigzag" />
    <HowItWorksSection />
    <Divider fill="hsl(var(--google-green) / 0.08)" variant="wave" flip />
    <GuaranteeSection />
    <Divider fill="hsl(var(--muted) / 0.3)" variant="diagonal" direction="right" />
    <TestimonialsSection />
    <Divider fill="hsl(var(--google-blue) / 0.08)" variant="wave" />
    <CommunitySection />
    <Divider fill="hsl(var(--google-red) / 0.95)" variant="zigzag" flip />
    <UrgencySection />
    <Divider fill="hsl(var(--muted) / 0.3)" variant="wave" flip />
    <AboutSection />
    <Divider fill="hsl(var(--muted) / 0.5)" variant="diagonal" direction="left" />
    <MapSection />
  </Layout>
);

export default Index;
