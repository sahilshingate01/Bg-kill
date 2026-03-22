"use client"

import { useImageStore } from "@/store/useImageStore"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { FileImage, Upload } from "lucide-react"
import { useCallback, useState } from "react"

export default function UploadZone() {
  const { addImages, items } = useImageStore()
  const [isHovered, setIsHovered] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      addImages(acceptedFiles)
    }
  }, [addImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 50 * 1024 * 1024,
    multiple: true // ENABLED MULTIPLE
  })

  // Show always if there's no items or as a smaller version if there are?
  // Let's decide based on whether any item is processing/done.
  const hasItems = items.length > 0

  return (
    <section id="upload-zone" className={`mx-auto max-w-4xl px-6 md:px-12 ${hasItems ? 'py-6' : 'py-12'}`}>
      <motion.div
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative cursor-pointer transition-all duration-300
          border-[3px] border-dashed rounded-none p-12 text-center
          ${isDragActive ? "bg-[#CAFF70] border-solid border-black overflow-hidden" : isHovered ? "bg-[#f5fff0] border-[#0A0A0A]" : "bg-white border-[#0A0A0A]"}
          group
        `}
        animate={isDragActive ? { x: [-3, 3, -3, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0A0A0A] transition-transform group-hover:-translate-y-1 ${isDragActive ? "bg-white" : "bg-[#CAFF70]"}`}>
            {isDragActive ? <Upload className="w-8 h-8 text-black" /> : <FileImage className="w-8 h-8 text-black" />}
          </div>

          <div className="space-y-1">
            <h2 className="font-syne text-2xl font-[800] tracking-tight uppercase text-black">
              {isDragActive ? "DROP THEM ALL!" : "DROP FILES TO KILL THE BG"}
            </h2>
            <p className="font-mono text-[10px] text-[#666] uppercase font-bold tracking-[0.1em]">
              SUPPORTS MULTIPLE PNG, JPG, WEBP [MAX 50MB EACH]
            </p>
          </div>

          <button className="brutal-btn bg-white text-xs py-2 px-6 mt-2 group-hover:bg-[#CAFF70] transition-colors">
            SELECT FILES
          </button>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-[3px] border-l-[3px] border-black"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-[3px] border-r-[3px] border-black"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[3px] border-l-[3px] border-black"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[3px] border-r-[3px] border-black"></div>
      </motion.div>
    </section>
  )
}
