'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/components/supabase-auth'
import { useLanguage } from '@/components/language-provider'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn, signUp, signInWithGoogle } = useSupabaseAuth()
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const authText = isRu ? { loading: 'Загрузка', tagline: 'Создавайте фото товаров с AI', signIn: 'Войти', signUp: 'Регистрация', email: 'Email', password: 'Пароль', google: 'Войти через Google', notice: 'На сервере ведутся технические работы. Пока доступен только вход через Google.', terms: 'Продолжая, вы соглашаетесь с условиями использования SkySolve.', submitIn: 'Войти', submitUp: 'Создать аккаунт' } : { loading: 'Yuklanmoqda', tagline: 'AI bilan mahsulot suratlarini yaratish', signIn: 'Kirish', signUp: 'Ro‘yxatdan o‘tish', email: 'Email', password: 'Parol', google: 'Google orqali kirish', notice: 'Serverda texnik ishlar olib borilmoqda. Hozircha faqat Google hisob orqali kirish mumkin.', terms: 'Davom etish orqali SkySolve xizmatidan foydalanish shartlariga rozilik bildirasiz.', submitIn: 'Kirish', submitUp: 'Hisob yaratish' }
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label={authText.loading} /></div>
  if (user) return <>{children}</>

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const message = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password)
    setSubmitting(false)
    if (message) setError(message)
  }

  const continueWithGoogle = async () => {
    setError(null)
    setSubmitting(true)
    const message = await signInWithGoogle()
    if (message) {
      setSubmitting(false)
      setError(message)
    }
  }

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.14),transparent_42%)]" /><section className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8" aria-labelledby="auth-title"><div className="mb-7 text-center"><div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><span className="font-serif text-2xl font-bold">S</span></div><h1 id="auth-title" className="font-serif text-3xl font-semibold tracking-tight">SkySolve</h1><p className="mt-2 text-sm text-muted-foreground">{authText.tagline}</p></div><div className="grid grid-cols-2 rounded-xl bg-secondary p-1" role="tablist"><button type="button" onClick={() => { setMode('signIn'); setError(null) }} className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === 'signIn' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`} aria-selected={mode === 'signIn'}>{authText.signIn}</button><button type="button" onClick={() => { setMode('signUp'); setError(null) }} className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === 'signUp' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`} aria-selected={mode === 'signUp'}>{authText.signUp}</button></div><form className="mt-7 space-y-4" onSubmit={submit}><label className="block text-sm font-medium">{authText.email}<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="block text-sm font-medium">{authText.password}<input required minLength={6} type="password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>{error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>}<button disabled={submitting} className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Kutilmoqda...' : mode === 'signIn' ? 'Kirish' : 'Hisob yaratish'}</button></form><div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-border" />yoki<span className="h-px flex-1 bg-border" /></div><button type="button" disabled={submitting} onClick={continueWithGoogle} className="h-12 w-full rounded-xl border border-border bg-background text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">{authText.google}</button><p className="mt-3 text-center text-xs leading-5 text-amber-300/90">{authText.notice}</p><p className="mt-5 text-center text-xs text-muted-foreground">Davom etish orqali SkySolve xizmatidan foydalanish shartlariga rozilik bildirasiz.</p></section></main>
}
