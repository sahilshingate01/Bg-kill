"use client"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[4px] border-black bg-[#F5F0E8] px-6 py-4 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-syne text-3xl font-[900] tracking-tighter text-black uppercase">
            BGKILL<span className="text-[#CAFF70]">.●</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden sm:block font-syne font-bold text-sm tracking-wide uppercase hover:underline decoration-2 underline-offset-4 decoration-[#CAFF70]">
            How it works
          </button>
          <button className="brutal-btn bg-[#CAFF70] text-sm py-2 px-6">
            Try Pro ↗
          </button>
        </div>
      </div>
    </header>
  )
}
