import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GuaranteeSection } from "@/components/home/GuaranteeSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { UrgencySection } from "@/components/home/UrgencySection";
import { AboutSection } from "@/components/home/AboutSection";
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
    <Seo
      title="Alloggio Studenti Padova — Camere Singole e Doppie da €390/mese"
      description="Studentato Napoleone a Padova: camere singole e doppie per studenti universitari vicino all'Università di Padova. WiFi, utenze, cucina e pulizie incluse. Posti disponibili per l'a.a. 2026-27. Richiedi ora."
      canonical="/"
      keywords="alloggio studenti Padova 2026, camere singole Padova università, affitto posto letto Padova, studentato vicino UniPD"
    />
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
    <Divider fill="hsl(var(--primary))" variant="wave" flip />
    <UrgencySection />
    <Divider fill="hsl(var(--muted) / 0.3)" variant="wave" flip />
    <AboutSection />
  </Layout>
);

export default Index;
