'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut, Images, UserRound } from 'lucide-react'
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

export function AuthControls({ startHref = '#studio', startLabel = 'Boshlash' }: { startHref?: string; startLabel?: string }) {
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useSupabaseAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  if (loading) return <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" aria-label="Sessiya yuklanmoqda" />
  if (user) {
    const metadata = user.user_metadata ?? {}
    const displayName = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Foydalanuvchi'
    const avatarUrl = metadata.avatar_url || metadata.picture
    const initial = displayName.trim().charAt(0).toUpperCase()
    const handleSignOut = async () => { setProfileOpen(false); await signOut(); router.push('/') }
    return <div ref={profileRef} className="relative"><button type="button" onClick={() => setProfileOpen((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card/70 px-2 pr-3 transition-colors hover:bg-secondary" aria-expanded={profileOpen} aria-haspopup="menu"><span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">{avatarUrl ? <img src={avatarUrl} alt="" className="size-full object-cover" referrerPolicy="no-referrer" /> : initial}</span><span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{displayName}</span><ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`} /></button>{profileOpen && <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl"><div className="border-b border-border px-3 pb-2"><p className="truncate text-sm font-semibold">{displayName}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div><a role="menuitem" href="#profil" onClick={() => setProfileOpen(false)} className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary"><UserRound className="size-4 text-muted-foreground" />Profil</a><a role="menuitem" href="#galereya" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-secondary"><Images className="size-4 text-muted-foreground" />Galereya</a><button role="menuitem" type="button" onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"><LogOut className="size-4" />Chiqish</button></div>}</div>
  }
  return <><button type="button" onClick={() => setOpen(true)} className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">{startLabel}</button>{open && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><form className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl" onSubmit={async (event) => { event.preventDefault(); setError(null); const message = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password); if (message) setError(message); else setOpen(false) }}><h2 className="font-serif text-2xl font-semibold">{mode === 'signIn' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</h2><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="mt-5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Parol" className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />{error && <p className="mt-3 text-sm text-destructive">{error}</p>}<button className="mt-5 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground">{mode === 'signIn' ? 'Kirish' : 'Hisob yaratish'}</button><div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-border" />yoki<span className="h-px flex-1 bg-border" /></div><button type="button" onClick={async () => { setError(null); const message = await signInWithGoogle(); if (message) setError(message) }} className="h-11 w-full rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted">Google orqali kirish</button><button type="button" onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground">{mode === 'signIn' ? 'Yangi hisob yaratish' : 'Hisobim bor'}</button></form></div>}</>
}
