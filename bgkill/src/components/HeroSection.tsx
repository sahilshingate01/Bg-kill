"use client"

import { useImageStore, Mode } from "@/store/useImageStore"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  const { mode, setMode } = useImageStore()

  const modes: { id: Mode; label: string }[] = [
    { id: 'auto', label: 'AUTO' },
    { id: 'portrait', label: 'PORTRAIT' },
    { id: 'general', label: 'GENERAL' },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="flex flex-col gap-6">
        <div>
          <span className="inline-block bg-[#5C5CFF] text-white font-mono text-xs font-bold border-[3px] border-black px-4 py-1 mb-6 shadow-[3px_3px_0_0_#0A0A0A]">
            [ FREE TOOL ]
          </span>
          <h1 className="font-syne text-[clamp(56px,8vw,100px)] font-[900] leading-[0.9] uppercase text-black">
            KILL THE <br />
            <span className="text-[#CAFF70] drop-shadow-[5px_5px_0_#0A0A0A] [text-shadow:3px_3px_0_#0A0A0A]">
              BACKGROUND.
            </span>
          </h1>
        </div>
        
        <p className="font-mono text-[15px] text-[#555] max-w-md leading-relaxed">
          Drop your image. We erase the mess. Keep what matters. Precision edge detection for the bold. HD quality, 100% locally.
        </p>

        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-wrap gap-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`border-[3px] border-black px-6 py-2 font-syne font-extrabold text-sm tracking-wider uppercase transition-colors shadow-[3px_3px_0_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                  mode === m.id ? "bg-[#CAFF70]" : "bg-white hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
            className="brutal-btn bg-[#CAFF70] text-xl py-4 px-10 self-start group"
          >
            REMOVE BG NOW <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="brutal-card p-4 aspect-square max-w-[500px] mx-auto relative group overflow-hidden">
          <div className="absolute inset-0 bg-gray-200">
             {/* Simple Placeholder Image Representation */}
             <div className="w-full h-full bg-[#CAFF70] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
               <div className="brutal-card bg-white p-6 rotate-3 z-10">
                 <div className="w-40 h-40 bg-[#5C5CFF]/20 border-2 border-dashed border-black"></div>
               </div>
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 font-mono text-xs uppercase tracking-widest border border-white">
                 BEFORE / AFTER
               </div>
             </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-[#F5F0E8] font-mono text-[10px] py-1 px-4 border-2 border-black z-20">
            AI PRECISION OVERDRIVE // U2NET
          </div>
        </div>
        
        {/* Floating Accent Decorative Element */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FF5C5C] border-[4px] border-black -z-10 shadow-[8px_8px_0_0_#0A0A0A] hidden md:block"></div>
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#5C5CFF] border-[4px] border-black -z-10 shadow-[6px_6px_0_0_#0A0A0A] hidden md:block rounded-full"></div>
      </div>
    </section>
  )
}
