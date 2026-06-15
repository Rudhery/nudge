import { useId } from "react"

/** The Nudge brand mark — an amber "ripple" on espresso, matching the app icon. */
export function BrandMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Nudge">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f7c87a" />
          <stop offset="45%" stopColor="#c9842b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a1714" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="40" height="40" fill="#1a1714" />
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-glow)`} />
      <g fill="none" stroke="#e7a94e" strokeWidth="1.5">
        <circle cx="20" cy="20" r="13.5" strokeOpacity="0.22" />
        <circle cx="20" cy="20" r="9.5" strokeOpacity="0.42" />
        <circle cx="20" cy="20" r="5.5" strokeOpacity="0.72" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill="#fbd68f" />
    </svg>
  )
}
