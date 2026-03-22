"use client"

import { useImageStore } from "@/store/useImageStore"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"

export default function ProcessingState() {
  const { items, mode } = useImageStore()
  
  const processingItems = items.filter(i => i.stage === 'processing')
  const errorItems = items.filter(i => i.stage === 'error')

  if (processingItems.length === 0 && errorItems.length === 0) return null

  return (
    <section className="mx-auto max-w-4xl px-6 py-6 md:px-12 space-y-4">
      <AnimatePresence>
        {processingItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: idx * 0.1 }}
            className="brutal-card p-6 flex flex-col sm:flex-row items-center gap-6 bg-white relative overflow-hidden"
          >
            <div className="w-12 h-12 border-[4px] border-black border-t-[#CAFF70] animate-spin-slow flex-shrink-0"></div>
            
            <div className="flex-grow w-full space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-syne text-sm font-black uppercase truncate max-w-[200px]">
                  {item.file.name}
                </span>
                <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">
                  {Math.round(item.progress)}%
                </span>
              </div>
              
              <div className="h-4 w-full border-[2px] border-black bg-[#F5F0E8] overflow-hidden">
                <motion.div 
                  className="h-full bg-[#CAFF70] border-r-[2px] border-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {errorItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="brutal-card p-4 flex items-center gap-4 bg-[#FF5C5C] text-white border-[3px] border-black shadow-[4px_4px_0_0_#0A0A0A]"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-syne text-xs font-black uppercase truncate">{item.file.name}</p>
              <p className="font-mono text-[10px] font-bold opacity-80 uppercase">ERROR: {item.errorMessage}</p>
            </div>
            <button 
              onClick={() => useImageStore.getState().removeItem(item.id)}
              className="font-mono text-[10px] font-black underline"
            >
              DISMISS
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  )
}
