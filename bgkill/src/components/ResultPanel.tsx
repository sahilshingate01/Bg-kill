"use client"

import { useImageStore, ImageItem } from "@/store/useImageStore"
import { motion, AnimatePresence } from "framer-motion"
import { Download, CheckCircle2, X, Archive, Trash2 } from "lucide-react"

export default function ResultPanel() {
  const { items, downloadResult, downloadAllAsZip, removeItem, reset } = useImageStore()
  const doneItems = items.filter(i => i.stage === 'done')

  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      {doneItems.length > 0 && (
        <div className="flex flex-col gap-12">
          {/* Header for Results */}
          <div className="flex flex-col items-center justify-center gap-6 text-center mb-6">
            <h2 className="font-syne text-[clamp(40px,8vw,56px)] font-[900] tracking-tight uppercase text-black inline-block relative px-4">
              RESULTS ✓
              <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#CAFF70] rotate-0.5"></div>
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
               {doneItems.length > 1 && (
                 <button 
                   onClick={downloadAllAsZip}
                   className="brutal-btn bg-[#CAFF70] text-black text-xs py-3 px-8 shadow-[5px_5px_0_0_#0A0A0A] hover:bg-white"
                 >
                   <Archive className="w-4 h-4" /> DOWNLOAD ALL (.ZIP)
                 </button>
               )}
               
               <button 
                 onClick={reset}
                 className="brutal-btn bg-[#FF5C5C] text-white text-xs py-3 px-8 shadow-[5px_5px_0_0_#0A0A0A] hover:bg-white hover:text-[#FF5C5C]"
               >
                 <Trash2 className="w-4 h-4" /> CLEAR ALL
               </button>
            </div>
          </div>

          {/* Grid of Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
            <AnimatePresence mode="popLayout">
              {doneItems.map((item, idx) => (
                <ResultCard 
                  key={item.id} 
                  item={item} 
                  onDownload={downloadResult} 
                  onRemove={removeItem}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  )
}

function ResultCard({ item, onDownload, onRemove, index }: { 
  item: ImageItem, 
  onDownload: (id: string, format: 'png' | 'webp') => void, 
  onRemove: (id: string) => void, 
  index: number 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.4, type: "spring", damping: 25, delay: index * 0.1 }}
      className="flex flex-col gap-6"
    >
      <div className="brutal-card bg-[#CAFF70] relative overflow-hidden h-full flex flex-col group/card shadow-[8px_8px_0_0_#0A0A0A]">
        {/* Card Header */}
        <div className="bg-[#CAFF70] border-b-[4px] border-black p-4 flex items-center justify-between">
          <span className="font-mono text-xs font-black text-black uppercase tracking-tight flex items-center gap-2 max-w-[200px] truncate">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {item.file.name}
          </span>
          <button 
            onClick={() => onRemove(item.id)}
            className="w-6 h-6 border-[2px] border-black bg-white flex items-center justify-center hover:bg-[#FF5C5C] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Image Containers Side-by-Side */}
        <div className="grid grid-cols-2 border-black flex-grow">
          <div className="bg-white border-r-[4px] border-black p-3 flex flex-col items-center justify-center min-h-[250px] relative">
            <span className="absolute top-2 left-2 font-mono text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-1 border border-gray-200">
              ORIG
            </span>
            <img 
              src={item.originalUrl} 
              alt="Original" 
              className="max-h-[250px] w-full object-contain grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all"
            />
          </div>
          
          <div className="checkerboard p-3 flex flex-col items-center justify-center min-h-[250px] bg-white relative">
            <span className="absolute top-2 right-2 font-mono text-[8px] font-black text-black uppercase tracking-widest bg-[#CAFF70] px-1 border border-black shadow-[1px_1px_0_0_#000]">
              KILL ✓
            </span>
            {item.resultUrl && (
              <img 
                src={item.resultUrl} 
                alt="Result" 
                className="max-h-[250px] w-full object-contain drop-shadow-[10px_10px_5px_rgba(0,0,0,0.15)] scale-105"
              />
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t-[4px] border-black bg-white flex justify-between items-center text-black/40 font-mono text-[10px] font-bold">
           <span>{item.outputDimensions?.w}×{item.outputDimensions?.h}PX</span>
           <span className="bg-black text-[#CAFF70] px-2 py-0.5 scale-90">U2NET HD ✓</span>
        </div>
      </div>

      {/* Button Row */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onDownload(item.id, 'png')}
          className="brutal-btn bg-[#0A0A0A] text-white hover:bg-gray-800 text-[10px] py-3 shadow-[4px_4px_0_0_#CAFF70] border-white group"
        >
          <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /> PNG
        </button>
        <button 
          onClick={() => onDownload(item.id, 'webp')}
          className="brutal-btn bg-white text-black hover:bg-gray-50 text-[10px] py-3 shadow-[4px_4px_0_0_#0A0A0A]"
        >
          <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /> WEBP
        </button>
      </div>
    </motion.div>
  )
}
