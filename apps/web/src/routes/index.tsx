import { createFileRoute } from "@tanstack/react-router"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem-section"
import { Features } from "@/components/landing/features"
import { ForLandlords } from "@/components/landing/for-landlords"
import { Steps } from "@/components/landing/steps"
import { Testimonials } from "@/components/landing/testimonials"
import { JoinCommunity } from "@/components/landing/join-community"
import { Footer } from "@/components/landing/footer"

export const Route = createFileRoute("/")({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-body selection:bg-[#9ff0fb] selection:text-[#001f23]">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <Features />
        <ForLandlords />
        <Steps />
        <Testimonials />
        <JoinCommunity />
      </main>
      <Footer />
    </div>
  )
}
