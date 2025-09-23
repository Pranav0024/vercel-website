import Hero from "@/components/Hero";
import IntroducingSection from "@/components/IntroducingSection";
import FloatingWhatsApp from "@/components/floatingwhatsapp";
import HomepageProductShowcase from "@/components/homepageproductshowcase";

export default function Home() {
  return (
    <>
    <FloatingWhatsApp />
    <Hero />
    <IntroducingSection />
    <HomepageProductShowcase />
    </>
  );
}
