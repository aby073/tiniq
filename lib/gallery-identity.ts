const STORAGE_KEY = 'skysolve-gallery-user'

export function getGalleryUserId() {
  if (typeof window === 'undefined') return ''
  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const userId = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  window.localStorage.setItem(STORAGE_KEY, userId)
  return userId
}

export function galleryHeaders() {
  return { 'x-gallery-user-id': getGalleryUserId() }
}
