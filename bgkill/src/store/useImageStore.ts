import { create } from 'zustand'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export type Stage = 'idle' | 'processing' | 'done' | 'error'
export type Mode = 'auto' | 'portrait' | 'general'

export interface ImageItem {
  id: string
  file: File
  originalUrl: string
  resultUrl: string | null
  resultBlob: Blob | null
  stage: Stage
  progress: number
  errorMessage: string | null
  originalDimensions: { w: number; h: number } | null
  outputDimensions: { w: number; h: number } | null
}

interface ImageStore {
  items: ImageItem[]
  mode: Mode
  setMode: (m: Mode) => void
  addImages: (files: File[]) => void
  processItem: (id: string) => Promise<void>
  downloadResult: (id: string, format: 'png' | 'webp') => void
  downloadAllAsZip: () => Promise<void>
  removeItem: (id: string) => void
  reset: () => void
}

export const useImageStore = create<ImageStore>((set, get) => ({
  items: [],
  mode: 'auto',

  setMode: (mode) => set({ mode }),

  addImages: (files: File[]) => {
    const newItems: ImageItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      resultBlob: null,
      stage: 'idle',
      progress: 0,
      errorMessage: null,
      originalDimensions: null,
      outputDimensions: null,
    }))

    set(state => ({ items: [...state.items, ...newItems] }))
    newItems.forEach(item => get().processItem(item.id))
  },

  processItem: async (id: string) => {
    const item = get().items.find(i => i.id === id)
    if (!item) return

    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, stage: 'processing', progress: 0 } : i)
    }))

    const progressInterval = setInterval(() => {
      set(state => ({
        items: state.items.map(i => {
          if (i.id !== id) return i
          // Dynamic increment: slower as it gets higher
          let inc = 2
          if (i.progress < 50) inc = 4
          else if (i.progress < 80) inc = 2
          else if (i.progress < 95) inc = 0.5
          
          return { ...i, progress: Math.min(i.progress + inc, 95) }
        })
      }))
    }, 400)

    // Abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minute timeout

    try {
      const formData = new FormData()
      formData.append('file', item.file)
      formData.append('mode', get().mode)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const res = await fetch(
        `${apiUrl}/remove-background`,
        { 
          method: 'POST', 
          body: formData,
          signal: controller.signal 
        }
      )

      clearTimeout(timeoutId)
      clearInterval(progressInterval)

      if (!res.ok) {
        let errorTitle = 'Processing failed'
        try {
          const err = await res.json()
          errorTitle = err.detail || errorTitle
        } catch {
          errorTitle = `Server error (${res.status})`
        }
        throw new Error(errorTitle)
      }

      const origW = res.headers.get('X-Original-Width')
      const origH = res.headers.get('X-Original-Height')
      const outW = res.headers.get('X-Output-Width')
      const outH = res.headers.get('X-Output-Height')

      const blob = await res.blob()
      const resultUrl = URL.createObjectURL(blob)

      set(state => ({
        items: state.items.map(i => i.id === id ? { 
          ...i, 
          stage: 'done', 
          resultBlob: blob, 
          resultUrl, 
          progress: 100,
          originalDimensions: origW ? { w: +origW, h: +origH! } : null,
          outputDimensions: outW ? { w: +outW, h: +outH! } : null,
        } : i)
      }))

    } catch (err: any) {
      clearTimeout(timeoutId)
      clearInterval(progressInterval)
      
      let message = err.message || 'Network error'
      if (err.name === 'AbortError') message = 'Processing timed out (server too busy)'
      
      set(state => ({
        items: state.items.map(i => i.id === id ? { 
          ...i, 
          stage: 'error', 
          errorMessage: message 
        } : i)
      }))
    }
  },

  downloadResult: async (id: string, format: 'png' | 'webp') => {
    const item = get().items.find(i => i.id === id)
    if (!item?.resultBlob) return

    const baseName = item.file.name.replace(/\.[^.]+$/, '') || 'bgkill_output'

    if (format === 'png') {
      saveAs(item.resultBlob, `${baseName}_nobg.png`)
    } else {
      const img = new Image()
      img.src = URL.createObjectURL(item.resultBlob)
      await new Promise(r => img.onload = r)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) return
        saveAs(blob, `${baseName}_nobg.webp`)
      }, 'image/webp', 0.95)
    }
  },

  downloadAllAsZip: async () => {
    const zip = new JSZip()
    const doneItems = get().items.filter(i => i.stage === 'done' && i.resultBlob)
    
    if (doneItems.length === 0) return

    doneItems.forEach(item => {
      const fileName = `${item.file.name.replace(/\.[^.]+$/, '')}_nobg.png`
      zip.file(fileName, item.resultBlob!)
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `bgkill_batch_${new Date().toISOString().slice(0, 10)}.zip`)
  },

  removeItem: (id: string) => {
    const item = get().items.find(i => i.id === id)
    if (item?.originalUrl) URL.revokeObjectURL(item.originalUrl)
    if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl)
    set(state => ({ items: state.items.filter(i => i.id !== id) }))
  },

  reset: () => {
    get().items.forEach(item => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl)
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
    })
    set({ items: [] })
  }
}))
