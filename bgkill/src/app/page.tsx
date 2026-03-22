"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeaturesTicker from "@/components/FeaturesTicker"
import UploadZone from "@/components/UploadZone"
import ProcessingState from "@/components/ProcessingState"
import ResultPanel from "@/components/ResultPanel"
import HowItWorks from "@/components/HowItWorks"
import FaqAccordion from "@/components/FaqAccordion"
import Footer from "@/components/Footer"
import { useImageStore } from "@/store/useImageStore"

export default function Home() {
  const { items } = useImageStore()
  const hasItems = items.length > 0

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Header />
      
      {/* Show Hero only when empty to focus on results once uploaded */}
      {!hasItems && <HeroSection />}

      <div className="flex flex-col">
        {!hasItems && <FeaturesTicker />}
        
        {/* Main Interaction Area */}
        <div className="relative py-12 md:py-20">
          {hasItems && (
            <div className="text-center mb-16">
               <h1 className="font-syne text-[clamp(48px,8vw,80px)] font-[900] leading-[0.9] uppercase text-black">
                 KILL THE <span className="text-[#CAFF70] drop-shadow-[4px_4px_0_#0A0A0A] [text-shadow:2px_2px_0_#0A0A0A]">BG.</span>
               </h1>
            </div>
          )}
          
          <UploadZone />
          <ProcessingState />
          <ResultPanel />
        </div>

        <FeaturesTicker />
      </div>

      <HowItWorks />
      <FaqAccordion />
      <Footer />

      {/* Extreme Bottom Branding Line */}
      <div className="w-full h-2 bg-[#CAFF70]"></div>
    </main>
  )
}
