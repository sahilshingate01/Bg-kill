"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#0A0A0A] border-t-[6px] border-[#CAFF70] pt-16 pb-8 px-6 md:px-12 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start mb-20">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <span className="font-syne text-4xl font-[900] tracking-tighter text-white uppercase">
            BGKILL<span className="text-[#CAFF70]">.●</span>
          </span>
          <p className="font-mono text-sm font-bold text-gray-500 uppercase tracking-widest max-w-md leading-relaxed">
            // KILL THE BACKGROUND. <br />
            YOUR IMAGES ARE NEVER STORED. WE RESPECT YOUR DATA AS MUCH AS YOUR RESOLUTION.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-mono text-xs font-black tracking-widest">
          <h4 className="text-gray-500 uppercase mb-2">// LEGAL</h4>
          <a href="#" className="hover:text-[#FF5C5C] transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-[#FF5C5C] transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-[#FF5C5C] transition-colors">LICENSE INFO</a>
        </div>

        <div className="flex flex-col gap-4 font-mono text-xs font-black tracking-widest">
          <h4 className="text-gray-500 uppercase mb-2">// CONTACT</h4>
          <a href="#" className="hover:text-[#CAFF70] transition-colors">SUPPORT HELP</a>
          <a href="#" className="hover:text-[#CAFF70] transition-colors">TWITTER / X</a>
          <a href="#" className="hover:text-[#CAFF70] transition-colors">GITHUB REPO</a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-gray-600 font-black tracking-[0.2em] uppercase">
            BGKILL. © {currentYear} // MADE FOR THE BOLD
          </span>
        </div>
        
        <div className="flex gap-4">
           {['FB', 'IG', 'TW', 'GH'].map(social => (
             <div key={social} className="w-10 h-10 border-2 border-gray-700 bg-gray-900 flex items-center justify-center font-syne text-[10px] font-black hover:border-[#CAFF70] hover:bg-black transition-all cursor-pointer">
               {social}
             </div>
           ))}
        </div>

        <div className="flex gap-4 items-center">
          <span className="font-mono text-[10px] text-gray-600 font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM STATUS: OPTIMAL
          </span>
        </div>
      </div>

      {/* Extreme Bottom Decorative Stripe */}
      <div className="ticker-track flex mt-10 opacity-20 whitespace-nowrap gap-8">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="font-syne text-[80px] font-black tracking-tighter text-white uppercase italic">
            NO LIMITS // KILL BG // FAST // FREE //
          </span>
        ))}
      </div>
    </footer>
  )
}
