import Navbar      from "@/components/layout/Navbar";
import Footer      from "@/components/layout/Footer";
import Hero        from "@/components/landing/Hero";
import Stats       from "@/components/landing/Stats";
import Features    from "@/components/landing/Features";
import HowItWorks  from "@/components/landing/HowItWorks";
import Advantages  from "@/components/landing/Advantages";
import CTA         from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Advantages />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
