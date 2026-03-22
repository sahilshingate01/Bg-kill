"use client"

import { motion } from "framer-motion"
import { Upload, Cpu, Download } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "UPLOAD",
    desc: "Throw your image into our engine. We handle high-res files without breaking a sweat.",
    icon: <Upload className="w-8 h-8 text-white" />,
    bg: "bg-[#5C5CFF]",
    textColor: "text-white",
    ghostColor: "text-white/10"
  },
  {
    number: "02",
    title: "PROCESS",
    subtitle: "AI OVERDRIVE",
    desc: "Our neural networks identify every strand of hair and fine edge to cut out the noise.",
    icon: <Cpu className="w-8 h-8 text-black" />,
    bg: "bg-[#CAFF70]",
    textColor: "text-black",
    ghostColor: "text-black/10"
  },
  {
    number: "03",
    title: "DOWNLOAD",
    desc: "Grab your clean cutout in PNG or WEBP. No watermarks. No bullshit. Just speed.",
    icon: <Download className="w-8 h-8 text-white" />,
    bg: "bg-[#FF5C5C]",
    textColor: "text-white",
    ghostColor: "text-white/10"
  }
]

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 bg-[#F5F0E8] border-y-[6px] border-black my-20">
      <div className="text-center mb-20 relative">
        <h2 className="font-syne text-[clamp(48px,10vw,80px)] font-[900] tracking-tighter uppercase text-black inline-block relative px-4">
          PROCESS<span className="text-[#CAFF70]">.</span>
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#CAFF70] -z-10 rotate-1"></div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start mt-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            style={{ marginTop: index === 1 ? '40px' : '0' }}
            className={`brutal-card ${step.bg} p-8 relative overflow-hidden h-full min-h-[350px] flex flex-col justify-between`}
          >
            {/* Ghost Number Overlay */}
            <span className={`absolute -top-10 -right-4 font-syne text-[140px] font-[900] ${step.ghostColor} pointer-events-none select-none italic`}>
              {step.number}
            </span>

            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-black flex items-center justify-center border-[3px] border-white shadow-[4px_4px_0_0_#000]">
                {step.icon}
              </div>
              
              <div className="space-y-4">
                <h3 className={`font-syne text-3xl font-[900] ${step.textColor} tracking-tight uppercase leading-none`}>
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="font-mono text-sm font-black text-[#FF5C5C] bg-white px-3 py-1 inline-block border-2 border-black -rotate-2">
                    {step.subtitle}
                  </p>
                )}
                <p className={`font-mono text-sm font-bold leading-relaxed ${step.textColor} opacity-90 uppercase`}>
                  {step.desc}
                </p>
              </div>
            </div>

            <div className={`mt-10 pt-4 border-t-2 ${step.textColor === 'text-white' ? 'border-white/30' : 'border-black/20'} font-mono text-xs font-black tracking-widest ${step.textColor}`}>
              STEP {step.number} // COMPLETE
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
