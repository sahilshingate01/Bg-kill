"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqItems = [
  { 
    q: "IS IT REALLY FREE?", 
    a: "Yes. We don't charge for basic removals. Unlimited exports." 
  },
  { 
    q: "WHAT ABOUT MY PRIVACY?", 
    a: "Images are processed locally on your server. Never stored, never shared." 
  },
  { 
    q: "MAX RESOLUTION?", 
    a: "We process up to 50MB images at full native resolution. No downscaling." 
  },
  { 
    q: "WHAT FORMATS ARE SUPPORTED?", 
    a: "PNG, JPG, JPEG, WEBP input. PNG (lossless) or WEBP output." 
  },
  { 
    q: "HOW ACCURATE IS THE AI?", 
    a: "U2Net model handles hair, fur, complex edges. Portrait mode optimized for humans." 
  },
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 md:px-12 bg-[#F5F0E8]">
      <div className="text-center mb-16 relative">
        <h2 className="font-syne text-[clamp(48px,8vw,64px)] font-[900] tracking-tight uppercase text-black inline-block relative px-4">
          F.A.Q<span className="text-[#5C5CFF]">.</span>
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#CAFF70] rotate-1"></div>
        </h2>
      </div>

      <div className="flex flex-col border-[4px] border-black shadow-[8px_8px_0_0_#0A0A0A] bg-white">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b-[4px] border-black last:border-b-0 group">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F5F0E8] transition-colors"
            >
              <span className={`font-syne text-xl font-[800] tracking-tight uppercase transition-all ${openIndex === index ? 'text-[#5C5CFF]' : 'text-black'}`}>
                {item.q}
              </span>
              <div className={`p-2 border-[2px] border-black shadow-[2px_2px_0_0_#0A0A0A] transition-colors ${openIndex === index ? 'bg-[#CAFF70]' : 'bg-[#FF5C5C]'}`}>
                {openIndex === index ? <Minus className="w-5 h-5 text-black" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden border-t-[3px] border-black bg-[#F5F0E8]/50"
                  style={{ borderLeft: "8px solid #CAFF70" }}
                >
                  <div className="p-8 font-mono text-sm font-bold text-[#444] uppercase leading-relaxed tracking-tight">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
