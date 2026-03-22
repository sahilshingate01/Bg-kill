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
        items: state.items.map(i => 
          i.id === id ? { ...i, progress: Math.min(i.progress + 5, 90) } : i
        )
      }))
    }, 300)

    try {
      const formData = new FormData()
      formData.append('file', item.file)
      formData.append('mode', get().mode)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/remove-background`,
        { method: 'POST', body: formData }
      )

      clearInterval(progressInterval)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Processing failed')
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
      clearInterval(progressInterval)
      set(state => ({
        items: state.items.map(i => i.id === id ? { 
          ...i, 
          stage: 'error', 
          errorMessage: err.message || 'Network error' 
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
