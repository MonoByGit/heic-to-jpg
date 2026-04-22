'use client'

import { useCallback, useRef, useState } from 'react'

type Quality = 'low' | 'medium' | 'high'
type FileStatus = 'pending' | 'converting' | 'done' | 'error'

interface ConvertedFile {
  id: string
  file: File
  name: string
  blob: Blob | null
  status: FileStatus
  error?: string
}

const QUALITY_MAP: Record<Quality, number> = {
  low: 0.6,
  medium: 0.8,
  high: 0.95,
}

const MAX_FILES = 20

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isHeic(f: File): boolean {
  return (
    f.type === 'image/heic' ||
    f.type === 'image/heif' ||
    f.name.toLowerCase().endsWith('.heic') ||
    f.name.toLowerCase().endsWith('.heif')
  )
}

export default function HeicConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([])
  const [quality, setQuality] = useState<Quality>('high')
  const [isDragging, setIsDragging] = useState(false)
  const [isZipping, setIsZipping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: File[]) => {
    const heicFiles = incoming.filter(isHeic)
    if (heicFiles.length === 0) return
    setFiles((prev) => {
      const remaining = MAX_FILES - prev.length
      const newEntries: ConvertedFile[] = heicFiles
        .slice(0, remaining)
        .map((f) => ({
          id: `${f.name}-${f.size}-${Math.random()}`,
          file: f,
          name: f.name.replace(/\.(heic|heif)$/i, '.jpg'),
          blob: null,
          status: 'pending',
        }))
      return [...prev, ...newEntries]
    })
  }, [])

  const convertAll = useCallback(async () => {
    const heic2any = (await import('heic2any')).default

    // Snapshot pending items
    let pendingItems: ConvertedFile[] = []
    setFiles((prev) => {
      pendingItems = prev.filter((f) => f.status === 'pending')
      return prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'converting' } : f,
      )
    })

    for (const item of pendingItems) {
      try {
        const result = await heic2any({
          blob: item.file,
          toType: 'image/jpeg',
          quality: QUALITY_MAP[quality],
        })
        const blob = Array.isArray(result) ? result[0] : result
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, blob, status: 'done' } : f,
          ),
        )
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'error', error: 'Conversion failed' }
              : f,
          ),
        )
      }
    }
  }, [quality])

  const downloadOne = useCallback((file: ConvertedFile) => {
    if (!file.blob) return
    const url = URL.createObjectURL(file.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadZip = useCallback(async () => {
    const done = files.filter((f) => f.status === 'done' && f.blob)
    if (done.length === 0) return
    setIsZipping(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      for (const f of done) {
        zip.file(f.name, f.blob!)
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'heic-to-jpg.zip'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsZipping(false)
    }
  }, [files])

  const clearAll = useCallback(() => {
    setFiles([])
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(Array.from(e.dataTransfer.files))
    },
    [addFiles],
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(Array.from(e.target.files))
    },
    [addFiles],
  )

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const convertingCount = files.filter((f) => f.status === 'converting').length
  const doneCount = files.filter((f) => f.status === 'done').length
  const hasConverting = convertingCount > 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'relative flex flex-col items-center justify-center gap-3',
          'border-2 border-dashed rounded-2xl p-12 cursor-pointer',
          'transition-all duration-200 select-none',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50',
          files.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <div className="text-5xl select-none">📷</div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Drop HEIC files here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse — up to {MAX_FILES} files
          </p>
        </div>
        {files.length > 0 && (
          <p className="text-xs text-gray-400">
            {files.length}/{MAX_FILES} files loaded
          </p>
        )}
      </div>

      {files.length > 0 && (
        <>
          {/* Quality selector + clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Quality:</span>
              {(['low', 'medium', 'high'] as Quality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    quality === q
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  ].join(' ')}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}{' '}
                  <span className="opacity-70">({QUALITY_MAP[q] * 100}%)</span>
                </button>
              ))}
            </div>
            <button
              onClick={clearAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* File list */}
          <ul className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {f.status === 'done'
                      ? '✅'
                      : f.status === 'error'
                        ? '❌'
                        : f.status === 'converting'
                          ? '⏳'
                          : '🖼️'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(f.file.size)}
                      {f.blob && (
                        <>
                          {' → '}
                          {formatBytes(f.blob.size)}{' '}
                          <span className="text-green-600">
                            ({f.blob.size >= f.file.size
                              ? `${Math.round((f.blob.size / f.file.size - 1) * 100)}% larger`
                              : `${Math.round((1 - f.blob.size / f.file.size) * 100)}% smaller`}
                          </span>
                        </>
                      )}
                      {f.error && (
                        <span className="text-red-500"> — {f.error}</span>
                      )}
                    </p>
                  </div>
                </div>
                {f.status === 'done' && f.blob && (
                  <button
                    onClick={() => downloadOne(f)}
                    className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Download
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            {pendingCount > 0 && (
              <button
                onClick={convertAll}
                disabled={hasConverting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {hasConverting
                  ? `Converting… (${convertingCount} remaining)`
                  : `Convert ${pendingCount} file${pendingCount !== 1 ? 's' : ''} to JPG`}
              </button>
            )}
            {doneCount > 1 && (
              <button
                onClick={downloadZip}
                disabled={isZipping}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {isZipping ? 'Preparing ZIP…' : `Download all as ZIP (${doneCount} files)`}
              </button>
            )}
            {doneCount === 1 && pendingCount === 0 && !hasConverting && (
              <button
                onClick={() => downloadOne(files.find((f) => f.status === 'done')!)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Download JPG
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
