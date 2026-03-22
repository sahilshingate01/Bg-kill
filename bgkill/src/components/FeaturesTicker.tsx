"use client"

const items = [
  "★ INSTANT REMOVAL", "★ 100% FREE", "★ NO SIGNUP",
  "★ PRIVACY FIRST", "★ RUNS LOCALLY", "★ HD QUALITY",
  "★ PNG OUTPUT", "★ NO SERVER UPLOADS", "★ U2NET AI MODEL",
]

export default function FeaturesTicker() {
  const displayItems = [...items, ...items, ...items] // Triple for seamless scrolling

  return (
    <div className="w-full h-14 bg-[#0A0A0A] overflow-hidden flex items-center border-y-[3px] border-black">
      <div className="ticker-track flex whitespace-nowrap gap-12">
        {displayItems.map((item, i) => (
          <span 
            key={i} 
            className="font-syne text-white text-base font-bold tracking-[0.1em] px-4"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
