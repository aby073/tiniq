"use client"

import { useEffect, useState } from "react"

type Star = { left: string; top: string; size: string; delay: string; duration: string; opacity: number }

function makeStars(count: number): Star[] { return Array.from({ length: count }, (_, index) => ({ left: `${(index * 47 + 11) % 100}%`, top: `${(index * 71 + 7) % 100}%`, size: `${(index % 3) + 1}px`, delay: `${(index % 9) * 0.7}s`, duration: `${5 + (index % 6)}s`, opacity: 0.14 + (index % 5) * 0.04 })) }

export function Starfield() {
  const [stars, setStars] = useState<Star[]>([])
  useEffect(() => { setStars(makeStars(42)) }, [])
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-70"><div className="starfield-glow" />{stars.map((star, index) => <span key={index} className="starfield-star" style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity: star.opacity, animationDelay: star.delay, animationDuration: star.duration }} />)}</div>
}
