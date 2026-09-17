'use client'

import useSWR from 'swr'
import { useState } from 'react'
import Image from 'next/image'
import { Download, Trash2, ImageIcon, Loader2 } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { galleryHeaders } from '@/lib/gallery-identity'

type GalleryItem = { url: string; uploadedAt: string }

const fetcher = (url: string) => fetch(url, { headers: galleryHeaders() }).then((r) => r.json())

export function Gallery() {
  const { t } = useLanguage()
  const { data, isLoading, mutate } = useSWR<{ items: GalleryItem[] }>(
    '/api/gallery',
    fetcher,
  )
  const [deleting, setDeleting] = useState<string | null>(null)

  const items = data?.items ?? []

  const handleDelete = async (url: string) => {
    setDeleting(url)
    try {
      await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...galleryHeaders() },
        body: JSON.stringify({ url }),
      })
      mutate()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section id="galereya" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('gallery')}
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {t('galleryDesc')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <ImageIcon className="h-5 w-5" />
            </span>
            <p className="text-sm">
              {t('noPhotos')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.url}
                className="group relative overflow-hidden rounded-xl border border-border bg-card"
              >
                <Image
                  src={item.url || '/placeholder.svg'}
                  alt="Yaratilgan mahsulot fotosi"
                  width={480}
                  height={480}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={item.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Yuklab olish"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground shadow transition-transform hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.url)}
                    disabled={deleting === item.url}
                    aria-label="O'chirish"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-destructive shadow transition-transform hover:scale-105 disabled:opacity-60"
                  >
                    {deleting === item.url ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
