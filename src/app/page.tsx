import dynamic from 'next/dynamic'

const HeicConverter = dynamic(() => import('@/components/HeicConverter'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50 flex flex-col items-center gap-3">
        <div className="text-5xl">📷</div>
        <p className="text-lg font-semibold text-gray-500">Loading converter…</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            HEIC to JPG Converter
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Convert your iPhone photos to JPG instantly.{' '}
            <strong>100% free, 100% private</strong> — files never leave your
            browser.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span>🔒</span> No uploads
            </span>
            <span className="flex items-center gap-1">
              <span>⚡</span> Instant conversion
            </span>
            <span className="flex items-center gap-1">
              <span>📦</span> Batch up to 20 files
            </span>
            <span className="flex items-center gap-1">
              <span>🎛️</span> Quality control
            </span>
          </div>
        </div>
      </section>

      {/* Converter */}
      <section className="py-8 px-4">
        <HeicConverter />
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How it works
          </h2>
          <ol className="space-y-6">
            {[
              {
                step: '1',
                title: 'Drop your HEIC files',
                desc: 'Drag & drop or click to select up to 20 HEIC/HEIF photos from your iPhone or iPad.',
              },
              {
                step: '2',
                title: 'Choose quality',
                desc: 'Pick Low (60%), Medium (80%), or High (95%) quality. High is recommended for sharing.',
              },
              {
                step: '3',
                title: 'Convert & download',
                desc: 'Click Convert. Download individual JPGs or grab them all as a ZIP — all processed locally.',
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {[
              {
                q: 'What is a HEIC file?',
                a: 'HEIC (High Efficiency Image Container) is the default photo format on iPhones running iOS 11+. It uses HEVC compression for smaller file sizes, but many apps and websites only accept JPG.',
              },
              {
                q: 'Is this converter really free?',
                a: 'Yes, completely free with no limits. No account, no watermark, no file size cap.',
              },
              {
                q: 'Are my photos uploaded anywhere?',
                a: 'No. All conversion happens directly in your browser using WebAssembly. Your photos are never sent to any server.',
              },
              {
                q: 'How many files can I convert at once?',
                a: 'Up to 20 HEIC files per batch. Run multiple batches if you have more.',
              },
              {
                q: 'What quality should I choose?',
                a: 'High (95%) is ideal for printing or archiving. Medium (80%) is great for sharing online. Low (60%) gives the smallest file size for web use.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-gray-800">{q}</dt>
                <dd className="mt-2 text-gray-500 text-sm">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400">
        <p>
          Built by{' '}
          <span className="font-medium text-gray-500">The App Factory</span> —
          App #1 of 365
        </p>
        <p className="mt-1">
          HEIC conversion powered by{' '}
          <a
            href="https://github.com/alexcorvi/heic2any"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            heic2any
          </a>
        </p>
      </footer>
    </main>
  )
}
