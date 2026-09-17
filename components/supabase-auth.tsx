'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextValue = { user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<string | null>; signUp: (email: string, password: string) => Promise<string | null>; signInWithGoogle: () => Promise<string | null>; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)

export function SupabaseAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])
  const signIn = async (email: string, password: string) => { const { error } = await createClient().auth.signInWithPassword({ email, password }); return error ? 'Email yoki parol noto‘g‘ri.' : null }
  const signUp = async (email: string, password: string) => { const { error } = await createClient().auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } }); return error ? 'Ro‘yxatdan o‘tishda xatolik yuz berdi.' : null }
  const signInWithGoogle = async () => {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      },
    })
    return error ? 'Google orqali kirishda xatolik yuz berdi.' : null
  }
  const signOut = async () => { await createClient().auth.signOut() }
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth() { const value = useContext(AuthContext); if (!value) throw new Error('SupabaseAuth provider missing'); return value }

export function AuthControls() {
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useSupabaseAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  if (loading) return null
  if (user) return <button type="button" onClick={signOut} className="hidden rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground sm:inline-flex">Chiqish</button>
  return <><button type="button" onClick={() => setOpen(true)} className="hidden rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground sm:inline-flex">Kirish</button>{open && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><form className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl" onSubmit={async (event) => { event.preventDefault(); setError(null); const message = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password); if (message) setError(message); else setOpen(false) }}><h2 className="font-serif text-2xl font-semibold">{mode === 'signIn' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</h2><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="mt-5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Parol" className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />{error && <p className="mt-3 text-sm text-destructive">{error}</p>}<button className="mt-5 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground">{mode === 'signIn' ? 'Kirish' : 'Hisob yaratish'}</button><div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-border" />yoki<span className="h-px flex-1 bg-border" /></div><button type="button" onClick={async () => { setError(null); const message = await signInWithGoogle(); if (message) setError(message) }} className="h-11 w-full rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted">Google orqali kirish</button><button type="button" onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground">{mode === 'signIn' ? 'Yangi hisob yaratish' : 'Hisobim bor'}</button></form></div>}</>
}
