import {
  Header,
  Hero,
  Features,
  HowItWorks,
  Roadmap,
  CTASection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Roadmap />
        {/* <Pricing /> */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
